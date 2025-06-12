"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, RefreshCw, Upload, Copy, Check, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  SettingsService,
  type BrandingSettings,
  type NotificationSettings,
  type WidgetSettings,
  type BusinessSettings,
} from "@/lib/settings-service"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("branding")
  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings | null>(null)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null)
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings | null>(null)
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [embedCode, setEmbedCode] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const settingsService = SettingsService.getInstance()
    setBrandingSettings(settingsService.getBrandingSettings())
    setNotificationSettings(settingsService.getNotificationSettings())
    setWidgetSettings(settingsService.getWidgetSettings())
    setBusinessSettings(settingsService.getBusinessSettings())
    setEmbedCode(settingsService.getWidgetSettings().embedCode)
  }, [])

  const handleSaveBranding = () => {
    if (!brandingSettings) return

    setIsSaving(true)
    const settingsService = SettingsService.getInstance()
    
    setTimeout(() => {
      settingsService.updateBrandingSettings(brandingSettings)
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 800)
  }

  const handleSaveNotifications = () => {
    if (!notificationSettings) return

    setIsSaving(true)
    const settingsService = SettingsService.getInstance()
    
    setTimeout(() => {
      settingsService.updateNotificationSettings(notificationSettings)
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 800)
  }

  const handleSaveWidget = () => {
    if (!widgetSettings) return

    setIsSaving(true)
    const settingsService = SettingsService.getInstance()
    
    setTimeout(() => {
      settingsService.updateWidgetSettings(widgetSettings)
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 800)
  }

  const handleSaveBusiness = () => {
    if (!businessSettings) return

    setIsSaving(true)
    const settingsService = SettingsService.getInstance()
    
    setTimeout(() => {
      settingsService.updateBusinessSettings(businessSettings)
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 800)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setLogoPreview(result)
        if (brandingSettings) {
          setBrandingSettings({
            ...brandingSettings,
            logo: result,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to defaults? This cannot be undone.")) {
      const settingsService = SettingsService.getInstance()
      settingsService.resetToDefaults()
      
      // Reload settings
      setBrandingSettings(settingsService.getBrandingSettings())
      setNotificationSettings(settingsService.getNotificationSettings())
      setWidgetSettings(settingsService.getWidgetSettings())
      setBusinessSettings(settingsService.getBusinessSettings())
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 3000)
  }

  const generateEmbedCode = () => {
    if (!businessSettings || !brandingSettings || !widgetSettings) return

    const settingsService = SettingsService.getInstance()
    const code = settingsService.generateEmbedCode({
      businessName: businessSettings.businessName,
      primaryColor: brandingSettings.primaryColor,
      showPricing: widgetSettings.showPricing,
    })
    
    setEmbedCode(code)
  }

  if (!brandingSettings || !notificationSettings || !widgetSettings || !businessSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/business-dashboard" className="flex items-center text-gray-600 hover:text-black">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <Image
              src={brandingSettings.logo || "/images/nawara-labs-logo.png"}
              alt={businessSettings.businessName}
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-semibold text-black">Customization Settings</h1>
          </div>
          <div className="flex items-center space-x-2">
            {saveSuccess && (
              <div className="flex items-center text-green-600 text-sm mr-2">
                <Check className="h-4 w-4 mr-1" />
                Saved successfully
              </div>
            )}
            <Button
              variant="outline"
              className="border-gray-200"
              onClick={handleResetToDefaults}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => {
                switch (activeTab) {
                  case "branding":
                    handleSaveBranding()
                    break
                  case "notifications":
                    handleSaveNotifications()
                    break
                  case "widget":
                    handleSaveWidget()
                    break
                  case "business":
                    handleSaveBusiness()
                    break
                }
              }}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Customization Settings</h1>
            <p className="text-gray-600">Personalize your booking system with your brand and preferences</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="widget">Booking Widget</TabsTrigger>
              <TabsTrigger value="business">Business Info</TabsTrigger>
            </TabsList>

            {/* Branding Settings */}
            <TabsContent value="branding">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Brand Identity</CardTitle>
                      <CardDescription>Customize your brand appearance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={brandingSettings.businessName}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, businessName: e.target.value })}
                          className="border-gray-200 focus:border-black"
                        />
                      </div>

                      <div>
                        <Label>Logo</Label>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                            {(logoPreview || brandingSettings.logo) ? (
                              <Image
                                src={logoPreview || brandingSettings.logo || ""}
                                alt="Logo"
                                width={64}
                                height={64}
                                className="object-contain"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">No logo</span>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="logo-upload"
                              className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Logo
                            </Label>
                            <Input
                              id="logo-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended size: 200x60px</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="fontFamily">Font Family</Label>
                        <Select
                          value={brandingSettings.fontFamily}
                          onValueChange={(value) => setBrandingSettings({ ...brandingSettings, fontFamily: value })}
                        >
                          <SelectTrigger className="border-gray-200 focus:border-black">
                            <SelectValue placeholder="Select a font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter, sans-serif">Inter (Modern)</SelectItem>
                            <SelectItem value="Georgia, serif">Georgia (Classic)</SelectItem>
                            <SelectItem value="'Roboto', sans-serif">Roboto (Clean)</SelectItem>
                            <SelectItem value="'Montserrat', sans-serif">Montserrat (Bold)</SelectItem>
                            <SelectItem value="'Poppins', sans-serif">Poppins (Friendly)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Color Scheme</CardTitle>
                      <CardDescription>Define your brand colors</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            id="primaryColor"
                            value={brandingSettings.primaryColor}
                            onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                            className="w-10 h-10 rounded-md border border-gray-200 p-1"
                          />
                          <Input
                            value={brandingSettings.primaryColor}
                            onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                            className="border-gray-200 focus:border-black"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Used for buttons, headings, and accents</p>
                      </div>

                      <div>
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            id="secondaryColor"
                            value={brandingSettings.secondaryColor}
                            onChange={(e) => setBrandingSettings({ ...brandingSettings, secondaryColor: e.target.value })}
                            className="w-10 h-10 rounded-md border border-gray-200 p-1"
                          />
                          <Input
                            value={brandingSettings.secondaryColor}
                            onChange={(e) => setBrandingSettings({ ...brandingSettings, secondaryColor: e.target.value })}
                            className="border-gray-200 focus:border-black"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Used for backgrounds and secondary elements</p>
                      </div>

                      <div>
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            id="accentColor"
                            value={brandingSettings.accentColor}
                            onChange={(e) => setBrandingSettings({ ...brandingSettings, accentColor: e.target.value })}
                            className="w-10 h-10 rounded-md border border-gray-200 p-1"
                          />
                          <Input
                            value={brandingSettings.accentColor}
                            onChange={(e) => setBrandingSettings({ ...brandingSettings, accentColor: e.target.value })}
                            className="border-gray-200 focus:border-black"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Used for highlights and special elements</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="darkMode"
                          checked={brandingSettings.darkMode}
                          onCheckedChange={(checked) => setBrandingSettings({ ...brandingSettings, darkMode: checked })}
                        />
                        <Label htmlFor="darkMode">Enable Dark Mode</Label>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Advanced Styling</CardTitle>
                      <CardDescription>Add custom CSS for advanced customization</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={brandingSettings.customCSS || ""}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, customCSS: e.target.value })}
                        placeholder=".my-custom-class { color: blue; }"
                        className="font-mono text-sm border-gray-200 focus:border-black"
                        rows={6}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Add custom CSS to further customize your booking system. Changes will apply globally.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Live Preview</CardTitle>
                      <CardDescription>See how your branding changes look</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="p-4"
                          style={{
                            backgroundColor: brandingSettings.primaryColor,
                            color: brandingSettings.secondaryColor,
                            fontFamily: brandingSettings.fontFamily,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {(logoPreview || brandingSettings.logo) && (
                                <Image
                                  src={logoPreview || brandingSettings.logo || ""}
                                  alt="Logo"
                                  width={80}
                                  height={30}
                                  className="h-6 w-auto object-contain"
                                />
                              )}
                              <span className="font-medium">{brandingSettings.businessName}</span>
                            </div>
                            <div className="flex space-x-2">
                              <div
                                className="px-3 py-1 text-xs rounded-md"
                                style={{
                                  backgroundColor: brandingSettings.secondaryColor,
                                  color: brandingSettings.primaryColor,
                                }}
                              >
                                Login
                              </div>
                              <div
                                className="px-3 py-1 text-xs rounded-md"
                                style={{
                                  backgroundColor: brandingSettings.accentColor,
                                  color: brandingSettings.primaryColor,
                                }}
                              >
                                Book Now
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="p-4"
                          style={{
                            backgroundColor: brandingSettings.secondaryColor,
                            color: "#333",
                            fontFamily: brandingSettings.fontFamily,
                          }}
                        >
                          <h3
                            className="text-lg font-medium mb-2"
                            style={{ color: brandingSettings.primaryColor }}
                          >
                            Book Your Appointment
                          </h3>
                          <p className="text-sm mb-4">Select your preferred service and time</p>

                          <div className="space-y-3">
                            <div
                              className="p-3 rounded-md"
                              style={{
                                backgroundColor: brandingSettings.accentColor,
                                borderLeft: `3px solid ${brandingSettings.primaryColor}`,
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">Consultation</h4>
                                  <p className="text-xs">30 minutes</p>
                                </div>
                                <div
                                  className="text-xs px-2 py-1 rounded-full"
                                  style={{
                                    backgroundColor: brandingSettings.primaryColor,
                                    color: brandingSettings.secondaryColor,
                                  }}
                                >
                                  $100
                                </div>
                              </div>
                            </div>

                            <div className="p-3 rounded-md border border-gray-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">Follow-up</h4>
                                  <p className="text-xs">15 minutes</p>
                                </div>
                                <div
                                  className="text-xs px-2 py-1 rounded-full"
                                  style={{
                                    backgroundColor: brandingSettings.primaryColor,
                                    color: brandingSettings.secondaryColor,
                                  }}
                                >
                                  $50
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <button
                              className="w-full py-2 rounded-md text-sm font-medium"
                              style={{
                                backgroundColor: brandingSettings.primaryColor,
                                color: brandingSettings.secondaryColor,
                              }}
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Color Palette</CardTitle>
                      <CardDescription>Your selected color scheme</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div
                            className="h-20 rounded-md"
                            style={{ backgroundColor: brandingSettings.primaryColor }}
                          ></div>
                          <p className="text-xs font-medium">Primary</p>
                          <p className="text-xs text-gray-500">{brandingSettings.primaryColor}</p>
                        </div>
                        <div className="space-y-2">
                          <div
                            className="h-20 rounded-md border border-gray-200"
                            style={{ backgroundColor: brandingSettings.secondaryColor }}
                          ></div>
                          <p className="text-xs font-medium">Secondary</p>
                          <p className="text-xs text-gray-500">{brandingSettings.secondaryColor}</p>
                        </div>
                        <div className="space-y-2">
                          <div
                            className="h-20 rounded-md"
                            style={{ backgroundColor: brandingSettings.accentColor }}
                          ></div>
                          <p className="text-xs font-medium">Accent</p>
                          <p className="text-xs text-gray-500">{brandingSettings.accentColor}</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Text Sample</h4>
                        <div
                          className="p-4 rounded-md"
                          style={{
                            backgroundColor: brandingSettings.secondaryColor,
                            fontFamily: brandingSettings.fontFamily,
                          }}
                        >
                          <h3
                            className="text-lg font-medium mb-1"
                            style={{ color: brandingSettings.primaryColor }}
                          >
                            Heading Example
                          </h3>
                          <p className="text-sm">
                            This is how your text will appear with the selected font family and colors. The quick brown
                            fox jumps over the lazy dog.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Email Notifications</CardTitle>
                      <CardDescription>Configure email notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailEnabled" className="text-base font-medium">
                            Enable Email Notifications
                          </Label>
                          <p className="text-sm text-gray-500">Send automated emails to clients</p>
                        </div>
                        <Switch
                          id="emailEnabled"
                          checked={notificationSettings.emailNotifications.enabled}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailNotifications: {
                                ...notificationSettings.emailNotifications,
                                enabled: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailConfirmations" className="cursor-pointer">
                            Booking Confirmations
                          </Label>
                          <Switch
                            id="emailConfirmations"
                            checked={notificationSettings.emailNotifications.confirmations}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: {
                                  ...notificationSettings.emailNotifications,
                                  confirmations: checked,
                                },
                              })
                            }
                            disabled={!notificationSettings.emailNotifications.enabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailReminders" className="cursor-pointer">
                            Appointment Reminders
                          </Label>
                          <Switch
                            id="emailReminders"
                            checked={notificationSettings.emailNotifications.reminders}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: {
                                  ...notificationSettings.emailNotifications,
                                  reminders: checked,
                                },
                              })
                            }
                            disabled={!notificationSettings.emailNotifications.enabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailFollowUps" className="cursor-pointer">
                            Follow-up Messages
                          </Label>
                          <Switch
                            id="emailFollowUps"
                            checked={notificationSettings.emailNotifications.followUps}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: {
                                  ...notificationSettings.emailNotifications,
                                  followUps: checked,
                                },
                              })
                            }
                            disabled={!notificationSettings.emailNotifications.enabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailMarketing" className="cursor-pointer">
                            Marketing Emails
                          </Label>
                          <Switch
                            id="emailMarketing"
                            checked={notificationSettings.emailNotifications.marketing}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: {
                                  ...notificationSettings.emailNotifications,
                                  marketing: checked,
                                },
                              })
                            }
                            disabled={!notificationSettings.emailNotifications.enabled}
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Label htmlFor="reminderTiming">Reminder Timing (hours before appointment)</Label>
                        <div className="flex items-center space-x-4 mt-2">
                          <Slider
                            id="reminderTiming"
                            min={1}
                            max={72}
                            step={1}
                            value={[notificationSettings.emailNotifications.reminderTiming]}
                            onValueChange={(value) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: {
                                  ...notificationSettings.emailNotifications,
                                  reminderTiming: value[0],
                                },
                              })
                            }
                            disabled={!notificationSettings.emailNotifications.enabled || !notificationSettings.emailNotifications.reminders}
                            className="flex-1"
                          />
                          <span className="w-12 text-center">
                            {notificationSettings.emailNotifications.reminderTiming}h
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">SMS Notifications</CardTitle>
                      <CardDescription>Configure SMS notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="smsEnabled" className="text-base font-medium">
                            Enable SMS Notifications
                          </Label>
                          <p className="text-sm text-gray-500">Send text messages to clients</p>
                        </div>
                        <Switch
                          id="smsEnabled"
                          checked={notificationSettings.smsNotifications.enabled}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              smsNotifications: {
                                ...notificationSettings.smsNotifications,
                                enabled: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="smsConfirmations" className="cursor-pointer">
                            Booking Confirmations
                          </Label>
                          <Switch
                            id="smsConfirmations"
                            checked={notificationSettings.smsNotifications.confirmations}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                smsNotifications: {
                                  ...notificationSettings.smsNotifications,
                                  confirmations: checked,
                                },
                              })
                            }
                            disabled={!notificationSettings.smsNotifications.enabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="smsReminders" className="cursor-pointer">
                            Appointment Reminders
                          </Label>
                          <Switch
                            id="smsReminders"
                            checked={notificationSettings.smsNotifications.reminders}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                smsNotifications: {
                                  ...notificationSettings.smsNotifications,
                                  reminders: checked,
                                },
                              })
                            }
                            disabled={!notificationSettings.smsNotifications.enabled}
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Label htmlFor="smsReminderTiming">SMS Reminder Timing (hours before appointment)</Label>
                        <div className="flex items-center space-x-4 mt-2">
                          <Slider
                            id="smsReminderTiming"
                            min={1}
                            max={24}
                            step={1}
                            value={[notificationSettings.smsNotifications.reminderTiming]}
                            onValueChange={(value) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                smsNotifications: {
                                  ...notificationSettings.smsNotifications,
                                  reminderTiming: value[0],
                                },
                              })
                            }
                            disabled={!notificationSettings.smsNotifications.enabled || !notificationSettings.smsNotifications.reminders}
                            className="flex-1"
                          />
                          <span className="w-12 text-center">
                            {notificationSettings.smsNotifications.reminderTiming}h
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-700">
                          <p className="font-medium">SMS Integration Required</p>
                          <p className="mt-1">
                            To enable SMS notifications, you need to configure a Twilio account in your integration
                            settings.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Staff Notifications</CardTitle>
                      <CardDescription>Configure notifications for your staff</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="newBookingEmail" className="cursor-pointer">
                            New Booking Notifications
                          </Label>
                          <p className="text-sm text-gray-500">Email staff when new bookings are made</p>
                        </div>
                        <Switch
                          id="newBookingEmail"
                          checked={notificationSettings.staffNotifications.newBookingEmail}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              staffNotifications: {
                                ...notificationSettings.staffNotifications,
                                newBookingEmail: checked,
                              },
                            })
                          }
                        />
                      </div>

                      {notificationSettings.staffNotifications.newBookingEmail && (
                        <div>
                          <Label htmlFor="newBookingRecipients">Notification Recipients</Label>
                          <Textarea
                            id="newBookingRecipients"
                            value={notificationSettings.staffNotifications.newBookingEmailRecipients.join(", ")}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                staffNotifications: {
                                  ...notificationSettings.staffNotifications,
                                  newBookingEmailRecipients: e.target.value.split(",").map((email) => email.trim()),
                                },
                              })
                            }
                            placeholder="email@example.com, another@example.com"
                            className="border-gray-200 focus:border-black"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter email addresses separated by commas
                          </p>
                        </div>
                      )}

                      <Separator className="my-4" />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="dailySummaryEmail" className="cursor-pointer">
                            Daily Summary Email
                          </Label>
                          <p className="text-sm text-gray-500">Send a daily summary of appointments</p>
                        </div>
                        <Switch
                          id="dailySummaryEmail"
                          checked={notificationSettings.staffNotifications.dailySummaryEmail}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              staffNotifications: {
                                ...notificationSettings.staffNotifications,
                                dailySummaryEmail: checked,
                              },
                            })
                          }
                        />
                      </div>

                      {notificationSettings.staffNotifications.dailySummaryEmail && (
                        <div>
                          <Label htmlFor="dailySummaryRecipients">Summary Recipients</Label>
                          <Textarea
                            id="dailySummaryRecipients"
                            value={notificationSettings.staffNotifications.dailySummaryEmailRecipients.join(", ")}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                staffNotifications: {
                                  ...notificationSettings.staffNotifications,
                                  dailySummaryEmailRecipients: e.target.value.split(",").map((email) => email.trim()),
                                },
                              })
                            }
                            placeholder="email@example.com, another@example.com"
                            className="border-gray-200 focus:border-black"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter email addresses separated by commas
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Notification Preview</CardTitle>
                      <CardDescription>Sample of your notification messages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-black">Email Confirmation</h4>
                            <Badge variant="outline" className="text-xs">
                              Sample
                            </Badge>
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <p className="font-medium mb-1">Subject: Appointment Confirmed - Consultation</p>
                            <p>Dear John,</p>
                            <p className="mt-2">
                              Thank you for booking an appointment with {businessSettings.businessName}. Your appointment
                              has been confirmed.
                            </p>
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
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-black">SMS Reminder</h4>
                            <Badge variant="outline" className="text-xs">
                              Sample
                            </Badge>
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <p>
                              Hi John, reminder: your Consultation appointment with {businessSettings.businessName} is
                              tomorrow at 10:00 AM. Reply CONFIRM to confirm or CANCEL to cancel.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Widget Settings */}
            <TabsContent value="widget">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Booking Widget Settings</CardTitle>
                      <CardDescription>Configure how your booking widget appears and functions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showLogo" className="cursor-pointer">
                          Show Logo
                        </Label>
                        <Switch
                          id="showLogo"
                          checked={widgetSettings.showLogo}
                          onCheckedChange={(checked) =>
                            setWidgetSettings({
                              ...widgetSettings,
                              showLogo: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="showPricing" className="cursor-pointer">
                          Show Service Pricing
                        </Label>
                        <Switch
                          id="showPricing"
                          checked={widgetSettings.showPricing}
                          onCheckedChange={(checked) =>
                            setWidgetSettings({
                              ...widgetSettings,
                              showPricing: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="allowCancellations" className="cursor-pointer">
                          Allow Cancellations
                        </Label>
                        <Switch
                          id="allowCancellations"
                          checked={widgetSettings.allowCancellations}
                          onCheckedChange={(checked) =>
                            setWidgetSettings({
                              ...widgetSettings,
                              allowCancellations: checked,
                            })
                          }
                        />
                      </div>

                      <Separator className="my-2" />

                      <div className="flex items-center justify-between">
                        <Label htmlFor="requirePhone" className="cursor-pointer">
                          Require Phone Number
                        </Label>
                        <Switch
                          id="requirePhone"
                          checked={widgetSettings.requirePhone}
                          onCheckedChange={(checked) =>
                            setWidgetSettings({
                              ...widgetSettings,
                              requirePhone: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="requireEmail" className="cursor-pointer">
                          Require Email Address
                        </Label>
                        <Switch
                          id="requireEmail"
                          checked={widgetSettings.requireEmail}
                          onCheckedChange={(checked) =>
                            setWidgetSettings({
                              ...widgetSettings,
                              requireEmail: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectNotes" className="cursor-pointer">
                          Collect Additional Notes
                        </Label>
                        <Switch
                          id="collectNotes"
                          checked={widgetSettings.collectNotes}
                          onCheckedChange={(checked) =>
                            setWidgetSettings({
                              ...widgetSettings,
                              collectNotes: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="showSocialProof" className="cursor-pointer">
                          Show Social Proof
                        </Label>
                        <Switch
                          id="showSocialProof"
                          checked={widgetSettings.showSocialProof}
                          onCheckedChange={(checked) =>
                            setWidgetSettings({
                              ...widgetSettings,
                              showSocialProof: checked,
                            })
                          }
                        />
                      </div>

                      <Separator className="my-2" />

                      <div className="flex items-center justify-between">
                        <Label htmlFor="customColors" className="cursor-pointer">
                          Use Custom Colors
                        </Label>
                        <Switch
                          id="customColors"
                          checked={widgetSettings.customColors}
                          onCheckedChange={(checked) =>
                            setWidgetSettings({
                              ...widgetSettings,
                              customColors: checked,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="customHeader">Custom Header HTML (Optional)</Label>
                        <Textarea
                          id="customHeader"
                          value={widgetSettings.customHeader || ""}
                          onChange={(e) =>
                            setWidgetSettings({
                              ...widgetSettings,
                              customHeader: e.target.value,
                            })
                          }
                          placeholder="<div class='custom-header'>Your custom header</div>"
                          className="border-gray-200 focus:border-black font-mono text-sm"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="customFooter">Custom Footer HTML (Optional)</Label>
                        <Textarea
                          id="customFooter"
                          value={widgetSettings.customFooter || ""}
                          onChange={(e) =>
                            setWidgetSettings({
                              ...widgetSettings,
                              customFooter: e.target.value,
                            })
                          }
                          placeholder="<div class='custom-footer'>Your custom footer</div>"
                          className="border-gray-200 focus:border-black font-mono text-sm"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Embed Code</CardTitle>
                      <CardDescription>Add the booking widget to your website</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          className="border-gray-200"
                          onClick={generateEmbedCode}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate Embed Code
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-200"
                          onClick={handleCopyEmbedCode}
                        >
                          {copySuccess ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Code
                            </>
                          )}
                        </Button>
                      </div>

                      <Textarea
                        value={embedCode}
                        onChange={(e) => setEmbedCode(e.target.value)}
                        className="border-gray-200 focus:border-black font-mono text-sm"
                        rows={8}
                      />

                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                        <h4 className="text-sm font-medium mb-2">Installation Instructions:</h4>
                        <ol className="text-sm text-gray-600 space-y-2 pl-5 list-decimal">
                          <li>Copy the embed code above</li>
                          <li>Paste it into the HTML of your website where you want the booking widget to appear</li>
                          <li>The widget will automatically load and display your booking form</li>
                          <li>
                            For advanced customization, you can modify the parameters in the <code>NawaraBooking.init()</code> function
                          </li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Widget Preview</CardTitle>
                      <CardDescription>See how your booking widget will appear</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="p-4 flex items-center justify-between"
                          style={{
                            backgroundColor: widgetSettings.customColors ? brandingSettings.primaryColor : "#000000",
                            color: "#ffffff",
                          }}
                        >
                          {widgetSettings.showLogo && (logoPreview || brandingSettings.logo) && (
                            <Image
                              src={logoPreview || brandingSettings.logo || ""}
                              alt="Logo"
                              width={80}
                              height={30}
                              className="h-6 w-auto object-contain"
                            />
                          )}
                          <span className="font-medium">{businessSettings.businessName}</span>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-medium mb-2">Book Your Appointment</h3>
                          <p className="text-sm mb-4">Select your preferred service and time</p>

                          <div className="space-y-3">
                            <div className="p-3 rounded-md border-l-4 border-black bg-gray-50">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">Consultation</h4>
                                  <p className="text-xs">30 minutes</p>
                                </div>
                                {widgetSettings.showPricing && (
                                  <div className="text-xs px-2 py-1 rounded-full bg-black text-white">$100</div>
                                )}
                              </div>
                            </div>

                            <div className="p-3 rounded-md border border-gray-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">Follow-up</h4>
                                  <p className="text-xs">15 minutes</p>
                                </div>
                                {widgetSettings.showPricing && (
                                  <div className="text-xs px-2 py-1 rounded-full bg-black text-white">$50</div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <button
                              className="w-full py-2 rounded-md text-sm font-medium bg-black text-white"
                              style={{
                                backgroundColor: widgetSettings.customColors ? brandingSettings.primaryColor : "#000000",
                              }}
                            >
                              Continue
                            </button>
                          </div>

                          {widgetSettings.showSocialProof && (
                            <div className="mt-4 text-center text-xs text-gray-500">
                              <p>15 people booked this service in the last 7 days</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Widget Placement Options</CardTitle>
                      <CardDescription>Different ways to add the booking widget to your site</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Inline Embedding</h4>
                        <p className="text-sm text-gray-500">
                          Inline Embedding lets you drop the widget directly into your page’s HTML.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

          </Tabs>      {/* ← close the Tabs */}
        </div>        {/* ← close max-w-6xl wrapper */}
      </div>          {/* ← close container */}
    </div>            {/* ← close min-h-screen wrapper */}
  );                  {/* ← close return */}
} 