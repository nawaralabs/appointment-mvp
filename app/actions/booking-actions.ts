"use server"

import { EmailService, type BookingData } from "@/lib/email-service"
import { ReminderScheduler } from "@/lib/reminder-scheduler"

export interface BookingFormData {
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceName: string
  servicePrice?: number
  serviceDuration: number
  appointmentDate: string
  appointmentTime: string
  notes?: string
}

export async function processBooking(formData: BookingFormData) {
  try {
    // Generate unique booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create booking data object
    const bookingData: BookingData = {
      id: bookingId,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      serviceName: formData.serviceName,
      servicePrice: formData.servicePrice,
      serviceDuration: formData.serviceDuration,
      appointmentDate: new Date(formData.appointmentDate),
      appointmentTime: formData.appointmentTime,
      notes: formData.notes,
      businessName: "Nawara Labs",
      businessEmail: process.env.BUSINESS_EMAIL || "appointments@nawaralabs.com",
      businessPhone: process.env.BUSINESS_PHONE || "+1 (555) 123-4567",
      businessAddress: process.env.BUSINESS_ADDRESS || "123 Business Street, City, State 12345",
    }

    // Save booking to database (implement your database logic here)
    await saveBookingToDatabase(bookingData)

    // Send confirmation email to client (with error handling)
    let clientEmailSent = false
    let businessEmailSent = false

    try {
      clientEmailSent = await EmailService.sendConfirmationEmail(bookingData)
    } catch (error) {
      console.warn("Failed to send client confirmation email:", error)
      clientEmailSent = false
    }

    // Send notification email to business (with error handling)
    try {
      businessEmailSent = await EmailService.sendBusinessNotification(bookingData)
    } catch (error) {
      console.warn("Failed to send business notification email:", error)
      businessEmailSent = false
    }

    // Schedule reminder email (with error handling)
    let reminderId = ""
    try {
      reminderId = ReminderScheduler.scheduleReminder(bookingData)
    } catch (error) {
      console.warn("Failed to schedule reminder:", error)
    }

    console.log("Booking processed successfully:", {
      bookingId,
      clientEmailSent,
      businessEmailSent,
      reminderId,
    })

    return {
      success: true,
      bookingId,
      message: "Appointment booked successfully! Check your email for confirmation.",
      emailStatus: {
        clientConfirmation: clientEmailSent,
        businessNotification: businessEmailSent,
        reminderScheduled: !!reminderId,
      },
    }
  } catch (error) {
    console.error("Error processing booking:", error)
    return {
      success: false,
      message: "Failed to process booking. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function saveBookingToDatabase(bookingData: BookingData) {
  // Implement your database save logic here
  // This could be with Prisma, Supabase, or any other database solution
  console.log("Saving booking to database:", bookingData.id)

  // For demo purposes, we'll just log it
  // In a real application, you would save to your database
  return true
}

export async function getBookingStatus(bookingId: string) {
  try {
    // Fetch booking from database
    // For demo, return mock data
    return {
      success: true,
      booking: {
        id: bookingId,
        status: "confirmed",
        clientName: "John Doe",
        serviceName: "Consultation",
        appointmentDate: new Date().toISOString(),
        appointmentTime: "10:00",
      },
    }
  } catch (error) {
    return {
      success: false,
      message: "Booking not found",
    }
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    // Cancel the booking in database
    // Cancel any scheduled reminders
    const reminders = ReminderScheduler.getScheduledReminders()
    const bookingReminders = reminders.filter((r) => r.bookingId === bookingId)

    bookingReminders.forEach((reminder) => {
      ReminderScheduler.cancelReminder(reminder.id)
    })

    return {
      success: true,
      message: "Booking cancelled successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to cancel booking",
    }
  }
}
