"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Check, Mail } from "lucide-react"
import Image from "next/image"
import { processBooking } from "@/app/actions/booking-actions"

interface BookingWidgetProps {
  businessName?: string
  primaryColor?: string
  services?: Array<{
    id: string
    name: string
    duration: number
    price?: number
  }>
  timeSlots?: string[]
  onBookingComplete?: (booking: any) => void
  embedded?: boolean
}

export default function BookingWidget({
  businessName = "Nawara Labs",
  primaryColor = "#000000",
  services = [
    { id: "consultation", name: "Consultation", duration: 30, price: 100 },
    { id: "followup", name: "Follow-up", duration: 15, price: 50 },
    { id: "assessment", name: "Assessment", duration: 45, price: 150 },
    { id: "treatment", name: "Treatment", duration: 60, price: 200 },
  ],
  timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ],
  onBookingComplete,
  embedded = false,
}: BookingWidgetProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [bookingResult, setBookingResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

  // Simulate real-time availability check
  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true)
      setTimeout(() => {
        const unavailableSlots = ["10:00", "14:30", "16:00"]
        const available = timeSlots.filter((slot) => !unavailableSlots.includes(slot))
        setAvailableSlots(available)
        setIsLoading(false)
      }, 500)
    }
  }, [selectedDate, timeSlots])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const isDateAvailable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today && date.getDay() !== 0
  }

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date)
      setSelectedTime("")
      setCurrentStep(3)
    }
  }

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedService) return

    setIsLoading(true)

    const selectedServiceData = services.find((s) => s.id === selectedService)
    if (!selectedServiceData) return

    try {
      const result = await processBooking({
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        serviceName: selectedServiceData.name,
        servicePrice: selectedServiceData.price,
        serviceDuration: selectedServiceData.duration,
        appointmentDate: selectedDate.toISOString().split("T")[0],
        appointmentTime: selectedTime,
        notes: formData.notes,
      })

      setBookingResult(result)

      if (result.success) {
        setCurrentStep(5)
        if (onBookingComplete) {
          onBookingComplete({
            id: result.bookingId,
            service: selectedServiceData,
            date: selectedDate,
            time: selectedTime,
            client: formData,
          })
        }
      } else {
        alert(result.message || "Failed to book appointment. Please try again.")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("Failed to book appointment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetWidget = () => {
    setCurrentStep(1)
    setSelectedService("")
    setSelectedDate(null)
    setSelectedTime("")
    setFormData({ name: "", email: "", phone: "", notes: "" })
    setBookingResult(null)
  }

  const selectedServiceData = services.find((s) => s.id === selectedService)

  const containerClass = embedded
    ? "w-full max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200"
    : "w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200"

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src="/images/nawara-labs-logo.png" alt={businessName} width={80} height={26} className="h-6 w-auto" />
          <span className="font-semibold text-gray-900">Book Appointment</span>
        </div>
        {currentStep > 1 && currentStep < 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="px-4 py-2 bg-gray-50">
        <div className="flex items-center justify-between text-xs">
          {["Service", "Date", "Time", "Details", "Confirm"].map((step, index) => (
            <div
              key={step}
              className={`flex items-center ${index + 1 <= currentStep ? "text-black" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  index + 1 < currentStep
                    ? "bg-black text-white"
                    : index + 1 === currentStep
                      ? "bg-gray-200 text-black"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {index + 1 < currentStep ? <Check className="h-3 w-3" /> : index + 1}
              </div>
              <span className="ml-1 hidden sm:inline">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Select a Service</h3>
              <p className="text-sm text-gray-600 mb-4">Choose the service you'd like to book</p>
            </div>
            <div className="space-y-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedService === service.id ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-black">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.duration} minutes</p>
                    </div>
                    {service.price && (
                      <Badge variant="outline" className="border-gray-300">
                        ${service.price}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedService}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Date Selection */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Select Date</h3>
              <p className="text-sm text-gray-600 mb-4">
                {selectedServiceData?.name} - {selectedServiceData?.duration} minutes
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h4 className="font-medium text-black">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div key={index} className="aspect-square">
                  {date && (
                    <button
                      onClick={() => handleDateSelect(date)}
                      disabled={!isDateAvailable(date)}
                      className={`w-full h-full rounded-lg text-sm font-medium transition-colors ${
                        selectedDate?.toDateString() === date.toDateString()
                          ? "bg-black text-white"
                          : isDateAvailable(date)
                            ? "hover:bg-gray-100 text-black"
                            : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Time Selection */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Select Time</h3>
              <p className="text-sm text-gray-600 mb-4">
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading available times...</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className={
                      selectedTime === time ? "bg-black text-white" : "border-gray-200 text-gray-700 hover:bg-gray-100"
                    }
                  >
                    {time}
                  </Button>
                ))}
              </div>
            )}

            <Button
              onClick={() => setCurrentStep(4)}
              disabled={!selectedTime}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 4: Contact Details */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Your Details</h3>
              <p className="text-sm text-gray-600 mb-4">Please provide your contact information</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-black text-sm">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-gray-200 focus:border-black"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-black text-sm">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-gray-200 focus:border-black"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-black text-sm">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-gray-200 focus:border-black"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-black text-sm">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="border-gray-200 focus:border-black"
                  placeholder="Any specific requirements..."
                  rows={2}
                />
              </div>
            </div>

            <Button
              onClick={handleBookingSubmit}
              disabled={!formData.name || !formData.email || !formData.phone || isLoading}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              {isLoading ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && bookingResult && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Booking Confirmed!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your appointment has been successfully booked. You'll receive a confirmation email shortly.
              </p>
            </div>

            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium text-black">{bookingResult.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium text-black">{selectedServiceData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-black">
                      {selectedDate?.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-black">{selectedTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Email Notifications</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Confirmation Email:</span>
                  <span
                    className={`font-medium ${bookingResult.emailStatus?.clientConfirmation ? "text-green-600" : "text-red-600"}`}
                  >
                    {bookingResult.emailStatus?.clientConfirmation ? "✓ Sent" : "✗ Failed"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Calendar Invite:</span>
                  <span className="font-medium text-green-600">✓ Attached</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Reminder Scheduled:</span>
                  <span
                    className={`font-medium ${bookingResult.emailStatus?.reminderScheduled ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {bookingResult.emailStatus?.reminderScheduled ? "✓ 24hrs before" : "⚠ Within 24hrs"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={resetWidget}
              variant="outline"
              className="w-full border-gray-200 text-black hover:bg-gray-100"
            >
              Book Another Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
