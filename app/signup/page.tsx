"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Building, User, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // Business Information
    businessName: "",
    businessType: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    businessWebsite: "",

    // Preferences
    agreeToTerms: false,
    subscribeToUpdates: true,
  })

  const businessTypes = [
    "Healthcare & Medical",
    "Beauty & Wellness",
    "Professional Services",
    "Fitness & Sports",
    "Education & Training",
    "Consulting",
    "Legal Services",
    "Real Estate",
    "Other",
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Signup data:", formData)
      setIsLoading(false)
      alert("Account created successfully! Please check your email for verification.")
      // In a real app, redirect to dashboard or verification page
    }, 2000)
  }

  const isStep1Valid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword

  const isStep2Valid = formData.businessName && formData.businessType && formData.businessEmail

  const isStep3Valid = formData.agreeToTerms

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <Image
            src="/images/nawara-labs-logo.png"
            alt="Nawara Labs"
            width={120}
            height={40}
            className="h-8 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-black mb-2">Create Your Account</h1>
          <p className="text-gray-600">Start managing your appointments professionally</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-black" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-sm text-gray-600">
              Step {currentStep} of 3:{" "}
              {currentStep === 1 ? "Personal Information" : currentStep === 2 ? "Business Details" : "Review & Confirm"}
            </div>
          </div>
        </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              {currentStep === 1 && (
                <>
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </>
              )}
              {currentStep === 2 && (
                <>
                  <Building className="h-5 w-5 mr-2" />
                  Business Details
                </>
              )}
              {currentStep === 3 && (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Review & Confirm
                </>
              )}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "Set up your business profile"}
              {currentStep === 3 && "Review your information and create account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-black">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="border-gray-200 focus:border-black"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-black">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="border-gray-200 focus:border-black"
                        placeholder="Enter your last name"
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
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-gray-200 focus:border-black"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-black">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-gray-200 focus:border-black"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password" className="text-black">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="border-gray-200 focus:border-black"
                        placeholder="Create a password"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-black">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="border-gray-200 focus:border-black"
                        placeholder="Confirm your password"
                        required
                      />
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessName" className="text-black">
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      className="border-gray-200 focus:border-black"
                      placeholder="Enter your business name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessType" className="text-black">
                      Business Type *
                    </Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => handleInputChange("businessType", value)}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-black">
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessEmail" className="text-black">
                        Business Email *
                      </Label>
                      <Input
                        id="businessEmail"
                        type="email"
                        value={formData.businessEmail}
                        onChange={(e) => handleInputChange("businessEmail", e.target.value)}
                        className="border-gray-200 focus:border-black"
                        placeholder="business@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessPhone" className="text-black">
                        Business Phone
                      </Label>
                      <Input
                        id="businessPhone"
                        type="tel"
                        value={formData.businessPhone}
                        onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                        className="border-gray-200 focus:border-black"
                        placeholder="Business phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessAddress" className="text-black">
                      Business Address
                    </Label>
                    <Input
                      id="businessAddress"
                      value={formData.businessAddress}
                      onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                      className="border-gray-200 focus:border-black"
                      placeholder="Enter your business address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessWebsite" className="text-black">
                      Website (Optional)
                    </Label>
                    <Input
                      id="businessWebsite"
                      type="url"
                      value={formData.businessWebsite}
                      onChange={(e) => handleInputChange("businessWebsite", e.target.value)}
                      className="border-gray-200 focus:border-black"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review & Confirm */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-black mb-4">Review Your Information</h3>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-black mb-2 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Personal Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Name:</span>
                            <span className="ml-2 text-black">
                              {formData.firstName} {formData.lastName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Email:</span>
                            <span className="ml-2 text-black">{formData.email}</span>
                          </div>
                          {formData.phone && (
                            <div>
                              <span className="text-gray-600">Phone:</span>
                              <span className="ml-2 text-black">{formData.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-black mb-2 flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          Business Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Business Name:</span>
                            <span className="ml-2 text-black">{formData.businessName}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Type:</span>
                            <span className="ml-2 text-black">{formData.businessType}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Business Email:</span>
                            <span className="ml-2 text-black">{formData.businessEmail}</span>
                          </div>
                          {formData.businessPhone && (
                            <div>
                              <span className="text-gray-600">Business Phone:</span>
                              <span className="ml-2 text-black">{formData.businessPhone}</span>
                            </div>
                          )}
                          {formData.businessAddress && (
                            <div className="col-span-2">
                              <span className="text-gray-600">Address:</span>
                              <span className="ml-2 text-black">{formData.businessAddress}</span>
                            </div>
                          )}
                          {formData.businessWebsite && (
                            <div className="col-span-2">
                              <span className="text-gray-600">Website:</span>
                              <span className="ml-2 text-black">{formData.businessWebsite}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm text-black cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="subscribeToUpdates"
                        checked={formData.subscribeToUpdates}
                        onCheckedChange={(checked) => handleInputChange("subscribeToUpdates", checked as boolean)}
                      />
                      <Label htmlFor="subscribeToUpdates" className="text-sm text-black cursor-pointer">
                        Subscribe to product updates and tips
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                <div>
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={handlePrevStep} className="border-gray-200">
                      Previous
                    </Button>
                  )}
                </div>

                <div>
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!isStep3Valid || isLoading}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-black hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
