"use client"

import { useState } from "react"
import { Send, Mail, Clock, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BulkActionsService, type BulkActionResult } from "@/lib/bulk-actions"

// Dummy data for appointments and templates
const appointments = [
  { id: "1", date: new Date() },
  { id: "2", date: new Date(Date.now() + 86400000) }, // Tomorrow
  { id: "3", date: new Date(Date.now() - 86400000) }, // Yesterday
]

const templates = [{ id: "email-template-1", type: "email" }]

const BusinessDashboardPage = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [bulkActionResult, setBulkActionResult] = useState<BulkActionResult | null>(null)
  const [isProcessingBulk, setIsProcessingBulk] = useState(false)

  const handleBulkEmailSend = async (templateId: string) => {
    if (selectedItems.length === 0) {
      alert("Please select recipients first")
      return
    }

    setIsProcessingBulk(true)
    try {
      const result = await BulkActionsService.sendBulkEmails(selectedItems, templateId)
      setBulkActionResult(result)
      alert(`Bulk email completed: ${result.successCount} sent, ${result.failureCount} failed`)
    } catch (error) {
      alert("Failed to send bulk emails")
    } finally {
      setIsProcessingBulk(false)
    }
  }

  const handleQuickAction = async (action: string) => {
    setIsProcessingBulk(true)
    try {
      let result: BulkActionResult

      switch (action) {
        case "reminder":
          result = await BulkActionsService.sendReminderToUpcomingAppointments()
          break
        case "followup":
          result = await BulkActionsService.sendFollowUpToCompletedAppointments()
          break
        case "confirmation":
          const upcomingAppointmentIds = appointments.filter((apt) => apt.date >= new Date()).map((apt) => apt.id)
          result = await BulkActionsService.resendConfirmationEmails(upcomingAppointmentIds)
          break
        default:
          throw new Error("Unknown action")
      }

      setBulkActionResult(result)
      alert(`Action completed: ${result.successCount} sent, ${result.failureCount} failed`)
    } catch (error) {
      alert("Failed to execute action")
    } finally {
      setIsProcessingBulk(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Business Dashboard</h1>

      <div className="flex flex-col space-y-4">
        <Button
          className="bg-black text-white hover:bg-gray-800"
          disabled={isProcessingBulk || selectedItems.length === 0}
          onClick={() => {
            const selectedTemplate = templates.find((t) => t.type === "email")
            if (selectedTemplate) {
              handleBulkEmailSend(selectedTemplate.id)
            }
          }}
        >
          <Send className="h-4 w-4 mr-2" />
          {isProcessingBulk ? "Sending..." : `Send to ${selectedItems.length} Recipients`}
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-gray-200"
          disabled={isProcessingBulk}
          onClick={() => handleQuickAction("confirmation")}
        >
          <Mail className="h-4 w-4 mr-2" />
          Resend Confirmation Emails
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-gray-200"
          disabled={isProcessingBulk}
          onClick={() => handleQuickAction("reminder")}
        >
          <Clock className="h-4 w-4 mr-2" />
          Send Reminder to All Tomorrow's Appointments
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-gray-200"
          disabled={isProcessingBulk}
          onClick={() => handleQuickAction("followup")}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Follow-up to Completed Appointments
        </Button>
      </div>
    </div>
  )
}

export default BusinessDashboardPage
