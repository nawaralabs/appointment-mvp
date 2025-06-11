"use client"

import BookingWidget from "@/components/booking-widget"

export default function WidgetPage() {
  const handleBookingComplete = (booking: any) => {
    // Send booking data to parent window if embedded in iframe
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: "BOOKING_COMPLETE",
          data: booking,
        },
        "*",
      )
    }

    // Also handle locally
    console.log("Booking completed:", booking)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <BookingWidget businessName="Nawara Labs" onBookingComplete={handleBookingComplete} embedded={true} />
    </div>
  )
}
