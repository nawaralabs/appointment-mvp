import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/nawara-labs-logo.png"
              alt="Nawara Labs"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-black transition-colors">
              Features
            </Link>
            <Link href="/widget-demo" className="text-gray-600 hover:text-black transition-colors">
              Widget Demo
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-black transition-colors">
              Pricing
            </Link>
            <Link href="/book" className="text-gray-600 hover:text-black transition-colors">
              Book Now
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                Login
              </Button>
            </Link>
            <Link href="/book">
              <Button className="bg-black text-white hover:bg-gray-800">Book Appointment</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Streamline Your
            <br />
            <span className="text-gray-600">Appointment Booking</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional appointment management system designed for modern businesses. Simple, efficient, and powerful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-3">
                Book Your Appointment
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white px-8 py-3"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Powerful features to manage your appointments efficiently</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-black" />
                <CardTitle className="text-black">Easy Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center">
                  Intuitive calendar interface for quick appointment booking and management
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-black" />
                <CardTitle className="text-black">Time Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center">
                  Automated reminders and time slot optimization for maximum efficiency
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-black" />
                <CardTitle className="text-black">Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center">
                  Comprehensive client profiles and appointment history tracking
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-black" />
                <CardTitle className="text-black">Booking Widget</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center mb-4">
                  Embeddable widget for your website with real-time availability
                </CardDescription>
                <Link href="/widget-demo">
                  <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                    View Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using our platform to manage their appointments
          </p>
          <Link href="/book">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-black hover:bg-white hover:text-black px-8 py-3"
            >
              Book Your First Appointment
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src="/images/nawara-labs-logo.png"
                alt="Nawara Labs"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <div className="flex space-x-6 text-gray-600">
              <Link href="/privacy" className="hover:text-black transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-black transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-black transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2024 Nawara Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
