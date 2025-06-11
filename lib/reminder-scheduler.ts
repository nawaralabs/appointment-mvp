import { EmailService, type BookingData } from "./email-service"

export interface ScheduledReminder {
  id: string
  bookingId: string
  scheduledFor: Date
  type: "reminder" | "followup"
  status: "pending" | "sent" | "failed"
  attempts: number
}

export class ReminderScheduler {
  private static reminders: Map<string, ScheduledReminder> = new Map()
  private static intervalId: NodeJS.Timeout | null = null

  static scheduleReminder(booking: BookingData): string {
    // Calculate reminder time (24 hours before appointment)
    const appointmentDateTime = new Date(booking.appointmentDate)
    const [hours, minutes] = booking.appointmentTime.split(":")
    appointmentDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)

    const reminderTime = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000) // 24 hours before

    // Don't schedule if appointment is within 24 hours
    if (reminderTime <= new Date()) {
      console.log("Appointment is within 24 hours, skipping reminder scheduling")
      return ""
    }

    const reminderId = `reminder_${booking.id}_${Date.now()}`
    const reminder: ScheduledReminder = {
      id: reminderId,
      bookingId: booking.id,
      scheduledFor: reminderTime,
      type: "reminder",
      status: "pending",
      attempts: 0,
    }

    this.reminders.set(reminderId, reminder)
    console.log(`Reminder scheduled for ${reminderTime.toISOString()} for booking ${booking.id}`)

    // Start the scheduler if not already running
    this.startScheduler()

    return reminderId
  }

  static startScheduler(): void {
    if (this.intervalId) return // Already running

    console.log("Starting reminder scheduler...")
    this.intervalId = setInterval(() => {
      this.processReminders()
    }, 60000) // Check every minute
  }

  static stopScheduler(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log("Reminder scheduler stopped")
    }
  }

  private static async processReminders(): Promise<void> {
    const now = new Date()
    const pendingReminders = Array.from(this.reminders.values()).filter(
      (reminder) => reminder.status === "pending" && reminder.scheduledFor <= now && reminder.attempts < 3, // Max 3 attempts
    )

    for (const reminder of pendingReminders) {
      try {
        console.log(`Processing reminder ${reminder.id} for booking ${reminder.bookingId}`)

        // In a real application, you would fetch the booking data from your database
        // For this demo, we'll simulate it
        const bookingData = await this.getBookingData(reminder.bookingId)

        if (bookingData) {
          const success = await EmailService.sendReminderEmail(bookingData)

          if (success) {
            reminder.status = "sent"
            console.log(`Reminder sent successfully for booking ${reminder.bookingId}`)
          } else {
            reminder.attempts++
            if (reminder.attempts >= 3) {
              reminder.status = "failed"
              console.error(`Failed to send reminder for booking ${reminder.bookingId} after 3 attempts`)
            } else {
              // Retry in 5 minutes
              reminder.scheduledFor = new Date(now.getTime() + 5 * 60 * 1000)
              console.log(`Retrying reminder for booking ${reminder.bookingId} in 5 minutes`)
            }
          }
        } else {
          reminder.status = "failed"
          console.error(`Booking data not found for reminder ${reminder.id}`)
        }
      } catch (error) {
        console.error(`Error processing reminder ${reminder.id}:`, error)
        reminder.attempts++
        if (reminder.attempts >= 3) {
          reminder.status = "failed"
        }
      }
    }
  }

  private static async getBookingData(bookingId: string): Promise<BookingData | null> {
    // In a real application, this would fetch from your database
    // For demo purposes, we'll return mock data
    // You should replace this with actual database queries

    try {
      // Simulate database lookup
      const mockBooking: BookingData = {
        id: bookingId,
        clientName: "John Doe",
        clientEmail: "john@example.com",
        clientPhone: "+1234567890",
        serviceName: "Consultation",
        servicePrice: 100,
        serviceDuration: 30,
        appointmentDate: new Date(),
        appointmentTime: "10:00",
        businessName: "Nawara Labs",
        businessEmail: "appointments@nawaralabs.com",
        businessPhone: "+1234567890",
        businessAddress: "123 Business St, City, State 12345",
      }

      return mockBooking
    } catch (error) {
      console.error("Error fetching booking data:", error)
      return null
    }
  }

  static getScheduledReminders(): ScheduledReminder[] {
    return Array.from(this.reminders.values())
  }

  static cancelReminder(reminderId: string): boolean {
    const reminder = this.reminders.get(reminderId)
    if (reminder && reminder.status === "pending") {
      reminder.status = "failed" // Mark as cancelled
      return true
    }
    return false
  }

  static getReminder(reminderId: string): ScheduledReminder | undefined {
    return this.reminders.get(reminderId)
  }
}

// Start the scheduler when the module loads
if (typeof window === "undefined") {
  // Only on server side
  ReminderScheduler.startScheduler()
}
