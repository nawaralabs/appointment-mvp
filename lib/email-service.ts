import { Resend } from "resend"

// Initialize Resend with proper error handling
let resend: Resend | null = null

try {
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey && apiKey !== "your_resend_api_key_here") {
    resend = new Resend(apiKey)
  } else {
    console.warn("Resend API key not configured. Email functionality will be simulated.")
  }
} catch (error) {
  console.warn("Failed to initialize Resend:", error)
  resend = null
}

export interface EmailData {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: string
    contentType: string
  }>
}

export interface BookingData {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceName: string
  servicePrice?: number
  serviceDuration: number
  appointmentDate: Date
  appointmentTime: string
  notes?: string
  businessName: string
  businessEmail: string
  businessPhone?: string
  businessAddress?: string
}

export class EmailService {
  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // If Resend is not configured, simulate email sending for demo purposes
      if (!resend) {
        console.log("📧 [DEMO MODE] Email would be sent:", {
          to: emailData.to,
          subject: emailData.subject,
          hasAttachments: emailData.attachments?.length || 0,
        })

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return true
      }

      const result = await resend.emails.send({
        from: process.env.FROM_EMAIL || "appointments@nawaralabs.com",
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        attachments: emailData.attachments,
      })

      console.log("Email sent successfully:", result)
      return true
    } catch (error) {
      console.error("Failed to send email:", error)

      // In demo mode, still return true to show the flow
      if (!resend) {
        console.log("📧 [DEMO MODE] Email sending simulated as successful")
        return true
      }

      return false
    }
  }

  static generateCalendarInvite(booking: BookingData): string {
    const startDate = new Date(booking.appointmentDate)
    const [hours, minutes] = booking.appointmentTime.split(":")
    startDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)

    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + booking.serviceDuration)

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Nawara Labs//Appointment System//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${booking.id}@nawaralabs.com
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${booking.serviceName} - ${booking.businessName}
DESCRIPTION:Appointment Details:\\n\\nService: ${booking.serviceName}\\nDuration: ${booking.serviceDuration} minutes\\nClient: ${booking.clientName}\\nPhone: ${booking.clientPhone}${booking.notes ? `\\nNotes: ${booking.notes}` : ""}
LOCATION:${booking.businessAddress || booking.businessName}
ORGANIZER;CN=${booking.businessName}:mailto:${booking.businessEmail}
ATTENDEE;CN=${booking.clientName};RSVP=TRUE:mailto:${booking.clientEmail}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`

    return icsContent
  }

  static async sendConfirmationEmail(booking: BookingData): Promise<boolean> {
    const calendarInvite = this.generateCalendarInvite(booking)

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background-color: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .appointment-card { background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: 600; color: #666; }
            .detail-value { font-weight: 500; color: #000; }
            .button { display: inline-block; background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .logo { height: 32px; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Appointment Confirmed</h1>
                <p>Your appointment has been successfully booked</p>
            </div>
            
            <div class="content">
                <p>Dear ${booking.clientName},</p>
                
                <p>Thank you for booking an appointment with <strong>${booking.businessName}</strong>. Your appointment has been confirmed and we look forward to seeing you.</p>
                
                <div class="appointment-card">
                    <h3 style="margin-top: 0; color: #000;">Appointment Details</h3>
                    
                    <div class="detail-row">
                        <span class="detail-label">Service:</span>
                        <span class="detail-value">${booking.serviceName}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${booking.appointmentDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${booking.appointmentTime}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${booking.serviceDuration} minutes</span>
                    </div>
                    
                    ${
                      booking.servicePrice
                        ? `
                    <div class="detail-row">
                        <span class="detail-label">Price:</span>
                        <span class="detail-value">$${booking.servicePrice}</span>
                    </div>
                    `
                        : ""
                    }
                    
                    <div class="detail-row">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value">${booking.id}</span>
                    </div>
                </div>
                
                ${
                  booking.notes
                    ? `
                <div style="margin: 20px 0;">
                    <h4>Additional Notes:</h4>
                    <p style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 0;">${booking.notes}</p>
                </div>
                `
                    : ""
                }
                
                <div style="margin: 30px 0; text-align: center;">
                    <p><strong>Add to your calendar:</strong></p>
                    <p style="font-size: 14px; color: #666;">A calendar invite (.ics file) is attached to this email. Click on it to add this appointment to your calendar.</p>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4>Contact Information:</h4>
                    <p>
                        <strong>${booking.businessName}</strong><br>
                        Email: ${booking.businessEmail}<br>
                        ${booking.businessPhone ? `Phone: ${booking.businessPhone}<br>` : ""}
                        ${booking.businessAddress ? `Address: ${booking.businessAddress}` : ""}
                    </p>
                </div>
                
                <div style="margin: 30px 0; padding: 20px; background-color: #f0f9ff; border-radius: 6px;">
                    <h4 style="margin-top: 0; color: #0369a1;">Important Reminders:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Please arrive 5-10 minutes before your scheduled time</li>
                        <li>You will receive a reminder email 24 hours before your appointment</li>
                        <li>If you need to reschedule or cancel, please contact us at least 24 hours in advance</li>
                        <li>Bring any relevant documents or information related to your appointment</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated confirmation email from ${booking.businessName}</p>
                <p>If you have any questions, please contact us at ${booking.businessEmail}</p>
            </div>
        </div>
    </body>
    </html>
    `

    return await this.sendEmail({
      to: booking.clientEmail,
      subject: `Appointment Confirmed - ${booking.serviceName} on ${booking.appointmentDate.toLocaleDateString()}`,
      html,
      attachments: [
        {
          filename: "appointment.ics",
          content: Buffer.from(calendarInvite).toString("base64"),
          contentType: "text/calendar",
        },
      ],
    })
  }

  static async sendReminderEmail(booking: BookingData): Promise<boolean> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Reminder</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .reminder-card { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .appointment-card { background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: 600; color: #666; }
            .detail-value { font-weight: 500; color: #000; }
            .button { display: inline-block; background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .button-secondary { background-color: #6b7280; }
            .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⏰ Appointment Reminder</h1>
                <p>Your appointment is coming up soon</p>
            </div>
            
            <div class="content">
                <div class="reminder-card">
                    <h3 style="margin-top: 0; color: #92400e;">Reminder: Appointment Tomorrow</h3>
                    <p style="margin-bottom: 0; color: #92400e;">This is a friendly reminder that you have an appointment scheduled for tomorrow.</p>
                </div>
                
                <p>Dear ${booking.clientName},</p>
                
                <p>We wanted to remind you about your upcoming appointment with <strong>${booking.businessName}</strong>.</p>
                
                <div class="appointment-card">
                    <h3 style="margin-top: 0; color: #000;">Appointment Details</h3>
                    
                    <div class="detail-row">
                        <span class="detail-label">Service:</span>
                        <span class="detail-value">${booking.serviceName}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${booking.appointmentDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${booking.appointmentTime}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${booking.serviceDuration} minutes</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value">${booking.id}</span>
                    </div>
                </div>
                
                <div style="margin: 30px 0; text-align: center;">
                    <a href="mailto:${booking.businessEmail}?subject=Appointment%20Confirmation%20-%20${booking.id}" class="button">Confirm Appointment</a>
                    <a href="mailto:${booking.businessEmail}?subject=Reschedule%20Request%20-%20${booking.id}" class="button button-secondary">Reschedule</a>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4>Contact Information:</h4>
                    <p>
                        <strong>${booking.businessName}</strong><br>
                        Email: ${booking.businessEmail}<br>
                        ${booking.businessPhone ? `Phone: ${booking.businessPhone}<br>` : ""}
                        ${booking.businessAddress ? `Address: ${booking.businessAddress}` : ""}
                    </p>
                </div>
                
                <div style="margin: 30px 0; padding: 20px; background-color: #f0f9ff; border-radius: 6px;">
                    <h4 style="margin-top: 0; color: #0369a1;">Preparation Checklist:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Arrive 5-10 minutes early</li>
                        <li>Bring any relevant documents</li>
                        <li>Have your booking ID ready: <strong>${booking.id}</strong></li>
                        <li>Contact us if you need to make any changes</li>
                    </ul>
                </div>
                
                <div style="margin: 30px 0; padding: 15px; background-color: #fee2e2; border-radius: 6px; border-left: 4px solid #ef4444;">
                    <p style="margin: 0; color: #991b1b;"><strong>Cancellation Policy:</strong> Please provide at least 24 hours notice for cancellations or rescheduling to avoid any fees.</p>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated reminder from ${booking.businessName}</p>
                <p>If you have any questions, please contact us at ${booking.businessEmail}</p>
            </div>
        </div>
    </body>
    </html>
    `

    return await this.sendEmail({
      to: booking.clientEmail,
      subject: `Reminder: ${booking.serviceName} appointment tomorrow at ${booking.appointmentTime}`,
      html,
    })
  }

  static async sendBusinessNotification(booking: BookingData): Promise<boolean> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Appointment Booking</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .booking-card { background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: 600; color: #666; }
            .detail-value { font-weight: 500; color: #000; }
            .client-info { background-color: #f9f9f9; border-radius: 6px; padding: 15px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 New Appointment Booked</h1>
                <p>You have received a new appointment booking</p>
            </div>
            
            <div class="content">
                <div class="booking-card">
                    <h3 style="margin-top: 0; color: #059669;">New Booking Alert</h3>
                    <p style="margin-bottom: 0; color: #059669;">A new appointment has been scheduled through your booking system.</p>
                </div>
                
                <h3>Appointment Details</h3>
                
                <div class="detail-row">
                    <span class="detail-label">Service:</span>
                    <span class="detail-value">${booking.serviceName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${booking.appointmentDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${booking.appointmentTime}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">${booking.serviceDuration} minutes</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Booking ID:</span>
                    <span class="detail-value">${booking.id}</span>
                </div>
                
                <div class="client-info">
                    <h4 style="margin-top: 0;">Client Information</h4>
                    <p><strong>Name:</strong> ${booking.clientName}</p>
                    <p><strong>Email:</strong> ${booking.clientEmail}</p>
                    <p><strong>Phone:</strong> ${booking.clientPhone}</p>
                    ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ""}
                </div>
                
                <div style="margin: 30px 0; padding: 15px; background-color: #eff6ff; border-radius: 6px;">
                    <h4 style="margin-top: 0; color: #1d4ed8;">Next Steps:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>The client has been sent a confirmation email with calendar invite</li>
                        <li>A reminder email will be sent 24 hours before the appointment</li>
                        <li>Add this appointment to your calendar using the attached .ics file</li>
                        <li>Contact the client if you need to confirm any details</li>
                    </ul>
                </div>
            </div>
        </div>
    </body>
    </html>
    `

    const calendarInvite = this.generateCalendarInvite(booking)

    return await this.sendEmail({
      to: booking.businessEmail,
      subject: `New Appointment: ${booking.clientName} - ${booking.serviceName}`,
      html,
      attachments: [
        {
          filename: "appointment.ics",
          content: Buffer.from(calendarInvite).toString("base64"),
          contentType: "text/calendar",
        },
      ],
    })
  }
}
