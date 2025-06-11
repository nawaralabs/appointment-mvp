export interface Client {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  totalAppointments: number
  lastAppointment?: Date
  nextAppointment?: Date
  status: "active" | "inactive" | "new"
  notes?: string
  createdAt: Date
  tags: string[]
}

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceName: string
  servicePrice: number
  serviceDuration: number
  date: Date
  time: string
  status: "confirmed" | "pending" | "completed" | "cancelled" | "no-show"
  notes?: string
  createdAt: Date
  reminderSent: boolean
  confirmationSent: boolean
  paymentStatus: "paid" | "pending" | "refunded"
}

export interface Communication {
  id: string
  clientId: string
  clientName: string
  type: "email" | "sms" | "call" | "note"
  subject?: string
  content: string
  status: "sent" | "delivered" | "failed" | "pending"
  sentAt: Date
  sentBy: string
  appointmentId?: string
}

export interface MessageTemplate {
  id: string
  name: string
  type: "email" | "sms"
  subject?: string
  content: string
  variables: string[]
  category: "reminder" | "confirmation" | "followup" | "marketing" | "custom"
  createdAt: Date
  lastUsed?: Date
  usageCount: number
}

// Mock data service
export class DashboardDataService {
  static getClients(): Client[] {
    return [
      {
        id: "client_1",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        totalAppointments: 8,
        lastAppointment: new Date("2024-01-10"),
        nextAppointment: new Date("2024-01-20"),
        status: "active",
        createdAt: new Date("2023-06-15"),
        tags: ["VIP", "Regular"],
        notes: "Prefers morning appointments",
      },
      {
        id: "client_2",
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+1 (555) 234-5678",
        totalAppointments: 3,
        lastAppointment: new Date("2024-01-08"),
        nextAppointment: new Date("2024-01-25"),
        status: "active",
        createdAt: new Date("2023-11-20"),
        tags: ["New Client"],
        notes: "Referred by John Smith",
      },
      {
        id: "client_3",
        name: "Mike Davis",
        email: "mike.davis@example.com",
        phone: "+1 (555) 345-6789",
        totalAppointments: 12,
        lastAppointment: new Date("2024-01-05"),
        status: "active",
        createdAt: new Date("2023-03-10"),
        tags: ["Long-term", "VIP"],
        notes: "Always punctual, prefers Dr. Smith",
      },
      {
        id: "client_4",
        name: "Emily Chen",
        email: "emily.chen@example.com",
        phone: "+1 (555) 456-7890",
        totalAppointments: 1,
        status: "new",
        createdAt: new Date("2024-01-12"),
        tags: ["New Client"],
        notes: "First-time client, nervous about procedures",
      },
    ]
  }

  static getAppointments(): Appointment[] {
    return [
      {
        id: "apt_1",
        clientId: "client_1",
        clientName: "John Smith",
        clientEmail: "john.smith@example.com",
        clientPhone: "+1 (555) 123-4567",
        serviceName: "Consultation",
        servicePrice: 100,
        serviceDuration: 30,
        date: new Date("2024-01-20"),
        time: "10:00",
        status: "confirmed",
        createdAt: new Date("2024-01-15"),
        reminderSent: false,
        confirmationSent: true,
        paymentStatus: "paid",
        notes: "Follow-up consultation",
      },
      {
        id: "apt_2",
        clientId: "client_2",
        clientName: "Sarah Johnson",
        clientEmail: "sarah.j@example.com",
        clientPhone: "+1 (555) 234-5678",
        serviceName: "Assessment",
        servicePrice: 150,
        serviceDuration: 45,
        date: new Date("2024-01-25"),
        time: "14:30",
        status: "pending",
        createdAt: new Date("2024-01-18"),
        reminderSent: false,
        confirmationSent: true,
        paymentStatus: "pending",
      },
      {
        id: "apt_3",
        clientId: "client_3",
        clientName: "Mike Davis",
        clientEmail: "mike.davis@example.com",
        clientPhone: "+1 (555) 345-6789",
        serviceName: "Treatment",
        servicePrice: 200,
        serviceDuration: 60,
        date: new Date("2024-01-15"),
        time: "09:30",
        status: "completed",
        createdAt: new Date("2024-01-10"),
        reminderSent: true,
        confirmationSent: true,
        paymentStatus: "paid",
        notes: "Treatment went well, schedule follow-up",
      },
      {
        id: "apt_4",
        clientId: "client_4",
        clientName: "Emily Chen",
        clientEmail: "emily.chen@example.com",
        clientPhone: "+1 (555) 456-7890",
        serviceName: "Consultation",
        servicePrice: 100,
        serviceDuration: 30,
        date: new Date("2024-01-22"),
        time: "11:00",
        status: "confirmed",
        createdAt: new Date("2024-01-19"),
        reminderSent: false,
        confirmationSent: true,
        paymentStatus: "pending",
      },
    ]
  }

  static getCommunications(): Communication[] {
    return [
      {
        id: "comm_1",
        clientId: "client_1",
        clientName: "John Smith",
        type: "email",
        subject: "Appointment Confirmation",
        content: "Your appointment has been confirmed for January 20th at 10:00 AM",
        status: "delivered",
        sentAt: new Date("2024-01-15T10:30:00"),
        sentBy: "System",
        appointmentId: "apt_1",
      },
      {
        id: "comm_2",
        clientId: "client_2",
        clientName: "Sarah Johnson",
        type: "email",
        subject: "Appointment Confirmation",
        content: "Your assessment appointment has been confirmed for January 25th at 2:30 PM",
        status: "delivered",
        sentAt: new Date("2024-01-18T15:45:00"),
        sentBy: "System",
        appointmentId: "apt_2",
      },
      {
        id: "comm_3",
        clientId: "client_3",
        clientName: "Mike Davis",
        type: "email",
        subject: "Appointment Reminder",
        content: "Reminder: You have an appointment tomorrow at 9:30 AM",
        status: "delivered",
        sentAt: new Date("2024-01-14T09:00:00"),
        sentBy: "System",
        appointmentId: "apt_3",
      },
      {
        id: "comm_4",
        clientId: "client_1",
        clientName: "John Smith",
        type: "note",
        content: "Client called to confirm appointment time. Mentioned he might be 5 minutes late.",
        status: "sent",
        sentAt: new Date("2024-01-19T14:20:00"),
        sentBy: "Dr. Smith",
      },
    ]
  }

  static getMessageTemplates(): MessageTemplate[] {
    return [
      {
        id: "template_1",
        name: "Appointment Reminder",
        type: "email",
        subject: "Reminder: {{serviceName}} appointment tomorrow",
        content: `Dear {{clientName}},

This is a friendly reminder that you have a {{serviceName}} appointment scheduled for tomorrow, {{appointmentDate}} at {{appointmentTime}}.

Please arrive 5-10 minutes early and bring any relevant documents.

If you need to reschedule or cancel, please contact us at least 24 hours in advance.

Best regards,
{{businessName}}`,
        variables: ["clientName", "serviceName", "appointmentDate", "appointmentTime", "businessName"],
        category: "reminder",
        createdAt: new Date("2023-12-01"),
        lastUsed: new Date("2024-01-14"),
        usageCount: 45,
      },
      {
        id: "template_2",
        name: "Appointment Confirmation",
        type: "email",
        subject: "Appointment Confirmed - {{serviceName}}",
        content: `Dear {{clientName}},

Thank you for booking an appointment with {{businessName}}. Your appointment has been confirmed.

Appointment Details:
- Service: {{serviceName}}
- Date: {{appointmentDate}}
- Time: {{appointmentTime}}
- Duration: {{serviceDuration}} minutes
- Price: {{servicePrice}}

We look forward to seeing you!

Best regards,
{{businessName}}`,
        variables: [
          "clientName",
          "businessName",
          "serviceName",
          "appointmentDate",
          "appointmentTime",
          "serviceDuration",
          "servicePrice",
        ],
        category: "confirmation",
        createdAt: new Date("2023-12-01"),
        lastUsed: new Date("2024-01-18"),
        usageCount: 89,
      },
      {
        id: "template_3",
        name: "Follow-up Message",
        type: "email",
        subject: "How was your {{serviceName}} appointment?",
        content: `Dear {{clientName}},

We hope your recent {{serviceName}} appointment went well. Your feedback is important to us.

If you have any questions or concerns, please don't hesitate to reach out.

We'd also appreciate if you could leave us a review to help other clients.

Thank you for choosing {{businessName}}!

Best regards,
{{businessName}}`,
        variables: ["clientName", "serviceName", "businessName"],
        category: "followup",
        createdAt: new Date("2023-12-15"),
        lastUsed: new Date("2024-01-10"),
        usageCount: 23,
      },
      {
        id: "template_4",
        name: "SMS Reminder",
        type: "sms",
        content:
          "Hi {{clientName}}, reminder: {{serviceName}} appointment tomorrow at {{appointmentTime}}. Reply CONFIRM to confirm or CANCEL to cancel. - {{businessName}}",
        variables: ["clientName", "serviceName", "appointmentTime", "businessName"],
        category: "reminder",
        createdAt: new Date("2024-01-01"),
        usageCount: 12,
      },
    ]
  }
}
