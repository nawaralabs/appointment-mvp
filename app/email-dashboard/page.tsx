"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Calendar, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ReminderScheduler } from "@/lib/reminder-scheduler"

export default function EmailDashboard() {
  const [reminders, setReminders] = useState<any[]>([])
  const [emailStats, setEmailStats] = useState({
    totalSent: 0,
    confirmationsSent: 0,
    remindersSent: 0,
    failed: 0,
  })

  useEffect(() => {
    loadReminders()
    loadEmailStats()
  }, [])

  const loadReminders = () => {
    const scheduledReminders = ReminderScheduler.getScheduledReminders()
    setReminders(scheduledReminders)
  }

  const loadEmailStats = () => {
    // In a real app, this would fetch from your database
    setEmailStats({
      totalSent: 156,
      confirmationsSent: 89,
      remindersSent: 67,
      failed: 3,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/nawara-labs-logo.png"
                alt="Nawara Labs"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <h1 className="text-xl font-semibold text-black">Email Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={loadReminders} variant="outline" className="border-gray-200">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/dashboard">
              <Button className="bg-black text-white hover:bg-gray-800">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Email Workflow Dashboard</h1>
            <p className="text-gray-600">Monitor automated email confirmations and reminders</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Emails Sent</CardTitle>
                <Mail className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{emailStats.totalSent}</div>
                <p className="text-xs text-gray-600">All time</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Confirmations</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{emailStats.confirmationsSent}</div>
                <p className="text-xs text-gray-600">Instant confirmations</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Reminders</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{emailStats.remindersSent}</div>
                <p className="text-xs text-gray-600">24hr reminders</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{emailStats.failed}</div>
                <p className="text-xs text-gray-600">Delivery failures</p>
              </CardContent>
            </Card>
          </div>

          {/* Email Workflow Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Instant Confirmations
                </CardTitle>
                <CardDescription>Automated confirmation emails with calendar invites</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-black">Professional Templates</h4>
                    <p className="text-sm text-gray-600">Branded email templates with appointment details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-black">Calendar Integration</h4>
                    <p className="text-sm text-gray-600">Automatic .ics file attachment for easy calendar import</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-black">Business Notifications</h4>
                    <p className="text-sm text-gray-600">Instant alerts to business owners for new bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Smart Reminders
                </CardTitle>
                <CardDescription>Automated reminder system with retry logic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-black">24-Hour Advance Notice</h4>
                    <p className="text-sm text-gray-600">Automatic reminders sent 24 hours before appointments</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-black">Retry Mechanism</h4>
                    <p className="text-sm text-gray-600">Up to 3 delivery attempts with 5-minute intervals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-black">Smart Scheduling</h4>
                    <p className="text-sm text-gray-600">Automatically skips reminders for same-day appointments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scheduled Reminders */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Scheduled Reminders</CardTitle>
              <CardDescription>View and manage upcoming email reminders</CardDescription>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No scheduled reminders at the moment</p>
                  <p className="text-sm text-gray-500 mt-2">Reminders will appear here when appointments are booked</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(reminder.status)}
                        <div>
                          <p className="font-medium text-black">Booking ID: {reminder.bookingId}</p>
                          <p className="text-sm text-gray-600">
                            Scheduled for: {new Date(reminder.scheduledFor).toLocaleString()}
                          </p>
                          {reminder.attempts > 0 && (
                            <p className="text-xs text-gray-500">Attempts: {reminder.attempts}/3</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(reminder.status)}>{reminder.status}</Badge>
                        <Badge variant="outline" className="border-gray-300">
                          {reminder.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Templates Preview */}
          <div className="mt-8">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Email Templates</CardTitle>
                <CardDescription>Preview of automated email templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-black">Confirmation Email</h4>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <div className="font-medium mb-2">Subject: Appointment Confirmed - Consultation on Jan 15</div>
                      <div className="text-gray-600">
                        <p>Dear John,</p>
                        <p>Thank you for booking an appointment with Nawara Labs...</p>
                        <div className="mt-2 p-2 bg-white rounded border">
                          <strong>Appointment Details:</strong>
                          <br />
                          Service: Consultation
                          <br />
                          Date: Monday, January 15, 2024
                          <br />
                          Time: 10:00 AM
                          <br />
                          Duration: 30 minutes
                        </div>
                        <p className="mt-2">📎 Calendar invite attached</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-black">Reminder Email</h4>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <div className="font-medium mb-2">
                        Subject: Reminder: Consultation appointment tomorrow at 10:00
                      </div>
                      <div className="text-gray-600">
                        <div className="bg-yellow-100 p-2 rounded mb-2 border-l-4 border-yellow-500">
                          <strong>⏰ Reminder: Appointment Tomorrow</strong>
                          <br />
                          This is a friendly reminder about your upcoming appointment.
                        </div>
                        <p>Dear John,</p>
                        <p>We wanted to remind you about your appointment with Nawara Labs...</p>
                        <div className="mt-2 flex space-x-2">
                          <button className="bg-black text-white px-3 py-1 rounded text-xs">Confirm</button>
                          <button className="bg-gray-500 text-white px-3 py-1 rounded text-xs">Reschedule</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
