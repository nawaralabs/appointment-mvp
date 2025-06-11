"use client"

import { useState } from "react"
import BookingWidget from "@/components/booking-widget"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Copy, ExternalLink, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WidgetDemoPage() {
  const [showCode, setShowCode] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)

  const embedCode = `<!-- Nawara Labs Booking Widget -->
<div id="nawara-booking-widget"></div>
<script src="https://your-domain.com/widget.js"></script>
<script>
  NawaraBooking.init({
    containerId: 'nawara-booking-widget',
    businessName: 'Your Business Name',
    services: [
      { id: 'consultation', name: 'Consultation', duration: 30, price: 100 },
      { id: 'followup', name: 'Follow-up', duration: 15, price: 50 }
    ],
    onBookingComplete: function(booking) {
      console.log('Booking completed:', booking);
    }
  });
</script>`

  const handleBookingComplete = (booking: any) => {
    setBookingData(booking)
    console.log("Booking completed:", booking)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
    alert("Embed code copied to clipboard!")
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
            <h1 className="text-xl font-semibold text-black">Booking Widget Demo</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowCode(!showCode)} variant="outline" className="border-gray-200">
              <Code className="h-4 w-4 mr-2" />
              {showCode ? "Hide Code" : "Show Embed Code"}
            </Button>
            <Link href="/">
              <Button className="bg-black text-white hover:bg-gray-800">
                <ExternalLink className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Demo Notice Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-2 text-blue-800">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Demo Mode: Email notifications are simulated. Configure Resend API key for live emails.
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Online Booking Widget</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Embeddable calendar widget showing real-time availability. Clients can select services, times, and provide
              contact details seamlessly.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Widget Demo */}
            <div>
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">Live Widget Demo</CardTitle>
                  <CardDescription>Try the booking widget below - it's fully functional!</CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingWidget businessName="Nawara Labs" onBookingComplete={handleBookingComplete} embedded={true} />
                </CardContent>
              </Card>

              {/* Booking Result */}
              {bookingData && (
                <Card className="border-gray-200 mt-6">
                  <CardHeader>
                    <CardTitle className="text-green-600">Booking Completed!</CardTitle>
                    <CardDescription>Here's the booking data that would be sent to your system:</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {JSON.stringify(bookingData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Features & Integration */}
            <div className="space-y-6">
              {/* Features */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">Widget Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-black">Real-time Availability</h4>
                      <p className="text-sm text-gray-600">Shows actual available time slots</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-black">Service Selection</h4>
                      <p className="text-sm text-gray-600">Multiple services with pricing and duration</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-black">Contact Collection</h4>
                      <p className="text-sm text-gray-600">Captures client details and preferences</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-black">Mobile Responsive</h4>
                      <p className="text-sm text-gray-600">Works perfectly on all devices</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-black">Easy Integration</h4>
                      <p className="text-sm text-gray-600">Simple embed code for any website</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Embed Code */}
              {showCode && (
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-black flex items-center justify-between">
                      Embed Code
                      <Button onClick={copyToClipboard} size="sm" variant="outline" className="border-gray-200">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </CardTitle>
                    <CardDescription>Add this code to your website to embed the booking widget</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{embedCode}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* Customization Options */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">Customization Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium text-black mb-1">Business Branding</h4>
                    <p className="text-gray-600">Custom logo, colors, and business name</p>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium text-black mb-1">Service Configuration</h4>
                    <p className="text-gray-600">Define services, durations, and pricing</p>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium text-black mb-1">Time Slots</h4>
                    <p className="text-gray-600">Configure available booking times</p>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium text-black mb-1">Callback Functions</h4>
                    <p className="text-gray-600">Handle booking completion events</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
