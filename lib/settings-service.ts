export interface BrandingSettings {
  businessName: string
  logo: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  darkMode: boolean
  customCSS?: string
}

export interface NotificationSettings {
  emailNotifications: {
    enabled: boolean
    confirmations: boolean
    reminders: boolean
    followUps: boolean
    marketing: boolean
    reminderTiming: number // hours before appointment
  }
  smsNotifications: {
    enabled: boolean
    confirmations: boolean
    reminders: boolean
    reminderTiming: number // hours before appointment
  }
  staffNotifications: {
    newBookingEmail: boolean
    newBookingEmailRecipients: string[]
    dailySummaryEmail: boolean
    dailySummaryEmailRecipients: string[]
  }
}

export interface WidgetSettings {
  showLogo: boolean
  showPricing: boolean
  allowCancellations: boolean
  requirePhone: boolean
  requireEmail: boolean
  collectNotes: boolean
  showSocialProof: boolean
  embedCode: string
  customColors: boolean
  customHeader?: string
  customFooter?: string
}

export interface BusinessSettings {
  businessName: string
  businessEmail: string
  businessPhone: string
  businessAddress: string
  businessHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  timezone: string
  currency: string
  services: Array<{
    id: string
    name: string
    duration: number
    price: number
    description: string
    color?: string
  }>
}

export interface SettingsState {
  branding: BrandingSettings
  notifications: NotificationSettings
  widget: WidgetSettings
  business: BusinessSettings
}

// Default settings
const defaultSettings: SettingsState = {
  branding: {
    businessName: "Nawara Labs",
    logo: "/images/nawara-labs-logo.png",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#f3f4f6",
    fontFamily: "Inter, sans-serif",
    darkMode: false,
  },
  notifications: {
    emailNotifications: {
      enabled: true,
      confirmations: true,
      reminders: true,
      followUps: true,
      marketing: false,
      reminderTiming: 24,
    },
    smsNotifications: {
      enabled: false,
      confirmations: true,
      reminders: true,
      reminderTiming: 2,
    },
    staffNotifications: {
      newBookingEmail: true,
      newBookingEmailRecipients: ["admin@nawaralabs.com"],
      dailySummaryEmail: false,
      dailySummaryEmailRecipients: [],
    },
  },
  widget: {
    showLogo: true,
    showPricing: true,
    allowCancellations: true,
    requirePhone: true,
    requireEmail: true,
    collectNotes: true,
    showSocialProof: false,
    embedCode: `<div id="nawara-booking-widget"></div>
<script src="https://your-domain.com/widget.js"></script>
<script>
  NawaraBooking.init({
    containerId: 'nawara-booking-widget',
    businessName: 'Your Business Name',
  });
</script>`,
    customColors: false,
  },
  business: {
    businessName: "Nawara Labs",
    businessEmail: "appointments@nawaralabs.com",
    businessPhone: "+1 (555) 123-4567",
    businessAddress: "123 Business Street, City, State 12345",
    businessHours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "10:00", close: "15:00", closed: false },
      sunday: { open: "09:00", close: "17:00", closed: true },
    },
    timezone: "America/New_York",
    currency: "USD",
    services: [
      {
        id: "consultation",
        name: "Consultation",
        duration: 30,
        price: 100,
        description: "Initial consultation with our experts",
      },
      {
        id: "followup",
        name: "Follow-up",
        duration: 15,
        price: 50,
        description: "Quick follow-up appointment",
      },
      {
        id: "assessment",
        name: "Assessment",
        duration: 45,
        price: 150,
        description: "Comprehensive assessment session",
      },
      {
        id: "treatment",
        name: "Treatment",
        duration: 60,
        price: 200,
        description: "Full treatment session",
      },
    ],
  },
}

export class SettingsService {
  private static instance: SettingsService
  private settings: SettingsState

  private constructor() {
    // In a real app, we would load from localStorage, database, or API
    this.settings = this.loadSettings() || defaultSettings
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService()
    }
    return SettingsService.instance
  }

  private loadSettings(): SettingsState | null {
    if (typeof window === "undefined") {
      return null
    }

    const savedSettings = localStorage.getItem("nawaraSettings")
    return savedSettings ? JSON.parse(savedSettings) : null
  }

  private saveSettings(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("nawaraSettings", JSON.stringify(this.settings))
    }
  }

  public getSettings(): SettingsState {
    return { ...this.settings }
  }

  public getBrandingSettings(): BrandingSettings {
    return { ...this.settings.branding }
  }

  public getNotificationSettings(): NotificationSettings {
    return { ...this.settings.notifications }
  }

  public getWidgetSettings(): WidgetSettings {
    return { ...this.settings.widget }
  }

  public getBusinessSettings(): BusinessSettings {
    return { ...this.settings.business }
  }

  public updateBrandingSettings(settings: Partial<BrandingSettings>): void {
    this.settings.branding = { ...this.settings.branding, ...settings }
    this.saveSettings()
    this.applyBrandingToDOM()
  }

  public updateNotificationSettings(settings: Partial<NotificationSettings>): void {
    this.settings.notifications = { ...this.settings.notifications, ...settings }
    this.saveSettings()
  }

  public updateWidgetSettings(settings: Partial<WidgetSettings>): void {
    this.settings.widget = { ...this.settings.widget, ...settings }
    this.saveSettings()
  }

  public updateBusinessSettings(settings: Partial<BusinessSettings>): void {
    this.settings.business = { ...this.settings.business, ...settings }
    this.saveSettings()
  }

  public resetToDefaults(): void {
    this.settings = { ...defaultSettings }
    this.saveSettings()
    this.applyBrandingToDOM()
  }

  public applyBrandingToDOM(): void {
    if (typeof window === "undefined") {
      return
    }

    const { primaryColor, secondaryColor, accentColor, fontFamily, darkMode } = this.settings.branding

    // Create or update the style element
    let styleEl = document.getElementById("branding-styles")
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "branding-styles"
      document.head.appendChild(styleEl)
    }

    // Apply CSS variables
    styleEl.innerHTML = `
      :root {
        --primary-color: ${primaryColor};
        --secondary-color: ${secondaryColor};
        --accent-color: ${accentColor};
        --font-family: ${fontFamily};
      }
      
      body {
        font-family: var(--font-family);
      }
      
      .bg-primary {
        background-color: var(--primary-color) !important;
      }
      
      .text-primary {
        color: var(--primary-color) !important;
      }
      
      .border-primary {
        border-color: var(--primary-color) !important;
      }
      
      /* Add more custom styles as needed */
      ${this.settings.branding.customCSS || ""}
    `

    // Apply dark mode if enabled
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  public generateEmbedCode(customSettings: Record<string, any> = {}): string {
    const { businessName } = this.settings.business
    const settings = {
      businessName,
      ...customSettings,
    }

    return `<div id="nawara-booking-widget"></div>
<script src="https://your-domain.com/widget.js"></script>
<script>
  NawaraBooking.init({
    containerId: 'nawara-booking-widget',
    businessName: '${settings.businessName}',
    primaryColor: '${this.settings.branding.primaryColor}',
    showPricing: ${this.settings.widget.showPricing},
    showLogo: ${this.settings.widget.showLogo},
    // Add more settings as needed
  });
</script>`
  }
}

// Initialize settings on the client side
if (typeof window !== "undefined") {
  const settingsService = SettingsService.getInstance()
  settingsService.applyBrandingToDOM()
}
