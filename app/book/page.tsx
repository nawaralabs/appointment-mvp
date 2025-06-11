"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    notes: "",
  })

  const timeSlots = [
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
  ]

  const services = ["Consultation", "Follow-up", "Assessment", "Treatment", "Review"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Booking submitted:", { selectedDate, selectedTime, formData })
    alert("Appointment booked successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-black">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
            <Image
              src="/images/nawara-labs-logo.png"
              alt="Nawara Labs"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Book Your Appointment</h1>
            <p className="text-gray-600">Select your preferred date, time, and provide your details</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Select Date & Time
                </CardTitle>
                <CardDescription>Choose your preferred appointment slot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-black mb-2 block">Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-md border border-gray-200"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-black mb-2 block">Available Times</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={
                          selectedTime === time
                            ? "bg-black text-white"
                            : "border-gray-200 text-gray-700 hover:bg-gray-100"
                        }
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Section */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Clock className="h-5 w-5 mr-2" />
                  Your Information
                </CardTitle>
                <CardDescription>Please provide your contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-black">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border-gray-200 focus:border-black"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-black">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="border-gray-200 focus:border-black"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-black">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-gray-200 focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="service" className="text-black">
                      Service Type *
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-black">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-black">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="border-gray-200 focus:border-black"
                      placeholder="Any specific requirements or notes..."
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800"
                    disabled={
                      !selectedDate ||
                      !selectedTime ||
                      !formData.name ||
                      !formData.email ||
                      !formData.phone ||
                      !formData.service
                    }
                  >
                    Confirm Appointment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          {selectedDate && selectedTime && (
            <Card className="mt-8 border-gray-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="text-black">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-black font-medium">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600">at {selectedTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-black font-medium">{formData.service || "Service"}</p>
                    <p className="text-gray-600">Duration: 30 minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
