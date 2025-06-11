"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Copy, Eye, Mail, MessageSquare, ArrowLeft, Save, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DashboardDataService, type MessageTemplate } from "@/lib/dashboard-data"

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    type: "email" as "email" | "sms",
    subject: "",
    content: "",
    category: "custom" as "reminder" | "confirmation" | "followup" | "marketing" | "custom",
  })

  useEffect(() => {
    setTemplates(DashboardDataService.getMessageTemplates())
  }, [])

  const handleCreateTemplate = () => {
    setEditForm({
      name: "",
      type: "email",
      subject: "",
      content: "",
      category: "custom",
    })
    setIsCreating(true)
    setIsEditing(true)
  }

  const handleEditTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template)
    setEditForm({
      name: template.name,
      type: template.type,
      subject: template.subject || "",
      content: template.content,
      category: template.category,
    })
    setIsCreating(false)
    setIsEditing(true)
  }

  const handleSaveTemplate = () => {
    if (isCreating) {
      const newTemplate: MessageTemplate = {
        id: `template_${Date.now()}`,
        name: editForm.name,
        type: editForm.type,
        subject: editForm.subject || undefined,
        content: editForm.content,
        category: editForm.category,
        variables: extractVariables(editForm.content + (editForm.subject || "")),
        createdAt: new Date(),
        usageCount: 0,
      }
      setTemplates([...templates, newTemplate])
    } else if (selectedTemplate) {
      const updatedTemplates = templates.map((t) =>
        t.id === selectedTemplate.id
          ? {
              ...t,
              name: editForm.name,
              type: editForm.type,
              subject: editForm.subject || undefined,
              content: editForm.content,
              category: editForm.category,
              variables: extractVariables(editForm.content + (editForm.subject || "")),
            }
          : t,
      )
      setTemplates(updatedTemplates)
    }
    setIsEditing(false)
    setSelectedTemplate(null)
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId))
  }

  const handleDuplicateTemplate = (template: MessageTemplate) => {
    const duplicatedTemplate: MessageTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      usageCount: 0,
      lastUsed: undefined,
    }
    setTemplates([...templates, duplicatedTemplate])
  }

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{([^}]+)\}\}/g)
    return matches ? matches.map((match) => match.slice(2, -2)) : []
  }

  const getTemplatePreview = (template: MessageTemplate) => {
    let preview = template.content
    template.variables.forEach((variable) => {
      const sampleValue = getSampleValue(variable)
      preview = preview.replace(new RegExp(`\\{\\{${variable}\\}\\}`, "g"), sampleValue)
    })
    return preview
  }

  const getSampleValue = (variable: string): string => {
    const sampleValues: Record<string, string> = {
      clientName: "John Smith",
      businessName: "Nawara Labs",
      serviceName: "Consultation",
      appointmentDate: "Monday, January 20, 2024",
      appointmentTime: "10:00 AM",
      serviceDuration: "30",
      servicePrice: "100",
    }
    return sampleValues[variable] || `[${variable}]`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "reminder":
        return "bg-blue-100 text-blue-800"
      case "confirmation":
        return "bg-green-100 text-green-800"
      case "followup":
        return "bg-purple-100 text-purple-800"
      case "marketing":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const availableVariables = [
    "clientName",
    "clientEmail",
    "clientPhone",
    "businessName",
    "businessEmail",
    "businessPhone",
    "serviceName",
    "servicePrice",
    "serviceDuration",
    "appointmentDate",
    "appointmentTime",
    "appointmentId",
  ]

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
              src="/images/nawara-labs-logo.png"
              alt="Nawara Labs"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-semibold text-black">Message Templates</h1>
          </div>
          <Button onClick={handleCreateTemplate} className="bg-black text-white hover:bg-gray-800">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Message Templates</h1>
            <p className="text-gray-600">Create and manage custom email and SMS templates for your communications</p>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="reminder">Reminders</TabsTrigger>
              <TabsTrigger value="confirmation">Confirmations</TabsTrigger>
              <TabsTrigger value="followup">Follow-ups</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            {["all", "reminder", "confirmation", "followup", "marketing", "custom"].map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates
                    .filter((template) => category === "all" || template.category === category)
                    .map((template) => (
                      <Card key={template.id} className="border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {template.type === "email" ? (
                                <Mail className="h-4 w-4 text-gray-600" />
                              ) : (
                                <MessageSquare className="h-4 w-4 text-gray-600" />
                              )}
                              <h3 className="font-medium text-black">{template.name}</h3>
                            </div>
                            <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                          </div>
                          {template.subject && (
                            <p className="text-sm text-gray-600 mt-1">Subject: {template.subject}</p>
                          )}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 max-h-20 overflow-hidden">
                              {template.content.substring(0, 120)}...
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {template.variables.slice(0, 3).map((variable) => (
                                <Badge key={variable} variant="outline" className="text-xs">
                                  {`{{${variable}}}`}
                                </Badge>
                              ))}
                              {template.variables.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{template.variables.length - 3} more
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Used {template.usageCount} times</span>
                              {template.lastUsed && <span>{template.lastUsed.toLocaleDateString()}</span>}
                            </div>

                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="border-gray-200">
                                    <Eye className="h-3 w-3 mr-1" />
                                    Preview
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>{template.name} - Preview</DialogTitle>
                                    <DialogDescription>Preview with sample data</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {template.subject && (
                                      <div>
                                        <Label className="text-sm font-medium">Subject:</Label>
                                        <div className="p-3 bg-gray-50 rounded mt-1">
                                          {template.subject.replace(/\{\{([^}]+)\}\}/g, (match, variable) =>
                                            getSampleValue(variable),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    <div>
                                      <Label className="text-sm font-medium">Content:</Label>
                                      <div className="p-3 bg-gray-50 rounded mt-1 whitespace-pre-wrap">
                                        {getTemplatePreview(template)}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-200"
                                onClick={() => handleEditTemplate(template)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-200"
                                onClick={() => handleDuplicateTemplate(template)}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteTemplate(template.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Edit/Create Template Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Create New Template" : "Edit Template"}</DialogTitle>
            <DialogDescription>
              {isCreating
                ? "Create a new message template for your communications"
                : "Edit the selected message template"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-type">Type</Label>
                  <Select
                    value={editForm.type}
                    onValueChange={(value: "email" | "sms") => setEditForm({ ...editForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="template-category">Category</Label>
                  <Select
                    value={editForm.category}
                    onValueChange={(value: any) => setEditForm({ ...editForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="confirmation">Confirmation</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {editForm.type === "email" && (
                <div>
                  <Label htmlFor="template-subject">Subject Line</Label>
                  <Input
                    id="template-subject"
                    value={editForm.subject}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                    placeholder="Enter email subject"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="template-content">Message Content</Label>
                <Textarea
                  id="template-content"
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  placeholder="Enter your message content..."
                  rows={editForm.type === "sms" ? 4 : 8}
                />
                {editForm.type === "sms" && (
                  <p className="text-xs text-gray-500 mt-1">Character count: {editForm.content.length}/160</p>
                )}
              </div>

              <div>
                <Label>Available Variables</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {availableVariables.map((variable) => (
                    <Button
                      key={variable}
                      size="sm"
                      variant="outline"
                      className="text-xs border-gray-200"
                      onClick={() => {
                        const cursorPos = document.getElementById("template-content")?.selectionStart || 0
                        const newContent =
                          editForm.content.slice(0, cursorPos) + `{{${variable}}}` + editForm.content.slice(cursorPos)
                        setEditForm({ ...editForm, content: newContent })
                      }}
                    >
                      {`{{${variable}}}`}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Live Preview</Label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[300px]">
                  {editForm.type === "email" && editForm.subject && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-600 mb-1">Subject:</div>
                      <div className="p-2 bg-white rounded border">
                        {editForm.subject.replace(/\{\{([^}]+)\}\}/g, (match, variable) => getSampleValue(variable))}
                      </div>
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-600 mb-1">Content:</div>
                  <div className="p-3 bg-white rounded border whitespace-pre-wrap">
                    {editForm.content.replace(/\{\{([^}]+)\}\}/g, (match, variable) => getSampleValue(variable))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Detected Variables</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {extractVariables(editForm.content + (editForm.subject || "")).map((variable) => (
                    <Badge key={variable} variant="outline" className="text-xs">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} className="bg-black text-white hover:bg-gray-800">
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? "Create Template" : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
