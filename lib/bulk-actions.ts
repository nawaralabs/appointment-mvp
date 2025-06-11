import { EmailService, type BookingData } from "./email-service"
import { DashboardDataService } from "./dashboard-data"

export interface BulkActionResult {
  success: boolean
  totalProcessed: number
  successCount: number
  failureCount: number
  errors: string[]
  details: Array<{
    clientId: string
    clientName: string
    status: "success" | "failed"
    error?: string
  }>
}

export class BulkActionsService {
  static async sendBulkEmails(
    clientIds: string[],
    templateId: string,
    customData?: Record<string, any>,
  ): Promise<BulkActionResult> {
    const result: BulkActionResult = {
      success: false,
      totalProcessed: 0,
      successCount: 0,
      failureCount: 0,
      errors: [],
      details: [],
    }

    try {
      const clients = DashboardDataService.getClients()
      const appointments = DashboardDataService.getAppointments()
      const templates = DashboardDataService.getMessageTemplates()

      const template = templates.find((t) => t.id === templateId)
      if (!template) {
        result.errors.push("Template not found")
        return result
      }

      const targetClients = clients.filter((client) => clientIds.includes(client.id))
      result.totalProcessed = targetClients.length

      for (const client of targetClients) {
        try {
          // Get client's latest appointment for context
          const clientAppointment = appointments
            .filter((apt) => apt.clientId === client.id)
            .sort((a, b) => b.date.getTime() - a.date.getTime())[0]

          // Prepare booking data for email service
          const bookingData: BookingData = {
            id: clientAppointment?.id || `bulk_${Date.now()}_${client.id}`,
            clientName: client.name,
            clientEmail: client.email,
            clientPhone: client.phone,
            serviceName: clientAppointment?.serviceName || "Service",
            servicePrice: clientAppointment?.servicePrice || 0,
            serviceDuration: clientAppointment?.serviceDuration || 30,
            appointmentDate: clientAppointment?.date || new Date(),
            appointmentTime: clientAppointment?.time || "10:00",
            notes: customData?.notes || "",
            businessName: "Nawara Labs",
            businessEmail: process.env.BUSINESS_EMAIL || "appointments@nawaralabs.com",
            businessPhone: process.env.BUSINESS_PHONE || "+1 (555) 123-4567",
            businessAddress: process.env.BUSINESS_ADDRESS || "123 Business Street, City, State 12345",
          }

          // Replace template variables
          let emailContent = template.content
          let emailSubject = template.subject || "Message from Nawara Labs"

          const variables = {
            clientName: client.name,
            clientEmail: client.email,
            clientPhone: client.phone,
            businessName: bookingData.businessName,
            businessEmail: bookingData.businessEmail,
            businessPhone: bookingData.businessPhone,
            serviceName: bookingData.serviceName,
            servicePrice: bookingData.servicePrice.toString(),
            serviceDuration: bookingData.serviceDuration.toString(),
            appointmentDate: bookingData.appointmentDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            appointmentTime: bookingData.appointmentTime,
            appointmentId: bookingData.id,
            ...customData,
          }

          // Replace all variables in content and subject
          Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
            emailContent = emailContent.replace(regex, value)
            emailSubject = emailSubject.replace(regex, value)
          })

          // Send email
          const emailSent = await EmailService.sendEmail({
            to: client.email,
            subject: emailSubject,
            html: this.formatEmailContent(emailContent, bookingData.businessName),
          })

          if (emailSent) {
            result.successCount++
            result.details.push({
              clientId: client.id,
              clientName: client.name,
              status: "success",
            })
          } else {
            result.failureCount++
            result.details.push({
              clientId: client.id,
              clientName: client.name,
              status: "failed",
              error: "Email delivery failed",
            })
          }
        } catch (error) {
          result.failureCount++
          result.details.push({
            clientId: client.id,
            clientName: client.name,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }

      result.success = result.successCount > 0
      return result
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : "Unknown error occurred")
      return result
    }
  }

  static async sendReminderToUpcomingAppointments(): Promise<BulkActionResult> {
    const appointments = DashboardDataService.getAppointments()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const upcomingAppointments = appointments.filter(
      (apt) => apt.date.toDateString() === tomorrow.toDateString() && !apt.reminderSent && apt.status === "confirmed",
    )

    const clientIds = upcomingAppointments.map((apt) => apt.clientId)
    const reminderTemplate = DashboardDataService.getMessageTemplates().find(
      (t) => t.category === "reminder" && t.type === "email",
    )

    if (!reminderTemplate) {
      return {
        success: false,
        totalProcessed: 0,
        successCount: 0,
        failureCount: 0,
        errors: ["No reminder template found"],
        details: [],
      }
    }

    return await this.sendBulkEmails(clientIds, reminderTemplate.id)
  }

  static async sendFollowUpToCompletedAppointments(): Promise<BulkActionResult> {
    const appointments = DashboardDataService.getAppointments()
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)

    const completedAppointments = appointments.filter((apt) => apt.status === "completed" && apt.date >= lastWeek)

    const clientIds = completedAppointments.map((apt) => apt.clientId)
    const followUpTemplate = DashboardDataService.getMessageTemplates().find(
      (t) => t.category === "followup" && t.type === "email",
    )

    if (!followUpTemplate) {
      return {
        success: false,
        totalProcessed: 0,
        successCount: 0,
        failureCount: 0,
        errors: ["No follow-up template found"],
        details: [],
      }
    }

    return await this.sendBulkEmails(clientIds, followUpTemplate.id)
  }

  static async resendConfirmationEmails(appointmentIds: string[]): Promise<BulkActionResult> {
    const appointments = DashboardDataService.getAppointments()
    const targetAppointments = appointments.filter((apt) => appointmentIds.includes(apt.id))

    const result: BulkActionResult = {
      success: false,
      totalProcessed: targetAppointments.length,
      successCount: 0,
      failureCount: 0,
      errors: [],
      details: [],
    }

    for (const appointment of targetAppointments) {
      try {
        const bookingData: BookingData = {
          id: appointment.id,
          clientName: appointment.clientName,
          clientEmail: appointment.clientEmail,
          clientPhone: appointment.clientPhone,
          serviceName: appointment.serviceName,
          servicePrice: appointment.servicePrice,
          serviceDuration: appointment.serviceDuration,
          appointmentDate: appointment.date,
          appointmentTime: appointment.time,
          notes: appointment.notes,
          businessName: "Nawara Labs",
          businessEmail: process.env.BUSINESS_EMAIL || "appointments@nawaralabs.com",
          businessPhone: process.env.BUSINESS_PHONE || "+1 (555) 123-4567",
          businessAddress: process.env.BUSINESS_ADDRESS || "123 Business Street, City, State 12345",
        }

        const emailSent = await EmailService.sendConfirmationEmail(bookingData)

        if (emailSent) {
          result.successCount++
          result.details.push({
            clientId: appointment.clientId,
            clientName: appointment.clientName,
            status: "success",
          })
        } else {
          result.failureCount++
          result.details.push({
            clientId: appointment.clientId,
            clientName: appointment.clientName,
            status: "failed",
            error: "Email delivery failed",
          })
        }
      } catch (error) {
        result.failureCount++
        result.details.push({
          clientId: appointment.clientId,
          clientName: appointment.clientName,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    result.success = result.successCount > 0
    return result
  }

  private static formatEmailContent(content: string, businessName: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message from ${businessName}</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f5f5f5; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: white; 
            }
            .header { 
                background-color: #000; 
                color: white; 
                padding: 20px; 
                text-align: center; 
            }
            .content { 
                padding: 30px; 
                white-space: pre-wrap;
            }
            .footer { 
                background-color: #f9f9f9; 
                padding: 20px; 
                text-align: center; 
                color: #666; 
                font-size: 14px; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${businessName}</h1>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p>This message was sent by ${businessName}</p>
                <p>If you have any questions, please contact us directly.</p>
            </div>
        </div>
    </body>
    </html>
    `
  }
}
