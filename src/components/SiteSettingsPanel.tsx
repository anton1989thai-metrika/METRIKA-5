"use client"

import Image from "next/image"
import { debugLog } from "@/lib/logger"

import { useState } from "react"
import { 
  Save, 
  BarChart,
  FileText,
  UserPlus,
  RefreshCw, 
  Globe, 
  Mail, 
  Shield, 
  Database, 
  Palette, 
  Bell, 
  Users, 
  Upload, 
  Download, 
  Plus, 
  X, 
  Info,
  Server,
  Monitor,
  Link
} from "lucide-react"

interface SiteSettings {
  general: {
    siteName: string
    siteDescription: string
    siteKeywords: string
    siteUrl: string
    language: string
    timezone: string
    currency: string
    dateFormat: string
  }
  contact: {
    companyName: string
    email: string
    phone: string
    address: string
    workingHours: string
    socialMedia: {
      facebook: string
      instagram: string
      telegram: string
      whatsapp: string
    }
  }
  appearance: {
    logo: string
    favicon: string
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    theme: 'light' | 'dark' | 'auto'
  }
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    googleAnalytics: string
    yandexMetrika: string
    googleSearchConsole: string
    sitemapUrl: string
  }
  security: {
    enableSSL: boolean
    twoFactorAuth: boolean
    passwordMinLength: number
    sessionTimeout: number
    maxLoginAttempts: number
    ipWhitelist: string[]
    blockedIPs: string[]
    twoFactorAuthSettings: {
      enabled: boolean
      methods: string[]
      backupCodes: boolean
      smsProvider: string
      smsApiKey: string
      emailProvider: string
    }
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSymbols: boolean
      passwordExpiry: number
      preventReuse: number
    }
    accessControl: {
      roleBasedAccess: boolean
      ipRestriction: boolean
      geoBlocking: boolean
      allowedCountries: string[]
      blockedCountries: string[]
      workingHours: boolean
      workingHoursStart: string
      workingHoursEnd: string
    }
    auditLogging: {
      enabled: boolean
      logLevel: string
      retentionDays: number
      logUserActions: boolean
      logSystemEvents: boolean
      logSecurityEvents: boolean
    }
    bruteForceProtection: {
      enabled: boolean
      maxAttempts: number
      lockoutDuration: number
      progressiveDelay: boolean
      captchaAfterAttempts: number
    }
    sslCertificates: {
      autoRenewal: boolean
      certificateProvider: string
      apiKey: string
      domains: string[]
      wildcardEnabled: boolean
    }
    sessionManagement: {
      secureCookies: boolean
      httpOnlyCookies: boolean
      sameSitePolicy: string
      sessionRegeneration: boolean
      concurrentSessions: number
    }
  }
  localization: {
    enabled: boolean
    defaultLanguage: string
    supportedLanguages: string[]
    autoDetectLanguage: boolean
    fallbackLanguage: string
    translations: {
      autoTranslation: boolean
      translationProvider: string
      apiKey: string
      translateOnSave: boolean
      reviewRequired: boolean
    }
    regionalSettings: {
      dateFormat: string
      timeFormat: string
      numberFormat: string
      currency: string
      timezone: string
      units: string
    }
    seo: {
      hreflangEnabled: boolean
      separateUrls: boolean
      urlStructure: string
      canonicalUrls: boolean
    }
    rtlSupport: {
      enabled: boolean
      rtlLanguages: string[]
    }
    adminPanel: {
      adminLanguage: string
      translateInterface: boolean
    }
  }
  analytics: {
    enabled: boolean
    trackingCode: string
    customReports: {
      enabled: boolean
      maxReports: number
      retentionDays: number
    }
    scheduledReports: {
      enabled: boolean
      frequency: string
      recipients: string[]
      formats: string[]
    }
    dataExport: {
      enabled: boolean
      formats: string[]
      maxRecords: number
      compressionEnabled: boolean
    }
    comparativeAnalysis: {
      enabled: boolean
      maxPeriods: number
      segmentComparison: boolean
      campaignComparison: boolean
    }
    forecasting: {
      enabled: boolean
      algorithm: string
      predictionDays: number
      confidenceLevel: number
    }
    abTesting: {
      enabled: boolean
      minSampleSize: number
      significanceLevel: number
      maxTests: number
    }
    cohortAnalysis: {
      enabled: boolean
      retentionPeriods: number[]
      cohortTypes: string[]
    }
    dashboards: {
      enabled: boolean
      maxDashboards: number
      realTimeUpdates: boolean
      customWidgets: boolean
    }
    alerts: {
      enabled: boolean
      thresholds: {
        trafficDrop: number
        conversionDrop: number
        errorRate: number
        responseTime: number
      }
      notificationChannels: string[]
    }
    biIntegration: {
      enabled: boolean
      providers: string[]
      apiKeys: { [key: string]: string }
    }
    apiAccess: {
      enabled: boolean
      rateLimit: number
      authentication: string
      endpoints: string[]
    }
  }
  email: {
    enabled: boolean
    domain: string
    storage: {
      provider: string
      localPath: string
      cloudProvider: string
      cloudConfig: { [key: string]: string }
    }
    mailboxes: {
      maxMailboxes: number
      defaultQuota: number
      autoCreate: boolean
    }
    security: {
      antiSpam: boolean
      antiVirus: boolean
      encryption: boolean
      sslEnabled: boolean
    }
    notifications: {
      browserNotifications: boolean
      soundNotifications: boolean
      visualIndicators: boolean
      pushNotifications: boolean
      internalNotifications: boolean
    }
    blocks: {
      enabled: boolean
      defaultBlocks: string[]
      customBlocks: boolean
      autoSorting: boolean
    }
    integration: {
      imapEnabled: boolean
      smtpEnabled: boolean
      pop3Enabled: boolean
      webmailEnabled: boolean
    }
    backup: {
      enabled: boolean
      frequency: string
      retention: number
      compression: boolean
    }
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    webhookNotifications: boolean
    adminEmail: string
    adminPhone: string
    notificationTypes: string[]
    emailTemplates: {
      newUser: string
      newApplication: string
      systemAlert: string
      passwordReset: string
      welcome: string
    }
    smsSettings: {
      provider: string
      apiKey: string
      senderName: string
      templates: {
        verification: string
        reminder: string
        alert: string
      }
    }
    pushSettings: {
      enabled: boolean
      vapidPublicKey: string
      vapidPrivateKey: string
      serverKey: string
    }
    webhookSettings: {
      url: string
      secret: string
      events: string[]
      retryAttempts: number
    }
    scheduleSettings: {
      workingHours: string
      timezone: string
      weekendNotifications: boolean
      holidayNotifications: boolean
    }
  }
  backup: {
    autoBackup: boolean
    backupFrequency: string
    backupRetention: number
    backupLocation: string
    lastBackup: string
    storageProviders: {
      local: {
        enabled: boolean
        path: string
        maxSize: number
      }
      cloud: {
        enabled: boolean
        provider: string
        bucket: string
        region: string
        accessKey: string
        secretKey: string
      }
      ftp: {
        enabled: boolean
        host: string
        port: number
        username: string
        password: string
        path: string
      }
      email: {
        enabled: boolean
        email: string
        maxSize: number
      }
    }
    backupTypes: {
      database: boolean
      files: boolean
      media: boolean
      config: boolean
      logs: boolean
    }
    compression: {
      enabled: boolean
      algorithm: string
      level: number
    }
    encryption: {
      enabled: boolean
      password: string
      algorithm: string
    }
    schedule: {
      time: string
      timezone: string
      weekdays: string[]
    }
    notifications: {
      success: boolean
      failure: boolean
      email: string
    }
  }
  performance: {
    enableCaching: boolean
    cacheExpiry: number
    imageOptimization: boolean
    compressionEnabled: boolean
    cdnEnabled: boolean
    cdnUrl: string
    monitoring: {
      enabled: boolean
      realTimeMonitoring: boolean
      alertThresholds: {
        responseTime: number
        cpuUsage: number
        memoryUsage: number
        diskUsage: number
        errorRate: number
      }
      metrics: {
        pageLoadTime: boolean
        serverResponseTime: boolean
        databaseQueryTime: boolean
        apiResponseTime: boolean
        resourceUsage: boolean
        errorTracking: boolean
      }
      reporting: {
        frequency: string
        emailReports: boolean
        dashboardUpdates: boolean
        exportFormats: string[]
      }
    }
    optimization: {
      database: {
        queryOptimization: boolean
        connectionPooling: boolean
        indexOptimization: boolean
        cacheQueries: boolean
        slowQueryLogging: boolean
      }
      frontend: {
        codeSplitting: boolean
        treeShaking: boolean
        bundleOptimization: boolean
        criticalCSS: boolean
        preloadResources: boolean
      }
      server: {
        gzipCompression: boolean
        http2Enabled: boolean
        keepAlive: boolean
        workerProcesses: number
        maxConnections: number
      }
      images: {
        webpConversion: boolean
        responsiveImages: boolean
        imageCompression: boolean
        lazyLoading: boolean
        placeholderImages: boolean
      }
    }
    alerts: {
      email: string
      slack: string
      telegram: string
      webhook: string
      notificationTypes: string[]
    }
    maintenance: {
      autoOptimization: boolean
      scheduledMaintenance: boolean
      maintenanceWindow: string
      backupBeforeOptimization: boolean
    }
  }
  integrations: {
    crm: {
      enabled: boolean
      provider: string
      apiKey: string
      apiUrl: string
      syncContacts: boolean
      syncDeals: boolean
    }
    payment: {
      enabled: boolean
      provider: string
      merchantId: string
      secretKey: string
      testMode: boolean
      currencies: string[]
    }
    email: {
      provider: string
      smtpHost: string
      smtpPort: number
      smtpUser: string
      smtpPassword: string
      fromEmail: string
      fromName: string
    }
    maps: {
      provider: string
      apiKey: string
      defaultZoom: number
      centerLat: number
      centerLng: number
    }
    social: {
      facebook: {
        enabled: boolean
        appId: string
        appSecret: string
        pageId: string
      }
      instagram: {
        enabled: boolean
        accessToken: string
        businessAccountId: string
      }
      telegram: {
        enabled: boolean
        botToken: string
        channelId: string
      }
    }
    analytics: {
      googleAnalytics: {
        enabled: boolean
        trackingId: string
        enhancedEcommerce: boolean
      }
      yandexMetrika: {
        enabled: boolean
        counterId: string
        webvisor: boolean
      }
      facebookPixel: {
        enabled: boolean
        pixelId: string
      }
    }
    chat: {
      enabled: boolean
      provider: string
      widgetId: string
      apiKey: string
      autoGreeting: boolean
      workingHours: string
    }
  }
  hr: {
    workingHours: {
      defaultStartTime: string
      defaultEndTime: string
      workingDays: string[]
      overtimeRate: number
      breakDuration: number
    }
    salary: {
      currency: string
      taxRate: number
      socialContributions: number
      autoCalculation: boolean
      monthlyCalculation: boolean
    }
    notifications: {
      emailNotifications: boolean
      pushNotifications: boolean
      smsNotifications: boolean
      notificationTypes: string[]
    }
    permissions: {
      roleBasedAccess: boolean
      defaultRole: string
      allowSelfRegistration: boolean
    }
  }
}

export default function SiteSettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings>({
    general: {
      siteName: "МЕТРИКА",
      siteDescription: "Агентство недвижимости",
      siteKeywords: "недвижимость, квартиры, дома, аренда, продажа",
      siteUrl: "https://metrika.ru",
      language: "ru",
      timezone: "Europe/Moscow",
      currency: "RUB",
      dateFormat: "DD.MM.YYYY"
    },
    contact: {
      companyName: "ООО МЕТРИКА",
      email: "info@metrika.ru",
      phone: "+7 (495) 123-45-67",
      address: "г. Москва, ул. Примерная, д. 1",
      workingHours: "Пн-Пт: 9:00-18:00, Сб-Вс: 10:00-16:00",
      socialMedia: {
        facebook: "https://facebook.com/metrika",
        instagram: "https://instagram.com/metrika",
        telegram: "https://t.me/metrika",
        whatsapp: "+7 (495) 123-45-67"
      }
    },
    appearance: {
      logo: "/images/logo.png",
      favicon: "/favicon.ico",
      primaryColor: "#000000",
      secondaryColor: "#fff60b",
      fontFamily: "Inter",
      theme: "light"
    },
    seo: {
      metaTitle: "МЕТРИКА - Агентство недвижимости",
      metaDescription: "Профессиональные услуги по продаже и аренде недвижимости",
      metaKeywords: "недвижимость, квартиры, дома, аренда, продажа",
      googleAnalytics: "GA-XXXXXXXXX",
      yandexMetrika: "XXXXXXXXX",
      googleSearchConsole: "https://search.google.com/search-console",
      sitemapUrl: "https://metrika.ru/sitemap.xml"
    },
    security: {
      enableSSL: true,
      twoFactorAuth: false,
      passwordMinLength: 8,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      ipWhitelist: [],
      blockedIPs: [],
      twoFactorAuthSettings: {
        enabled: false,
        methods: ["totp", "sms", "email"],
        backupCodes: true,
        smsProvider: "SMS.ru",
        smsApiKey: "",
        emailProvider: "SMTP"
      },
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: false,
        passwordExpiry: 90, // дни
        preventReuse: 5 // последних паролей
      },
      accessControl: {
        roleBasedAccess: true,
        ipRestriction: false,
        geoBlocking: false,
        allowedCountries: [],
        blockedCountries: [],
        workingHours: false,
        workingHoursStart: "09:00",
        workingHoursEnd: "18:00"
      },
      auditLogging: {
        enabled: true,
        logLevel: "info",
        retentionDays: 90,
        logUserActions: true,
        logSystemEvents: true,
        logSecurityEvents: true
      },
      bruteForceProtection: {
        enabled: true,
        maxAttempts: 5,
        lockoutDuration: 15, // минуты
        progressiveDelay: true,
        captchaAfterAttempts: 3
      },
      sslCertificates: {
        autoRenewal: true,
        certificateProvider: "Let's Encrypt",
        apiKey: "",
        domains: ["metrika.ru", "www.metrika.ru"],
        wildcardEnabled: false
      },
      sessionManagement: {
        secureCookies: true,
        httpOnlyCookies: true,
        sameSitePolicy: "strict",
        sessionRegeneration: true,
        concurrentSessions: 3
      }
    },
    localization: {
      enabled: false,
      defaultLanguage: "ru",
      supportedLanguages: ["ru", "en"],
      autoDetectLanguage: true,
      fallbackLanguage: "ru",
      translations: {
        autoTranslation: false,
        translationProvider: "Google Translate",
        apiKey: "",
        translateOnSave: false,
        reviewRequired: true
      },
      regionalSettings: {
        dateFormat: "DD.MM.YYYY",
        timeFormat: "HH:mm",
        numberFormat: "ru-RU",
        currency: "RUB",
        timezone: "Europe/Moscow",
        units: "metric"
      },
      seo: {
        hreflangEnabled: true,
        separateUrls: false,
        urlStructure: "subdirectory", // subdirectory, subdomain, parameter
        canonicalUrls: true
      },
      rtlSupport: {
        enabled: false,
        rtlLanguages: ["ar", "he", "fa"]
      },
      adminPanel: {
        adminLanguage: "ru",
        translateInterface: false
      }
    },
    analytics: {
      enabled: true,
      trackingCode: "GA-XXXXXXXXX",
      customReports: {
        enabled: true,
        maxReports: 50,
        retentionDays: 365
      },
      scheduledReports: {
        enabled: false,
        frequency: "weekly",
        recipients: ["admin@metrika.ru"],
        formats: ["pdf", "excel"]
      },
      dataExport: {
        enabled: true,
        formats: ["csv", "excel", "json", "pdf"],
        maxRecords: 100000,
        compressionEnabled: true
      },
      comparativeAnalysis: {
        enabled: true,
        maxPeriods: 12,
        segmentComparison: true,
        campaignComparison: true
      },
      forecasting: {
        enabled: false,
        algorithm: "linear_regression",
        predictionDays: 30,
        confidenceLevel: 95
      },
      abTesting: {
        enabled: false,
        minSampleSize: 1000,
        significanceLevel: 95,
        maxTests: 10
      },
      cohortAnalysis: {
        enabled: false,
        retentionPeriods: [1, 7, 14, 30, 90],
        cohortTypes: ["registration", "first_purchase", "subscription"]
      },
      dashboards: {
        enabled: true,
        maxDashboards: 20,
        realTimeUpdates: true,
        customWidgets: true
      },
      alerts: {
        enabled: true,
        thresholds: {
          trafficDrop: 20, // %
          conversionDrop: 15, // %
          errorRate: 5, // %
          responseTime: 3000 // ms
        },
        notificationChannels: ["email", "slack"]
      },
      biIntegration: {
        enabled: false,
        providers: ["Tableau", "Power BI", "Looker"],
        apiKeys: {}
      },
      apiAccess: {
        enabled: false,
        rateLimit: 1000, // requests per hour
        authentication: "api_key",
        endpoints: ["analytics", "reports", "users"]
      }
    },
    email: {
      enabled: true,
      domain: "metrika.direct",
      storage: {
        provider: "local",
        localPath: "/var/mail/metrika",
        cloudProvider: "aws",
        cloudConfig: {}
      },
      mailboxes: {
        maxMailboxes: 50,
        defaultQuota: 1024, // MB
        autoCreate: false
      },
      security: {
        antiSpam: true,
        antiVirus: true,
        encryption: false,
        sslEnabled: true
      },
      notifications: {
        browserNotifications: true,
        soundNotifications: true,
        visualIndicators: true,
        pushNotifications: true,
        internalNotifications: true
      },
      blocks: {
        enabled: true,
        defaultBlocks: ["Банки", "Партнеры", "Неизвестные", "Документы", "Важные"],
        customBlocks: true,
        autoSorting: false
      },
      integration: {
        imapEnabled: true,
        smtpEnabled: true,
        pop3Enabled: false,
        webmailEnabled: true
      },
      backup: {
        enabled: true,
        frequency: "daily",
        retention: 30,
        compression: true
      }
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      webhookNotifications: false,
      adminEmail: "admin@metrika.ru",
      adminPhone: "+7 (495) 123-45-67",
      notificationTypes: ["new_user", "new_application", "system_alert", "password_reset", "welcome"],
      emailTemplates: {
        newUser: "Добро пожаловать! Ваш аккаунт создан успешно.",
        newApplication: "Новая заявка от клиента: {{client_name}}",
        systemAlert: "Системное уведомление: {{message}}",
        passwordReset: "Ссылка для сброса пароля: {{reset_link}}",
        welcome: "Добро пожаловать в МЕТРИКА! Спасибо за регистрацию."
      },
      smsSettings: {
        provider: "SMS.ru",
        apiKey: "",
        senderName: "METRIKA",
        templates: {
          verification: "Код подтверждения: {{code}}",
          reminder: "Напоминание: {{message}}",
          alert: "Важное уведомление: {{message}}"
        }
      },
      pushSettings: {
        enabled: false,
        vapidPublicKey: "",
        vapidPrivateKey: "",
        serverKey: ""
      },
      webhookSettings: {
        url: "",
        secret: "",
        events: ["user_registered", "application_created", "system_error"],
        retryAttempts: 3
      },
      scheduleSettings: {
        workingHours: "Пн-Пт: 9:00-18:00",
        timezone: "Europe/Moscow",
        weekendNotifications: false,
        holidayNotifications: false
      }
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      backupRetention: 30,
      backupLocation: "/backups",
      lastBackup: "2024-01-20 03:00:00",
      storageProviders: {
        local: {
          enabled: true,
          path: "/var/backups/metrika",
          maxSize: 10240 // 10GB в MB
        },
        cloud: {
          enabled: false,
          provider: "AWS S3",
          bucket: "",
          region: "eu-west-1",
          accessKey: "",
          secretKey: ""
        },
        ftp: {
          enabled: false,
          host: "",
          port: 21,
          username: "",
          password: "",
          path: "/backups"
        },
        email: {
          enabled: false,
          email: "backup@metrika.ru",
          maxSize: 25 // 25MB
        }
      },
      backupTypes: {
        database: true,
        files: true,
        media: true,
        config: true,
        logs: false
      },
      compression: {
        enabled: true,
        algorithm: "gzip",
        level: 6
      },
      encryption: {
        enabled: false,
        password: "",
        algorithm: "AES-256"
      },
      schedule: {
        time: "03:00",
        timezone: "Europe/Moscow",
        weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      },
      notifications: {
        success: true,
        failure: true,
        email: "admin@metrika.ru"
      }
    },
    performance: {
      enableCaching: true,
      cacheExpiry: 3600,
      imageOptimization: true,
      compressionEnabled: true,
      cdnEnabled: false,
      cdnUrl: "",
      monitoring: {
        enabled: true,
        realTimeMonitoring: true,
        alertThresholds: {
          responseTime: 2000, // 2 секунды
          cpuUsage: 80, // 80%
          memoryUsage: 85, // 85%
          diskUsage: 90, // 90%
          errorRate: 5 // 5%
        },
        metrics: {
          pageLoadTime: true,
          serverResponseTime: true,
          databaseQueryTime: true,
          apiResponseTime: true,
          resourceUsage: true,
          errorTracking: true
        },
        reporting: {
          frequency: "daily",
          emailReports: true,
          dashboardUpdates: true,
          exportFormats: ["pdf", "csv", "json"]
        }
      },
      optimization: {
        database: {
          queryOptimization: true,
          connectionPooling: true,
          indexOptimization: true,
          cacheQueries: true,
          slowQueryLogging: true
        },
        frontend: {
          codeSplitting: true,
          treeShaking: true,
          bundleOptimization: true,
          criticalCSS: true,
          preloadResources: true
        },
        server: {
          gzipCompression: true,
          http2Enabled: true,
          keepAlive: true,
          workerProcesses: 4,
          maxConnections: 1000
        },
        images: {
          webpConversion: true,
          responsiveImages: true,
          imageCompression: true,
          lazyLoading: true,
          placeholderImages: true
        }
      },
      alerts: {
        email: "admin@metrika.ru",
        slack: "",
        telegram: "",
        webhook: "",
        notificationTypes: ["performance_degradation", "high_error_rate", "resource_exhaustion", "slow_queries"]
      },
      maintenance: {
        autoOptimization: true,
        scheduledMaintenance: false,
        maintenanceWindow: "02:00-04:00",
        backupBeforeOptimization: true
      }
    },
    integrations: {
      crm: {
        enabled: false,
        provider: "amoCRM",
        apiKey: "",
        apiUrl: "",
        syncContacts: true,
        syncDeals: true
      },
      payment: {
        enabled: false,
        provider: "YooKassa",
        merchantId: "",
        secretKey: "",
        testMode: true,
        currencies: ["RUB", "USD", "EUR"]
      },
      email: {
        provider: "SMTP",
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpUser: "",
        smtpPassword: "",
        fromEmail: "noreply@metrika.ru",
        fromName: "МЕТРИКА"
      },
      maps: {
        provider: "Yandex",
        apiKey: "",
        defaultZoom: 10,
        centerLat: 55.7558,
        centerLng: 37.6176
      },
      social: {
        facebook: {
          enabled: false,
          appId: "",
          appSecret: "",
          pageId: ""
        },
        instagram: {
          enabled: false,
          accessToken: "",
          businessAccountId: ""
        },
        telegram: {
          enabled: false,
          botToken: "",
          channelId: ""
        }
      },
      analytics: {
        googleAnalytics: {
          enabled: false,
          trackingId: "",
          enhancedEcommerce: false
        },
        yandexMetrika: {
          enabled: false,
          counterId: "",
          webvisor: true
        },
        facebookPixel: {
          enabled: false,
          pixelId: ""
        }
      },
      chat: {
        enabled: false,
        provider: "Jivosite",
        widgetId: "",
        apiKey: "",
        autoGreeting: true,
        workingHours: "Пн-Пт: 9:00-18:00"
      }
    },
    hr: {
      workingHours: {
        defaultStartTime: "09:00",
        defaultEndTime: "18:00",
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        overtimeRate: 1.5,
        breakDuration: 60
      },
      salary: {
        currency: "RUB",
        taxRate: 13,
        socialContributions: 30,
        autoCalculation: true,
        monthlyCalculation: true
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        notificationTypes: ["salary", "vacation", "penalty", "bonus", "time"]
      },
      permissions: {
        roleBasedAccess: true,
        defaultRole: "employee",
        allowSelfRegistration: false
      }
    }
  })

  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [newIP, setNewIP] = useState('')
  const [showIPModal, setShowIPModal] = useState(false)
  const [ipModalType] = useState<'whitelist' | 'blocked'>('whitelist')

  const tabs = [
    { id: 'general', label: 'Общие', icon: <Globe className="w-4 h-4" /> },
    { id: 'contact', label: 'Контакты', icon: <Mail className="w-4 h-4" /> },
    { id: 'appearance', label: 'Внешний вид', icon: <Palette className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO', icon: <Monitor className="w-4 h-4" /> },
    { id: 'security', label: 'Безопасность', icon: <Shield className="w-4 h-4" /> },
    { id: 'localization', label: 'Многоязычность', icon: <Globe className="w-4 h-4" /> },
    { id: 'notifications', label: 'Уведомления', icon: <Bell className="w-4 h-4" /> },
    { id: 'backup', label: 'Резервные копии', icon: <Database className="w-4 h-4" /> },
    { id: 'performance', label: 'Производительность', icon: <Server className="w-4 h-4" /> },
    { id: 'analytics', label: 'Аналитика', icon: <BarChart className="w-4 h-4" /> },
    { id: 'email', label: 'Почта', icon: <Mail className="w-4 h-4" /> },
    { id: 'integrations', label: 'Интеграции', icon: <Link className="w-4 h-4" /> },
    { id: 'contracts', label: 'Конструктор договоров', icon: <FileText className="w-4 h-4" /> },
    { id: 'hr', label: 'Кадры и бухгалтерия', icon: <Users className="w-4 h-4" /> }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    
    // Симуляция сохранения
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSaving(false)
    // В реальном приложении здесь будет API вызов
    debugLog('Настройки сохранены:', settings)
  }

  const handleReset = () => {
    if (confirm('Вы уверены, что хотите сбросить настройки к значениям по умолчанию?')) {
      // Сброс к значениям по умолчанию
      window.location.reload()
    }
  }

  const handleAddIP = () => {
    if (newIP.trim()) {
      const updatedSettings = { ...settings }
      if (ipModalType === 'whitelist') {
        updatedSettings.security.ipWhitelist.push(newIP.trim())
      } else {
        updatedSettings.security.blockedIPs.push(newIP.trim())
      }
      setSettings(updatedSettings)
      setNewIP('')
      setShowIPModal(false)
    }
  }

  const handleFileUpload = (field: string, file: File) => {
    // В реальном приложении здесь будет загрузка файла
    const reader = new FileReader()
    reader.onload = (e) => {
      const updatedSettings = { ...settings }
      if (field === 'logo') {
        updatedSettings.appearance.logo = e.target?.result as string
      } else if (field === 'favicon') {
        updatedSettings.appearance.favicon = e.target?.result as string
      }
      setSettings(updatedSettings)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-black">Настройки сайта</h2>
            <p className="text-gray-600">Конфигурация основных параметров сайта</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Сбросить
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium disabled:opacity-50"
              style={{backgroundColor: '#fff60b'}}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#e6d90a')}
              onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#fff60b')}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 inline mr-2" />
                  Сохранить
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Боковая навигация */}
        <div className="w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-300 shadow-sm hover:shadow-md'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Основной контент */}
        <div className="flex-1 bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          {/* Общие настройки */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Общие настройки</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Название сайта</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteName: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">URL сайта</label>
                  <input
                    type="url"
                    value={settings.general.siteUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteUrl: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Описание сайта</label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteDescription: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white h-20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Ключевые слова</label>
                <input
                  type="text"
                  value={settings.general.siteKeywords}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteKeywords: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  placeholder="недвижимость, квартиры, дома, аренда, продажа"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Язык</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, language: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    <option value="th">ไทย</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Часовой пояс</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="Europe/Moscow">Москва (UTC+3)</option>
                    <option value="Europe/London">Лондон (UTC+0)</option>
                    <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Валюта</label>
                  <select
                    value={settings.general.currency}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, currency: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="RUB">₽ Рубль</option>
                    <option value="USD">$ Доллар</option>
                    <option value="EUR">€ Евро</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Контактная информация */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Контактная информация</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Название компании</label>
                  <input
                    type="text"
                    value={settings.contact.companyName}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, companyName: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Телефон</label>
                  <input
                    type="tel"
                    value={settings.contact.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Часы работы</label>
                  <input
                    type="text"
                    value={settings.contact.workingHours}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, workingHours: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Адрес</label>
                <textarea
                  value={settings.contact.address}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact: { ...settings.contact, address: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white h-20"
                />
              </div>
              
              <div>
                <h4 className="text-md font-semibold text-black mb-4">Социальные сети</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Facebook</label>
                    <input
                      type="url"
                      value={settings.contact.socialMedia.facebook}
                      onChange={(e) => setSettings({
                        ...settings,
                        contact: {
                          ...settings.contact,
                          socialMedia: { ...settings.contact.socialMedia, facebook: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Instagram</label>
                    <input
                      type="url"
                      value={settings.contact.socialMedia.instagram}
                      onChange={(e) => setSettings({
                        ...settings,
                        contact: {
                          ...settings.contact,
                          socialMedia: { ...settings.contact.socialMedia, instagram: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Telegram</label>
                    <input
                      type="url"
                      value={settings.contact.socialMedia.telegram}
                      onChange={(e) => setSettings({
                        ...settings,
                        contact: {
                          ...settings.contact,
                          socialMedia: { ...settings.contact.socialMedia, telegram: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">WhatsApp</label>
                    <input
                      type="tel"
                      value={settings.contact.socialMedia.whatsapp}
                      onChange={(e) => setSettings({
                        ...settings,
                        contact: {
                          ...settings.contact,
                          socialMedia: { ...settings.contact.socialMedia, whatsapp: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Внешний вид */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Внешний вид</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Логотип</label>
                  <div className="flex items-center gap-4">
                    <Image
                      src={settings.appearance.logo}
                      alt="Logo"
                      width={64}
                      height={64}
                      unoptimized
                      className="w-16 h-16 object-contain border border-gray-300 rounded"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('logo', e.target.files[0])}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4 inline mr-2" />
                        Загрузить
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Favicon</label>
                  <div className="flex items-center gap-4">
                    <Image
                      src={settings.appearance.favicon}
                      alt="Favicon"
                      width={32}
                      height={32}
                      unoptimized
                      className="w-8 h-8 object-contain border border-gray-300 rounded"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('favicon', e.target.files[0])}
                        className="hidden"
                        id="favicon-upload"
                      />
                      <label
                        htmlFor="favicon-upload"
                        className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4 inline mr-2" />
                        Загрузить
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Основной цвет</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, primaryColor: e.target.value }
                      })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, primaryColor: e.target.value }
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Дополнительный цвет</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, secondaryColor: e.target.value }
                      })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, secondaryColor: e.target.value }
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Шрифт</label>
                  <select
                    value={settings.appearance.fontFamily}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, fontFamily: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Тема</label>
                  <select
                    value={settings.appearance.theme}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, theme: e.target.value as 'light' | 'dark' | 'auto' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  >
                    <option value="light">Светлая</option>
                    <option value="dark">Темная</option>
                    <option value="auto">Автоматически</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SEO настройки */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">SEO настройки</h3>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Meta заголовок</label>
                <input
                  type="text"
                  value={settings.seo.metaTitle}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, metaTitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Meta описание</label>
                <textarea
                  value={settings.seo.metaDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, metaDescription: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white h-20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Meta ключевые слова</label>
                <input
                  type="text"
                  value={settings.seo.metaKeywords}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, metaKeywords: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Google Analytics ID</label>
                  <input
                    type="text"
                    value={settings.seo.googleAnalytics}
                    onChange={(e) => setSettings({
                      ...settings,
                      seo: { ...settings.seo, googleAnalytics: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="GA-XXXXXXXXX"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Яндекс.Метрика ID</label>
                  <input
                    type="text"
                    value={settings.seo.yandexMetrika}
                    onChange={(e) => setSettings({
                      ...settings,
                      seo: { ...settings.seo, yandexMetrika: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder="XXXXXXXXX"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Google Search Console</label>
                  <input
                    type="url"
                    value={settings.seo.googleSearchConsole}
                    onChange={(e) => setSettings({
                      ...settings,
                      seo: { ...settings.seo, googleSearchConsole: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Sitemap URL</label>
                  <input
                    type="url"
                    value={settings.seo.sitemapUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      seo: { ...settings.seo, sitemapUrl: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Безопасность */}
          {/* Расширенные настройки безопасности */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Безопасность и доступ</h3>
              
              {/* Двухфакторная аутентификация */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Двухфакторная аутентификация (2FA)</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Включить 2FA</div>
                      <div className="text-sm text-gray-600">Дополнительная защита аккаунтов</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuthSettings.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            twoFactorAuthSettings: { ...settings.security.twoFactorAuthSettings, enabled: e.target.checked }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.security.twoFactorAuthSettings.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Методы аутентификации</label>
                        <div className="grid grid-cols-3 gap-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.security.twoFactorAuthSettings.methods.includes("totp")}
                              onChange={(e) => {
                                const updatedMethods = e.target.checked
                                  ? [...settings.security.twoFactorAuthSettings.methods, "totp"]
                                  : settings.security.twoFactorAuthSettings.methods.filter(m => m !== "totp")
                                setSettings({
                                  ...settings,
                                  security: {
                                    ...settings.security,
                                    twoFactorAuthSettings: { ...settings.security.twoFactorAuthSettings, methods: updatedMethods }
                                  }
                                })
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">TOTP (Google Authenticator)</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.security.twoFactorAuthSettings.methods.includes("sms")}
                              onChange={(e) => {
                                const updatedMethods = e.target.checked
                                  ? [...settings.security.twoFactorAuthSettings.methods, "sms"]
                                  : settings.security.twoFactorAuthSettings.methods.filter(m => m !== "sms")
                                setSettings({
                                  ...settings,
                                  security: {
                                    ...settings.security,
                                    twoFactorAuthSettings: { ...settings.security.twoFactorAuthSettings, methods: updatedMethods }
                                  }
                                })
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">SMS</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.security.twoFactorAuthSettings.methods.includes("email")}
                              onChange={(e) => {
                                const updatedMethods = e.target.checked
                                  ? [...settings.security.twoFactorAuthSettings.methods, "email"]
                                  : settings.security.twoFactorAuthSettings.methods.filter(m => m !== "email")
                                setSettings({
                                  ...settings,
                                  security: {
                                    ...settings.security,
                                    twoFactorAuthSettings: { ...settings.security.twoFactorAuthSettings, methods: updatedMethods }
                                  }
                                })
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Email</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">SMS провайдер</label>
                          <select
                            value={settings.security.twoFactorAuthSettings.smsProvider}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                twoFactorAuthSettings: { ...settings.security.twoFactorAuthSettings, smsProvider: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          >
                            <option value="SMS.ru">SMS.ru</option>
                            <option value="SMSC.ru">SMSC.ru</option>
                            <option value="Twilio">Twilio</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">SMS API ключ</label>
                          <input
                            type="password"
                            value={settings.security.twoFactorAuthSettings.smsApiKey}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                twoFactorAuthSettings: { ...settings.security.twoFactorAuthSettings, smsApiKey: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите API ключ"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuthSettings.backupCodes}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              twoFactorAuthSettings: { ...settings.security.twoFactorAuthSettings, backupCodes: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Резервные коды для восстановления</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Политика паролей */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Политика паролей</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Минимальная длина пароля</label>
                        <input
                          type="number"
                          value={settings.security.passwordPolicy.minLength}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              passwordPolicy: { ...settings.security.passwordPolicy, minLength: parseInt(e.target.value) }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="6"
                          max="32"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Срок действия пароля (дни)</label>
                        <input
                          type="number"
                          value={settings.security.passwordPolicy.passwordExpiry}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              passwordPolicy: { ...settings.security.passwordPolicy, passwordExpiry: parseInt(e.target.value) }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="30"
                          max="365"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Требования к паролю</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.security.passwordPolicy.requireUppercase}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                passwordPolicy: { ...settings.security.passwordPolicy, requireUppercase: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Заглавные буквы</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.security.passwordPolicy.requireLowercase}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                passwordPolicy: { ...settings.security.passwordPolicy, requireLowercase: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Строчные буквы</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.security.passwordPolicy.requireNumbers}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                passwordPolicy: { ...settings.security.passwordPolicy, requireNumbers: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Цифры</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.security.passwordPolicy.requireSymbols}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                passwordPolicy: { ...settings.security.passwordPolicy, requireSymbols: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Символы</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Запрет повторного использования (последних паролей)</label>
                      <input
                        type="number"
                        value={settings.security.passwordPolicy.preventReuse}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordPolicy: { ...settings.security.passwordPolicy, preventReuse: parseInt(e.target.value) }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        min="0"
                        max="10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Контроль доступа */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Контроль доступа</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.accessControl.roleBasedAccess}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              accessControl: { ...settings.security.accessControl, roleBasedAccess: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Ролевая модель доступа</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.accessControl.ipRestriction}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              accessControl: { ...settings.security.accessControl, ipRestriction: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Ограничение по IP</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.accessControl.geoBlocking}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              accessControl: { ...settings.security.accessControl, geoBlocking: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Геоблокировка</span>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Разрешенные страны</label>
                        <input
                          type="text"
                          value={settings.security.accessControl.allowedCountries.join(", ")}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              accessControl: { ...settings.security.accessControl, allowedCountries: e.target.value.split(", ").filter(c => c.trim()) }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="RU, US, DE"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Заблокированные страны</label>
                        <input
                          type="text"
                          value={settings.security.accessControl.blockedCountries.join(", ")}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              accessControl: { ...settings.security.accessControl, blockedCountries: e.target.value.split(", ").filter(c => c.trim()) }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="CN, KP"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.accessControl.workingHours}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            accessControl: { ...settings.security.accessControl, workingHours: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Ограничение по рабочим часам</span>
                    </div>
                    
                    {settings.security.accessControl.workingHours && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Начало рабочего дня</label>
                          <input
                            type="time"
                            value={settings.security.accessControl.workingHoursStart}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                accessControl: { ...settings.security.accessControl, workingHoursStart: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Конец рабочего дня</label>
                          <input
                            type="time"
                            value={settings.security.accessControl.workingHoursEnd}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                accessControl: { ...settings.security.accessControl, workingHoursEnd: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Аудит и логирование */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Аудит и логирование</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить аудит</div>
                        <div className="text-sm text-gray-600">Отслеживание всех действий пользователей</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.auditLogging.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              auditLogging: { ...settings.security.auditLogging, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.security.auditLogging.enabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Уровень логирования</label>
                            <select
                              value={settings.security.auditLogging.logLevel}
                              onChange={(e) => setSettings({
                                ...settings,
                                security: {
                                  ...settings.security,
                                  auditLogging: { ...settings.security.auditLogging, logLevel: e.target.value }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            >
                              <option value="debug">Debug</option>
                              <option value="info">Info</option>
                              <option value="warn">Warning</option>
                              <option value="error">Error</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Хранение логов (дни)</label>
                            <input
                              type="number"
                              value={settings.security.auditLogging.retentionDays}
                              onChange={(e) => setSettings({
                                ...settings,
                                security: {
                                  ...settings.security,
                                  auditLogging: { ...settings.security.auditLogging, retentionDays: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="7"
                              max="365"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Типы событий для логирования</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.security.auditLogging.logUserActions}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  security: {
                                    ...settings.security,
                                    auditLogging: { ...settings.security.auditLogging, logUserActions: e.target.checked }
                                  }
                                })}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Действия пользователей</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.security.auditLogging.logSystemEvents}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  security: {
                                    ...settings.security,
                                    auditLogging: { ...settings.security.auditLogging, logSystemEvents: e.target.checked }
                                  }
                                })}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Системные события</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.security.auditLogging.logSecurityEvents}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  security: {
                                    ...settings.security,
                                    auditLogging: { ...settings.security.auditLogging, logSecurityEvents: e.target.checked }
                                  }
                                })}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">События безопасности</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Защита от брутфорса */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Защита от брутфорса</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить защиту</div>
                        <div className="text-sm text-gray-600">Автоматическая блокировка при множественных попытках входа</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.bruteForceProtection.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              bruteForceProtection: { ...settings.security.bruteForceProtection, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.security.bruteForceProtection.enabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Максимум попыток</label>
                            <input
                              type="number"
                              value={settings.security.bruteForceProtection.maxAttempts}
                              onChange={(e) => setSettings({
                                ...settings,
                                security: {
                                  ...settings.security,
                                  bruteForceProtection: { ...settings.security.bruteForceProtection, maxAttempts: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="3"
                              max="10"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Время блокировки (мин)</label>
                            <input
                              type="number"
                              value={settings.security.bruteForceProtection.lockoutDuration}
                              onChange={(e) => setSettings({
                                ...settings,
                                security: {
                                  ...settings.security,
                                  bruteForceProtection: { ...settings.security.bruteForceProtection, lockoutDuration: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="5"
                              max="60"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">CAPTCHA после попыток</label>
                            <input
                              type="number"
                              value={settings.security.bruteForceProtection.captchaAfterAttempts}
                              onChange={(e) => setSettings({
                                ...settings,
                                security: {
                                  ...settings.security,
                                  bruteForceProtection: { ...settings.security.bruteForceProtection, captchaAfterAttempts: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="1"
                              max="5"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.security.bruteForceProtection.progressiveDelay}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                bruteForceProtection: { ...settings.security.bruteForceProtection, progressiveDelay: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Прогрессивная задержка (увеличение времени блокировки)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SSL сертификаты */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">SSL сертификаты</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Автоматическое обновление</div>
                        <div className="text-sm text-gray-600">Автоматическое продление SSL сертификатов</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.sslCertificates.autoRenewal}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              sslCertificates: { ...settings.security.sslCertificates, autoRenewal: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Провайдер сертификатов</label>
                        <select
                          value={settings.security.sslCertificates.certificateProvider}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              sslCertificates: { ...settings.security.sslCertificates, certificateProvider: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="Let's Encrypt">Let&apos;s Encrypt</option>
                          <option value="Cloudflare">Cloudflare</option>
                          <option value="DigiCert">DigiCert</option>
                          <option value="Comodo">Comodo</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">API ключ</label>
                        <input
                          type="password"
                          value={settings.security.sslCertificates.apiKey}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              sslCertificates: { ...settings.security.sslCertificates, apiKey: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите API ключ"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Домены для сертификата</label>
                      <input
                        type="text"
                        value={settings.security.sslCertificates.domains.join(", ")}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            sslCertificates: { ...settings.security.sslCertificates, domains: e.target.value.split(", ").filter(d => d.trim()) }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        placeholder="metrika.ru, www.metrika.ru"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.sslCertificates.wildcardEnabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            sslCertificates: { ...settings.security.sslCertificates, wildcardEnabled: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Wildcard сертификат (*.metrika.ru)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Управление сессиями */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Управление сессиями</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Таймаут сессии (минуты)</label>
                        <input
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="5"
                          max="1440"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Одновременные сессии</label>
                        <input
                          type="number"
                          value={settings.security.sessionManagement.concurrentSessions}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              sessionManagement: { ...settings.security.sessionManagement, concurrentSessions: parseInt(e.target.value) }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Настройки cookies</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.security.sessionManagement.secureCookies}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                sessionManagement: { ...settings.security.sessionManagement, secureCookies: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Secure cookies</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.security.sessionManagement.httpOnlyCookies}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                sessionManagement: { ...settings.security.sessionManagement, httpOnlyCookies: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">HttpOnly cookies</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.security.sessionManagement.sessionRegeneration}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                sessionManagement: { ...settings.security.sessionManagement, sessionRegeneration: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Регенерация сессий</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">SameSite политика</label>
                      <select
                        value={settings.security.sessionManagement.sameSitePolicy}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            sessionManagement: { ...settings.security.sessionManagement, sameSitePolicy: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      >
                        <option value="strict">Strict</option>
                        <option value="lax">Lax</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Быстрые действия */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Быстрые действия</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex gap-4">
                    <button className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <Shield className="w-4 h-4 inline mr-2" />
                      Проверить безопасность
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Скачать отчет безопасности
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Обновить SSL сертификат
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Многоязычность и локализация */}
          {activeTab === 'localization' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Многоязычность и локализация</h3>
              
              {/* Основные настройки */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Основные настройки</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Включить многоязычность</div>
                      <div className="text-sm text-gray-600">Поддержка нескольких языков на сайте</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.localization.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          localization: { ...settings.localization, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.localization.enabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Язык по умолчанию</label>
                          <select
                            value={settings.localization.defaultLanguage}
                            onChange={(e) => setSettings({
                              ...settings,
                              localization: { ...settings.localization, defaultLanguage: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          >
                            <option value="ru">Русский</option>
                            <option value="en">English</option>
                            <option value="de">Deutsch</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="zh">中文</option>
                            <option value="ar">العربية</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Резервный язык</label>
                          <select
                            value={settings.localization.fallbackLanguage}
                            onChange={(e) => setSettings({
                              ...settings,
                              localization: { ...settings.localization, fallbackLanguage: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          >
                            <option value="ru">Русский</option>
                            <option value="en">English</option>
                            <option value="de">Deutsch</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="zh">中文</option>
                            <option value="ar">العربية</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Поддерживаемые языки</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {['ru', 'en', 'de', 'fr', 'es', 'zh', 'ar', 'he'].map(lang => (
                            <label key={lang} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.localization.supportedLanguages.includes(lang)}
                                onChange={(e) => {
                                  const updatedLanguages = e.target.checked
                                    ? [...settings.localization.supportedLanguages, lang]
                                    : settings.localization.supportedLanguages.filter(l => l !== lang)
                                  setSettings({
                                    ...settings,
                                    localization: { ...settings.localization, supportedLanguages: updatedLanguages }
                                  })
                                }}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">
                                {lang === 'ru' ? 'Русский' : 
                                 lang === 'en' ? 'English' :
                                 lang === 'de' ? 'Deutsch' :
                                 lang === 'fr' ? 'Français' :
                                 lang === 'es' ? 'Español' :
                                 lang === 'zh' ? '中文' :
                                 lang === 'ar' ? 'العربية' :
                                 lang === 'he' ? 'עברית' : lang}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.localization.autoDetectLanguage}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: { ...settings.localization, autoDetectLanguage: e.target.checked }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Автоматическое определение языка по браузеру</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Автоматический перевод */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Автоматический перевод</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить автоматический перевод</div>
                        <div className="text-sm text-gray-600">Перевод контента с помощью внешних сервисов</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.localization.translations.autoTranslation}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              translations: { ...settings.localization.translations, autoTranslation: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.localization.translations.autoTranslation && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Провайдер перевода</label>
                            <select
                              value={settings.localization.translations.translationProvider}
                              onChange={(e) => setSettings({
                                ...settings,
                                localization: {
                                  ...settings.localization,
                                  translations: { ...settings.localization.translations, translationProvider: e.target.value }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            >
                              <option value="Google Translate">Google Translate</option>
                              <option value="Yandex Translate">Yandex Translate</option>
                              <option value="Microsoft Translator">Microsoft Translator</option>
                              <option value="DeepL">DeepL</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">API ключ</label>
                            <input
                              type="password"
                              value={settings.localization.translations.apiKey}
                              onChange={(e) => setSettings({
                                ...settings,
                                localization: {
                                  ...settings.localization,
                                  translations: { ...settings.localization.translations, apiKey: e.target.value }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              placeholder="Введите API ключ"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.localization.translations.translateOnSave}
                              onChange={(e) => setSettings({
                                ...settings,
                                localization: {
                                  ...settings.localization,
                                  translations: { ...settings.localization.translations, translateOnSave: e.target.checked }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Переводить при сохранении</span>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.localization.translations.reviewRequired}
                              onChange={(e) => setSettings({
                                ...settings,
                                localization: {
                                  ...settings.localization,
                                  translations: { ...settings.localization.translations, reviewRequired: e.target.checked }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Требуется проверка переводов</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Региональные настройки */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Региональные настройки</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Формат даты</label>
                        <select
                          value={settings.localization.regionalSettings.dateFormat}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              regionalSettings: { ...settings.localization.regionalSettings, dateFormat: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="DD.MM.YYYY">DD.MM.YYYY (31.12.2023)</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Формат времени</label>
                        <select
                          value={settings.localization.regionalSettings.timeFormat}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              regionalSettings: { ...settings.localization.regionalSettings, timeFormat: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="HH:mm">24-часовой (14:30)</option>
                          <option value="hh:mm A">12-часовой (2:30 PM)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Формат чисел</label>
                        <select
                          value={settings.localization.regionalSettings.numberFormat}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              regionalSettings: { ...settings.localization.regionalSettings, numberFormat: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="ru-RU">Российский (1 234,56)</option>
                          <option value="en-US">Американский (1,234.56)</option>
                          <option value="de-DE">Немецкий (1.234,56)</option>
                          <option value="fr-FR">Французский (1 234,56)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Валюта</label>
                        <select
                          value={settings.localization.regionalSettings.currency}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              regionalSettings: { ...settings.localization.regionalSettings, currency: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="RUB">Российский рубль (₽)</option>
                          <option value="USD">Доллар США ($)</option>
                          <option value="EUR">Евро (€)</option>
                          <option value="GBP">Фунт стерлингов (£)</option>
                          <option value="CNY">Китайский юань (¥)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Часовой пояс</label>
                        <select
                          value={settings.localization.regionalSettings.timezone}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              regionalSettings: { ...settings.localization.regionalSettings, timezone: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="Europe/Moscow">Москва (UTC+3)</option>
                          <option value="Europe/London">Лондон (UTC+0)</option>
                          <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                          <option value="Asia/Shanghai">Шанхай (UTC+8)</option>
                          <option value="Asia/Dubai">Дубай (UTC+4)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Единицы измерения</label>
                        <select
                          value={settings.localization.regionalSettings.units}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              regionalSettings: { ...settings.localization.regionalSettings, units: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="metric">Метрическая система</option>
                          <option value="imperial">Имперская система</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO настройки */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">SEO для многоязычности</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.localization.seo.hreflangEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              seo: { ...settings.localization.seo, hreflangEnabled: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Включить hreflang теги</span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.localization.seo.canonicalUrls}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              seo: { ...settings.localization.seo, canonicalUrls: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Канонические URL</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Структура URL</label>
                      <select
                        value={settings.localization.seo.urlStructure}
                        onChange={(e) => setSettings({
                          ...settings,
                          localization: {
                            ...settings.localization,
                            seo: { ...settings.localization.seo, urlStructure: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      >
                        <option value="subdirectory">Подкаталоги (/ru/, /en/)</option>
                        <option value="subdomain">Поддомены (ru.site.com, en.site.com)</option>
                        <option value="parameter">Параметры (?lang=ru)</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.localization.seo.separateUrls}
                        onChange={(e) => setSettings({
                          ...settings,
                          localization: {
                            ...settings.localization,
                            seo: { ...settings.localization.seo, separateUrls: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Отдельные URL для каждого языка</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RTL поддержка */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">RTL поддержка</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить RTL поддержку</div>
                        <div className="text-sm text-gray-600">Поддержка языков с письмом справа налево</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.localization.rtlSupport.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              rtlSupport: { ...settings.localization.rtlSupport, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.localization.rtlSupport.enabled && (
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">RTL языки</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['ar', 'he', 'fa', 'ur', 'yi'].map(lang => (
                            <label key={lang} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.localization.rtlSupport.rtlLanguages.includes(lang)}
                                onChange={(e) => {
                                  const updatedRtlLanguages = e.target.checked
                                    ? [...settings.localization.rtlSupport.rtlLanguages, lang]
                                    : settings.localization.rtlSupport.rtlLanguages.filter(l => l !== lang)
                                  setSettings({
                                    ...settings,
                                    localization: {
                                      ...settings.localization,
                                      rtlSupport: { ...settings.localization.rtlSupport, rtlLanguages: updatedRtlLanguages }
                                    }
                                  })
                                }}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">
                                {lang === 'ar' ? 'العربية' :
                                 lang === 'he' ? 'עברית' :
                                 lang === 'fa' ? 'فارسی' :
                                 lang === 'ur' ? 'اردو' :
                                 lang === 'yi' ? 'ייִדיש' : lang}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Настройки админ панели */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Настройки админ панели</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Язык админ панели</label>
                        <select
                          value={settings.localization.adminPanel.adminLanguage}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              adminPanel: { ...settings.localization.adminPanel, adminLanguage: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="ru">Русский</option>
                          <option value="en">English</option>
                          <option value="de">Deutsch</option>
                          <option value="fr">Français</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.localization.adminPanel.translateInterface}
                          onChange={(e) => setSettings({
                            ...settings,
                            localization: {
                              ...settings.localization,
                              adminPanel: { ...settings.localization.adminPanel, translateInterface: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Переводить интерфейс админ панели</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Быстрые действия */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Быстрые действия</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex gap-4">
                    <button className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <Globe className="w-4 h-4 inline mr-2" />
                      Перевести весь сайт
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Экспорт переводов
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Обновить языковые файлы
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Система отчетов и аналитики */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Система отчетов и аналитики</h3>
              
              {/* Основные настройки */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Основные настройки</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Включить расширенную аналитику</div>
                      <div className="text-sm text-gray-600">Расширенные возможности отчетов и анализа</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.analytics.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          analytics: { ...settings.analytics, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Код отслеживания</label>
                    <input
                      type="text"
                      value={settings.analytics.trackingCode}
                      onChange={(e) => setSettings({
                        ...settings,
                        analytics: { ...settings.analytics, trackingCode: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      placeholder="GA-XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Кастомные отчеты */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Кастомные отчеты</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить кастомные отчеты</div>
                        <div className="text-sm text-gray-600">Создание собственных отчетов с любыми метриками</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics.customReports.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            analytics: {
                              ...settings.analytics,
                              customReports: { ...settings.analytics.customReports, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.analytics.customReports.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Максимум отчетов</label>
                          <input
                            type="number"
                            value={settings.analytics.customReports.maxReports}
                            onChange={(e) => setSettings({
                              ...settings,
                              analytics: {
                                ...settings.analytics,
                                customReports: { ...settings.analytics.customReports, maxReports: parseInt(e.target.value) }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            min="1"
                            max="100"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Хранение данных (дни)</label>
                          <input
                            type="number"
                            value={settings.analytics.customReports.retentionDays}
                            onChange={(e) => setSettings({
                              ...settings,
                              analytics: {
                                ...settings.analytics,
                                customReports: { ...settings.analytics.customReports, retentionDays: parseInt(e.target.value) }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            min="30"
                            max="1095"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Планировщик отчетов */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Планировщик отчетов</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Автоматическая отправка отчетов</div>
                        <div className="text-sm text-gray-600">Отправка отчетов по расписанию</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics.scheduledReports.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            analytics: {
                              ...settings.analytics,
                              scheduledReports: { ...settings.analytics.scheduledReports, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.analytics.scheduledReports.enabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Частота отправки</label>
                            <select
                              value={settings.analytics.scheduledReports.frequency}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  scheduledReports: { ...settings.analytics.scheduledReports, frequency: e.target.value }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            >
                              <option value="daily">Ежедневно</option>
                              <option value="weekly">Еженедельно</option>
                              <option value="monthly">Ежемесячно</option>
                              <option value="quarterly">Ежеквартально</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Получатели</label>
                            <input
                              type="text"
                              value={settings.analytics.scheduledReports.recipients.join(", ")}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  scheduledReports: { ...settings.analytics.scheduledReports, recipients: e.target.value.split(", ").filter(r => r.trim()) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              placeholder="admin@metrika.ru, manager@metrika.ru"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Форматы отчетов</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['pdf', 'excel', 'csv', 'json'].map(format => (
                              <label key={format} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.analytics.scheduledReports.formats.includes(format)}
                                  onChange={(e) => {
                                    const updatedFormats = e.target.checked
                                      ? [...settings.analytics.scheduledReports.formats, format]
                                      : settings.analytics.scheduledReports.formats.filter(f => f !== format)
                                    setSettings({
                                      ...settings,
                                      analytics: {
                                        ...settings.analytics,
                                        scheduledReports: { ...settings.analytics.scheduledReports, formats: updatedFormats }
                                      }
                                    })
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700 uppercase">{format}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Экспорт данных */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Экспорт данных</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить экспорт данных</div>
                        <div className="text-sm text-gray-600">Экспорт аналитических данных в различных форматах</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics.dataExport.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            analytics: {
                              ...settings.analytics,
                              dataExport: { ...settings.analytics.dataExport, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.analytics.dataExport.enabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Максимум записей</label>
                            <input
                              type="number"
                              value={settings.analytics.dataExport.maxRecords}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  dataExport: { ...settings.analytics.dataExport, maxRecords: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="1000"
                              max="1000000"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.analytics.dataExport.compressionEnabled}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  dataExport: { ...settings.analytics.dataExport, compressionEnabled: e.target.checked }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Сжатие файлов</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Доступные форматы</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['csv', 'excel', 'json', 'pdf'].map(format => (
                              <label key={format} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.analytics.dataExport.formats.includes(format)}
                                  onChange={(e) => {
                                    const updatedFormats = e.target.checked
                                      ? [...settings.analytics.dataExport.formats, format]
                                      : settings.analytics.dataExport.formats.filter(f => f !== format)
                                    setSettings({
                                      ...settings,
                                      analytics: {
                                        ...settings.analytics,
                                        dataExport: { ...settings.analytics.dataExport, formats: updatedFormats }
                                      }
                                    })
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700 uppercase">{format}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Сравнительная аналитика */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Сравнительная аналитика</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить сравнительный анализ</div>
                        <div className="text-sm text-gray-600">Сравнение периодов, сегментов и кампаний</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics.comparativeAnalysis.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            analytics: {
                              ...settings.analytics,
                              comparativeAnalysis: { ...settings.analytics.comparativeAnalysis, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.analytics.comparativeAnalysis.enabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Максимум периодов</label>
                            <input
                              type="number"
                              value={settings.analytics.comparativeAnalysis.maxPeriods}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  comparativeAnalysis: { ...settings.analytics.comparativeAnalysis, maxPeriods: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="2"
                              max="24"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.analytics.comparativeAnalysis.segmentComparison}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  comparativeAnalysis: { ...settings.analytics.comparativeAnalysis, segmentComparison: e.target.checked }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Сравнение сегментов</span>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.analytics.comparativeAnalysis.campaignComparison}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  comparativeAnalysis: { ...settings.analytics.comparativeAnalysis, campaignComparison: e.target.checked }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Сравнение кампаний</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Прогнозирование */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Прогнозирование</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить прогнозирование</div>
                        <div className="text-sm text-gray-600">Машинное обучение для предсказания трендов</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics.forecasting.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            analytics: {
                              ...settings.analytics,
                              forecasting: { ...settings.analytics.forecasting, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.analytics.forecasting.enabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Алгоритм</label>
                            <select
                              value={settings.analytics.forecasting.algorithm}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  forecasting: { ...settings.analytics.forecasting, algorithm: e.target.value }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            >
                              <option value="linear_regression">Линейная регрессия</option>
                              <option value="arima">ARIMA</option>
                              <option value="prophet">Prophet</option>
                              <option value="lstm">LSTM</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Дней прогноза</label>
                            <input
                              type="number"
                              value={settings.analytics.forecasting.predictionDays}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  forecasting: { ...settings.analytics.forecasting, predictionDays: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="7"
                              max="365"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Уровень доверия (%)</label>
                            <input
                              type="number"
                              value={settings.analytics.forecasting.confidenceLevel}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  forecasting: { ...settings.analytics.forecasting, confidenceLevel: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="80"
                              max="99"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* A/B тестирование */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">A/B тестирование</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить A/B тестирование</div>
                        <div className="text-sm text-gray-600">Статистически значимые эксперименты</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics.abTesting.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            analytics: {
                              ...settings.analytics,
                              abTesting: { ...settings.analytics.abTesting, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.analytics.abTesting.enabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Минимальный размер выборки</label>
                            <input
                              type="number"
                              value={settings.analytics.abTesting.minSampleSize}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  abTesting: { ...settings.analytics.abTesting, minSampleSize: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="100"
                              max="10000"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Уровень значимости (%)</label>
                            <input
                              type="number"
                              value={settings.analytics.abTesting.significanceLevel}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  abTesting: { ...settings.analytics.abTesting, significanceLevel: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="90"
                              max="99"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Максимум тестов</label>
                            <input
                              type="number"
                              value={settings.analytics.abTesting.maxTests}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  abTesting: { ...settings.analytics.abTesting, maxTests: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="1"
                              max="50"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Когортный анализ */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Когортный анализ</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить когортный анализ</div>
                        <div className="text-sm text-gray-600">Анализ поведения пользователей по группам</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics.cohortAnalysis.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            analytics: {
                              ...settings.analytics,
                              cohortAnalysis: { ...settings.analytics.cohortAnalysis, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.analytics.cohortAnalysis.enabled && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Периоды удержания (дни)</label>
                          <input
                            type="text"
                            value={settings.analytics.cohortAnalysis.retentionPeriods.join(", ")}
                            onChange={(e) => setSettings({
                              ...settings,
                              analytics: {
                                ...settings.analytics,
                                cohortAnalysis: { ...settings.analytics.cohortAnalysis, retentionPeriods: e.target.value.split(", ").map(p => parseInt(p.trim())).filter(p => !isNaN(p)) }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="1, 7, 14, 30, 90"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Типы когорт</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {['registration', 'first_purchase', 'subscription', 'newsletter', 'download'].map(type => (
                              <label key={type} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.analytics.cohortAnalysis.cohortTypes.includes(type)}
                                  onChange={(e) => {
                                    const updatedTypes = e.target.checked
                                      ? [...settings.analytics.cohortAnalysis.cohortTypes, type]
                                      : settings.analytics.cohortAnalysis.cohortTypes.filter(t => t !== type)
                                    setSettings({
                                      ...settings,
                                      analytics: {
                                        ...settings.analytics,
                                        cohortAnalysis: { ...settings.analytics.cohortAnalysis, cohortTypes: updatedTypes }
                                      }
                                    })
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700">
                                  {type === 'registration' ? 'Регистрация' :
                                   type === 'first_purchase' ? 'Первая покупка' :
                                   type === 'subscription' ? 'Подписка' :
                                   type === 'newsletter' ? 'Рассылка' :
                                   type === 'download' ? 'Скачивание' : type}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Дашборды */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Дашборды</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить дашборды</div>
                        <div className="text-sm text-gray-600">Настраиваемые панели мониторинга</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics.dashboards.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            analytics: {
                              ...settings.analytics,
                              dashboards: { ...settings.analytics.dashboards, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.analytics.dashboards.enabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Максимум дашбордов</label>
                            <input
                              type="number"
                              value={settings.analytics.dashboards.maxDashboards}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  dashboards: { ...settings.analytics.dashboards, maxDashboards: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="1"
                              max="50"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.analytics.dashboards.realTimeUpdates}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  dashboards: { ...settings.analytics.dashboards, realTimeUpdates: e.target.checked }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Обновления в реальном времени</span>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.analytics.dashboards.customWidgets}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  dashboards: { ...settings.analytics.dashboards, customWidgets: e.target.checked }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Пользовательские виджеты</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Алерты */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Алерты и уведомления</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить алерты</div>
                        <div className="text-sm text-gray-600">Уведомления при достижении пороговых значений</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics.alerts.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            analytics: {
                              ...settings.analytics,
                              alerts: { ...settings.analytics.alerts, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.analytics.alerts.enabled && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Пороговые значения</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Падение трафика (%)</label>
                              <input
                                type="number"
                                value={settings.analytics.alerts.thresholds.trafficDrop}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  analytics: {
                                    ...settings.analytics,
                                    alerts: {
                                      ...settings.analytics.alerts,
                                      thresholds: { ...settings.analytics.alerts.thresholds, trafficDrop: parseInt(e.target.value) }
                                    }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                                min="5"
                                max="50"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Падение конверсии (%)</label>
                              <input
                                type="number"
                                value={settings.analytics.alerts.thresholds.conversionDrop}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  analytics: {
                                    ...settings.analytics,
                                    alerts: {
                                      ...settings.analytics.alerts,
                                      thresholds: { ...settings.analytics.alerts.thresholds, conversionDrop: parseInt(e.target.value) }
                                    }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                                min="5"
                                max="50"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Процент ошибок (%)</label>
                              <input
                                type="number"
                                value={settings.analytics.alerts.thresholds.errorRate}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  analytics: {
                                    ...settings.analytics,
                                    alerts: {
                                      ...settings.analytics.alerts,
                                      thresholds: { ...settings.analytics.alerts.thresholds, errorRate: parseInt(e.target.value) }
                                    }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                                min="1"
                                max="20"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Время отклика (мс)</label>
                              <input
                                type="number"
                                value={settings.analytics.alerts.thresholds.responseTime}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  analytics: {
                                    ...settings.analytics,
                                    alerts: {
                                      ...settings.analytics.alerts,
                                      thresholds: { ...settings.analytics.alerts.thresholds, responseTime: parseInt(e.target.value) }
                                    }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                                min="1000"
                                max="10000"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Каналы уведомлений</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['email', 'slack', 'telegram', 'webhook'].map(channel => (
                              <label key={channel} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.analytics.alerts.notificationChannels.includes(channel)}
                                  onChange={(e) => {
                                    const updatedChannels = e.target.checked
                                      ? [...settings.analytics.alerts.notificationChannels, channel]
                                      : settings.analytics.alerts.notificationChannels.filter(c => c !== channel)
                                    setSettings({
                                      ...settings,
                                      analytics: {
                                        ...settings.analytics,
                                        alerts: { ...settings.analytics.alerts, notificationChannels: updatedChannels }
                                      }
                                    })
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700 capitalize">{channel}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Интеграция с BI */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Интеграция с BI системами</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить BI интеграцию</div>
                        <div className="text-sm text-gray-600">Подключение к Tableau, Power BI, Looker</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics.biIntegration.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            analytics: {
                              ...settings.analytics,
                              biIntegration: { ...settings.analytics.biIntegration, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.analytics.biIntegration.enabled && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">BI провайдеры</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {['Tableau', 'Power BI', 'Looker', 'QlikView', 'Sisense'].map(provider => (
                              <label key={provider} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.analytics.biIntegration.providers.includes(provider)}
                                  onChange={(e) => {
                                    const updatedProviders = e.target.checked
                                      ? [...settings.analytics.biIntegration.providers, provider]
                                      : settings.analytics.biIntegration.providers.filter(p => p !== provider)
                                    setSettings({
                                      ...settings,
                                      analytics: {
                                        ...settings.analytics,
                                        biIntegration: { ...settings.analytics.biIntegration, providers: updatedProviders }
                                      }
                                    })
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700">{provider}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* API доступ */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">API доступ к аналитике</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить API доступ</div>
                        <div className="text-sm text-gray-600">REST API для доступа к аналитическим данным</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics.apiAccess.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            analytics: {
                              ...settings.analytics,
                              apiAccess: { ...settings.analytics.apiAccess, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.analytics.apiAccess.enabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Лимит запросов (в час)</label>
                            <input
                              type="number"
                              value={settings.analytics.apiAccess.rateLimit}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  apiAccess: { ...settings.analytics.apiAccess, rateLimit: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="100"
                              max="10000"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Аутентификация</label>
                            <select
                              value={settings.analytics.apiAccess.authentication}
                              onChange={(e) => setSettings({
                                ...settings,
                                analytics: {
                                  ...settings.analytics,
                                  apiAccess: { ...settings.analytics.apiAccess, authentication: e.target.value }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            >
                              <option value="api_key">API ключ</option>
                              <option value="oauth2">OAuth 2.0</option>
                              <option value="jwt">JWT токен</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Доступные эндпоинты</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {['analytics', 'reports', 'users', 'events', 'segments', 'campaigns'].map(endpoint => (
                              <label key={endpoint} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.analytics.apiAccess.endpoints.includes(endpoint)}
                                  onChange={(e) => {
                                    const updatedEndpoints = e.target.checked
                                      ? [...settings.analytics.apiAccess.endpoints, endpoint]
                                      : settings.analytics.apiAccess.endpoints.filter(ep => ep !== endpoint)
                                    setSettings({
                                      ...settings,
                                      analytics: {
                                        ...settings.analytics,
                                        apiAccess: { ...settings.analytics.apiAccess, endpoints: updatedEndpoints }
                                      }
                                    })
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700 capitalize">{endpoint}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Быстрые действия */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Быстрые действия</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex gap-4">
                    <button className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <BarChart className="w-4 h-4 inline mr-2" />
                      Создать отчет
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Экспорт данных
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Обновить аналитику
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Почта */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Настройки почтовой системы</h3>
              
              {/* Основные настройки */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Основные настройки</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Включить почтовую систему</div>
                      <div className="text-sm text-gray-600">Активация почтового сервера на домене metrika.direct</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.email.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Домен почты</label>
                      <input
                        type="text"
                        value={settings.email.domain}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, domain: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        placeholder="metrika.direct"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Максимум ящиков</label>
                      <input
                        type="number"
                        value={settings.email.mailboxes.maxMailboxes}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: {
                            ...settings.email,
                            mailboxes: { ...settings.email.mailboxes, maxMailboxes: parseInt(e.target.value) }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        min="1"
                        max="1000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Хранение данных */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Хранение данных</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Провайдер хранения</label>
                      <select
                        value={settings.email.storage.provider}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: {
                            ...settings.email,
                            storage: { ...settings.email.storage, provider: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                      >
                        <option value="local">Локальное хранилище</option>
                        <option value="cloud">Облачное хранилище</option>
                        <option value="hybrid">Гибридное хранилище</option>
                      </select>
                    </div>
                    
                    {settings.email.storage.provider === 'local' && (
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Путь к локальному хранилищу</label>
                        <input
                          type="text"
                          value={settings.email.storage.localPath}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              storage: { ...settings.email.storage, localPath: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="/var/mail/metrika"
                        />
                      </div>
                    )}
                    
                    {settings.email.storage.provider === 'cloud' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Облачный провайдер</label>
                          <select
                            value={settings.email.storage.cloudProvider}
                            onChange={(e) => setSettings({
                              ...settings,
                              email: {
                                ...settings.email,
                                storage: { ...settings.email.storage, cloudProvider: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          >
                            <option value="aws">Amazon Web Services</option>
                            <option value="google">Google Cloud</option>
                            <option value="azure">Microsoft Azure</option>
                            <option value="yandex">Yandex Cloud</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Безопасность */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Безопасность</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.security.antiSpam}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              security: { ...settings.email.security, antiSpam: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Антиспам фильтры</span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.security.antiVirus}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              security: { ...settings.email.security, antiVirus: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Антивирусная проверка</span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.security.encryption}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              security: { ...settings.email.security, encryption: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Шифрование писем</span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.security.sslEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              security: { ...settings.email.security, sslEnabled: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">SSL/TLS соединение</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Уведомления */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Уведомления</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.notifications.browserNotifications}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              notifications: { ...settings.email.notifications, browserNotifications: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Браузерные уведомления</span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.notifications.soundNotifications}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              notifications: { ...settings.email.notifications, soundNotifications: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Звуковые сигналы</span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.notifications.visualIndicators}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              notifications: { ...settings.email.notifications, visualIndicators: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Визуальные индикаторы</span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.notifications.pushNotifications}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              notifications: { ...settings.email.notifications, pushNotifications: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Push уведомления</span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.notifications.internalNotifications}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              notifications: { ...settings.email.notifications, internalNotifications: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Внутренние уведомления</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Система блоков */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Система блоков</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить систему блоков</div>
                        <div className="text-sm text-gray-600">Категоризация писем по блокам</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.email.blocks.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              blocks: { ...settings.email.blocks, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.email.blocks.enabled && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Стандартные блоки</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {['Банки', 'Партнеры', 'Неизвестные', 'Документы', 'Важные', 'Спам'].map(block => (
                              <label key={block} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.email.blocks.defaultBlocks.includes(block)}
                                  onChange={(e) => {
                                    const updatedBlocks = e.target.checked
                                      ? [...settings.email.blocks.defaultBlocks, block]
                                      : settings.email.blocks.defaultBlocks.filter(b => b !== block)
                                    setSettings({
                                      ...settings,
                                      email: {
                                        ...settings.email,
                                        blocks: { ...settings.email.blocks, defaultBlocks: updatedBlocks }
                                      }
                                    })
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700">{block}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.email.blocks.customBlocks}
                              onChange={(e) => setSettings({
                                ...settings,
                                email: {
                                  ...settings.email,
                                  blocks: { ...settings.email.blocks, customBlocks: e.target.checked }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Пользовательские блоки</span>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.email.blocks.autoSorting}
                              onChange={(e) => setSettings({
                                ...settings,
                                email: {
                                  ...settings.email,
                                  blocks: { ...settings.email.blocks, autoSorting: e.target.checked }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Автоматическая сортировка</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Интеграция */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Интеграция</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.integration.imapEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              integration: { ...settings.email.integration, imapEnabled: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">IMAP протокол</span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.integration.smtpEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              integration: { ...settings.email.integration, smtpEnabled: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">SMTP протокол</span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.integration.pop3Enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              integration: { ...settings.email.integration, pop3Enabled: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">POP3 протокол</span>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email.integration.webmailEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              integration: { ...settings.email.integration, webmailEnabled: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Веб-интерфейс</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Резервное копирование */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Резервное копирование</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Включить резервное копирование</div>
                        <div className="text-sm text-gray-600">Автоматическое создание бэкапов почты</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.email.backup.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              backup: { ...settings.email.backup, enabled: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    {settings.email.backup.enabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Частота</label>
                            <select
                              value={settings.email.backup.frequency}
                              onChange={(e) => setSettings({
                                ...settings,
                                email: {
                                  ...settings.email,
                                  backup: { ...settings.email.backup, frequency: e.target.value }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            >
                              <option value="hourly">Каждый час</option>
                              <option value="daily">Ежедневно</option>
                              <option value="weekly">Еженедельно</option>
                              <option value="monthly">Ежемесячно</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Хранение (дни)</label>
                            <input
                              type="number"
                              value={settings.email.backup.retention}
                              onChange={(e) => setSettings({
                                ...settings,
                                email: {
                                  ...settings.email,
                                  backup: { ...settings.email.backup, retention: parseInt(e.target.value) }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="1"
                              max="365"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.email.backup.compression}
                              onChange={(e) => setSettings({
                                ...settings,
                                email: {
                                  ...settings.email,
                                  backup: { ...settings.email.backup, compression: e.target.checked }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Сжатие архивов</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Быстрые действия */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Быстрые действия</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex gap-4">
                    <button className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <Mail className="w-4 h-4 inline mr-2" />
                      Открыть почту
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <UserPlus className="w-4 h-4 inline mr-2" />
                      Создать ящик
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <Database className="w-4 h-4 inline mr-2" />
                      Резервная копия
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Интеграции */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Интеграции с внешними сервисами</h3>
              
              {/* CRM системы */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">CRM системы</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">amoCRM</div>
                      <div className="text-sm text-gray-600">Синхронизация контактов и сделок</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.crm.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          integrations: {
                            ...settings.integrations,
                            crm: { ...settings.integrations.crm, enabled: e.target.checked }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.integrations.crm.enabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">API ключ</label>
                          <input
                            type="password"
                            value={settings.integrations.crm.apiKey}
                            onChange={(e) => setSettings({
                              ...settings,
                              integrations: {
                                ...settings.integrations,
                                crm: { ...settings.integrations.crm, apiKey: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите API ключ"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">API URL</label>
                          <input
                            type="url"
                            value={settings.integrations.crm.apiUrl}
                            onChange={(e) => setSettings({
                              ...settings,
                              integrations: {
                                ...settings.integrations,
                                crm: { ...settings.integrations.crm, apiUrl: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="https://example.amocrm.ru"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.integrations.crm.syncContacts}
                            onChange={(e) => setSettings({
                              ...settings,
                              integrations: {
                                ...settings.integrations,
                                crm: { ...settings.integrations.crm, syncContacts: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Синхронизировать контакты</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.integrations.crm.syncDeals}
                            onChange={(e) => setSettings({
                              ...settings,
                              integrations: {
                                ...settings.integrations,
                                crm: { ...settings.integrations.crm, syncDeals: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Синхронизировать сделки</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Платежные системы */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Платежные системы</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">YooKassa</div>
                      <div className="text-sm text-gray-600">Прием платежей онлайн</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.payment.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          integrations: {
                            ...settings.integrations,
                            payment: { ...settings.integrations.payment, enabled: e.target.checked }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.integrations.payment.enabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">ID магазина</label>
                          <input
                            type="text"
                            value={settings.integrations.payment.merchantId}
                            onChange={(e) => setSettings({
                              ...settings,
                              integrations: {
                                ...settings.integrations,
                                payment: { ...settings.integrations.payment, merchantId: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите ID магазина"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Секретный ключ</label>
                          <input
                            type="password"
                            value={settings.integrations.payment.secretKey}
                            onChange={(e) => setSettings({
                              ...settings,
                              integrations: {
                                ...settings.integrations,
                                payment: { ...settings.integrations.payment, secretKey: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите секретный ключ"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.integrations.payment.testMode}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              payment: { ...settings.integrations.payment, testMode: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Тестовый режим</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Email сервисы */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Email сервисы</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">SMTP хост</label>
                        <input
                          type="text"
                          value={settings.integrations.email.smtpHost}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              email: { ...settings.integrations.email, smtpHost: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="smtp.gmail.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">SMTP порт</label>
                        <input
                          type="number"
                          value={settings.integrations.email.smtpPort}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              email: { ...settings.integrations.email, smtpPort: parseInt(e.target.value) }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="587"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Пользователь</label>
                        <input
                          type="text"
                          value={settings.integrations.email.smtpUser}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              email: { ...settings.integrations.email, smtpUser: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="user@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Пароль</label>
                        <input
                          type="password"
                          value={settings.integrations.email.smtpPassword}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              email: { ...settings.integrations.email, smtpPassword: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите пароль"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Email отправителя</label>
                        <input
                          type="email"
                          value={settings.integrations.email.fromEmail}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              email: { ...settings.integrations.email, fromEmail: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="noreply@metrika.ru"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Имя отправителя</label>
                        <input
                          type="text"
                          value={settings.integrations.email.fromName}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              email: { ...settings.integrations.email, fromName: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="МЕТРИКА"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Карты */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Картографические сервисы</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Провайдер</label>
                        <select
                          value={settings.integrations.maps.provider}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              maps: { ...settings.integrations.maps, provider: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="Yandex">Яндекс.Карты</option>
                          <option value="Google">Google Maps</option>
                          <option value="OpenStreetMap">OpenStreetMap</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">API ключ</label>
                        <input
                          type="text"
                          value={settings.integrations.maps.apiKey}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              maps: { ...settings.integrations.maps, apiKey: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите API ключ"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Масштаб по умолчанию</label>
                        <input
                          type="number"
                          value={settings.integrations.maps.defaultZoom}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              maps: { ...settings.integrations.maps, defaultZoom: parseInt(e.target.value) }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="1"
                          max="20"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Широта центра</label>
                        <input
                          type="number"
                          step="0.000001"
                          value={settings.integrations.maps.centerLat}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              maps: { ...settings.integrations.maps, centerLat: parseFloat(e.target.value) }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Долгота центра</label>
                        <input
                          type="number"
                          step="0.000001"
                          value={settings.integrations.maps.centerLng}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              maps: { ...settings.integrations.maps, centerLng: parseFloat(e.target.value) }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Социальные сети */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Социальные сети</h4>
                
                {/* Facebook */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Facebook</div>
                      <div className="text-sm text-gray-600">Интеграция с Facebook</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.social.facebook.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          integrations: {
                            ...settings.integrations,
                            social: {
                              ...settings.integrations.social,
                              facebook: { ...settings.integrations.social.facebook, enabled: e.target.checked }
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.integrations.social.facebook.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">App ID</label>
                        <input
                          type="text"
                          value={settings.integrations.social.facebook.appId}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              social: {
                                ...settings.integrations.social,
                                facebook: { ...settings.integrations.social.facebook, appId: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите App ID"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">App Secret</label>
                        <input
                          type="password"
                          value={settings.integrations.social.facebook.appSecret}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              social: {
                                ...settings.integrations.social,
                                facebook: { ...settings.integrations.social.facebook, appSecret: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите App Secret"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Instagram */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Instagram</div>
                      <div className="text-sm text-gray-600">Интеграция с Instagram</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.social.instagram.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          integrations: {
                            ...settings.integrations,
                            social: {
                              ...settings.integrations.social,
                              instagram: { ...settings.integrations.social.instagram, enabled: e.target.checked }
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.integrations.social.instagram.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Access Token</label>
                        <input
                          type="password"
                          value={settings.integrations.social.instagram.accessToken}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              social: {
                                ...settings.integrations.social,
                                instagram: { ...settings.integrations.social.instagram, accessToken: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите Access Token"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Business Account ID</label>
                        <input
                          type="text"
                          value={settings.integrations.social.instagram.businessAccountId}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              social: {
                                ...settings.integrations.social,
                                instagram: { ...settings.integrations.social.instagram, businessAccountId: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите Business Account ID"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Telegram */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Telegram</div>
                      <div className="text-sm text-gray-600">Интеграция с Telegram</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.social.telegram.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          integrations: {
                            ...settings.integrations,
                            social: {
                              ...settings.integrations.social,
                              telegram: { ...settings.integrations.social.telegram, enabled: e.target.checked }
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.integrations.social.telegram.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Bot Token</label>
                        <input
                          type="password"
                          value={settings.integrations.social.telegram.botToken}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              social: {
                                ...settings.integrations.social,
                                telegram: { ...settings.integrations.social.telegram, botToken: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите Bot Token"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Channel ID</label>
                        <input
                          type="text"
                          value={settings.integrations.social.telegram.channelId}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              social: {
                                ...settings.integrations.social,
                                telegram: { ...settings.integrations.social.telegram, channelId: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите Channel ID"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Аналитика */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Системы аналитики</h4>
                
                {/* Google Analytics */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Google Analytics</div>
                      <div className="text-sm text-gray-600">Отслеживание посетителей</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.analytics.googleAnalytics.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          integrations: {
                            ...settings.integrations,
                            analytics: {
                              ...settings.integrations.analytics,
                              googleAnalytics: { ...settings.integrations.analytics.googleAnalytics, enabled: e.target.checked }
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.integrations.analytics.googleAnalytics.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Tracking ID</label>
                        <input
                          type="text"
                          value={settings.integrations.analytics.googleAnalytics.trackingId}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              analytics: {
                                ...settings.integrations.analytics,
                                googleAnalytics: { ...settings.integrations.analytics.googleAnalytics, trackingId: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="GA-XXXXXXXXX"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.integrations.analytics.googleAnalytics.enhancedEcommerce}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              analytics: {
                                ...settings.integrations.analytics,
                                googleAnalytics: { ...settings.integrations.analytics.googleAnalytics, enhancedEcommerce: e.target.checked }
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Enhanced Ecommerce</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Яндекс.Метрика */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Яндекс.Метрика</div>
                      <div className="text-sm text-gray-600">Российская система аналитики</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.analytics.yandexMetrika.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          integrations: {
                            ...settings.integrations,
                            analytics: {
                              ...settings.integrations.analytics,
                              yandexMetrika: { ...settings.integrations.analytics.yandexMetrika, enabled: e.target.checked }
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.integrations.analytics.yandexMetrika.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Counter ID</label>
                        <input
                          type="text"
                          value={settings.integrations.analytics.yandexMetrika.counterId}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              analytics: {
                                ...settings.integrations.analytics,
                                yandexMetrika: { ...settings.integrations.analytics.yandexMetrika, counterId: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="XXXXXXXXX"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.integrations.analytics.yandexMetrika.webvisor}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              analytics: {
                                ...settings.integrations.analytics,
                                yandexMetrika: { ...settings.integrations.analytics.yandexMetrika, webvisor: e.target.checked }
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Вебвизор</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Facebook Pixel */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Facebook Pixel</div>
                      <div className="text-sm text-gray-600">Отслеживание конверсий Facebook</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.analytics.facebookPixel.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          integrations: {
                            ...settings.integrations,
                            analytics: {
                              ...settings.integrations.analytics,
                              facebookPixel: { ...settings.integrations.analytics.facebookPixel, enabled: e.target.checked }
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.integrations.analytics.facebookPixel.enabled && (
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Pixel ID</label>
                      <input
                        type="text"
                        value={settings.integrations.analytics.facebookPixel.pixelId}
                        onChange={(e) => setSettings({
                          ...settings,
                          integrations: {
                            ...settings.integrations,
                            analytics: {
                              ...settings.integrations.analytics,
                              facebookPixel: { ...settings.integrations.analytics.facebookPixel, pixelId: e.target.value }
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        placeholder="Введите Pixel ID"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Чат-боты */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Чат-боты и поддержка</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Jivosite</div>
                      <div className="text-sm text-gray-600">Онлайн чат для сайта</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.chat.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          integrations: {
                            ...settings.integrations,
                            chat: { ...settings.integrations.chat, enabled: e.target.checked }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.integrations.chat.enabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Widget ID</label>
                          <input
                            type="text"
                            value={settings.integrations.chat.widgetId}
                            onChange={(e) => setSettings({
                              ...settings,
                              integrations: {
                                ...settings.integrations,
                                chat: { ...settings.integrations.chat, widgetId: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите Widget ID"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">API ключ</label>
                          <input
                            type="password"
                            value={settings.integrations.chat.apiKey}
                            onChange={(e) => setSettings({
                              ...settings,
                              integrations: {
                                ...settings.integrations,
                                chat: { ...settings.integrations.chat, apiKey: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите API ключ"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Часы работы</label>
                          <input
                            type="text"
                            value={settings.integrations.chat.workingHours}
                            onChange={(e) => setSettings({
                              ...settings,
                              integrations: {
                                ...settings.integrations,
                                chat: { ...settings.integrations.chat, workingHours: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Пн-Пт: 9:00-18:00"
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.integrations.chat.autoGreeting}
                            onChange={(e) => setSettings({
                              ...settings,
                              integrations: {
                                ...settings.integrations,
                                chat: { ...settings.integrations.chat, autoGreeting: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Автоматическое приветствие</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Система уведомлений */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Система уведомлений</h3>
              
              {/* Общие настройки */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Общие настройки</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Email администратора</label>
                        <input
                          type="email"
                          value={settings.notifications.adminEmail}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, adminEmail: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="admin@metrika.ru"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Телефон администратора</label>
                        <input
                          type="tel"
                          value={settings.notifications.adminPhone}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, adminPhone: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="+7 (495) 123-45-67"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Типы уведомлений</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['new_user', 'new_application', 'system_alert', 'password_reset', 'welcome'].map(type => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.notifications.notificationTypes.includes(type)}
                              onChange={(e) => {
                                const updatedTypes = e.target.checked
                                  ? [...settings.notifications.notificationTypes, type]
                                  : settings.notifications.notificationTypes.filter(t => t !== type)
                                setSettings({
                                  ...settings,
                                  notifications: { ...settings.notifications, notificationTypes: updatedTypes }
                                })
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">
                              {type === 'new_user' && 'Новые пользователи'}
                              {type === 'new_application' && 'Новые заявки'}
                              {type === 'system_alert' && 'Системные алерты'}
                              {type === 'password_reset' && 'Сброс пароля'}
                              {type === 'welcome' && 'Приветствие'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email уведомления */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Email уведомления</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Email уведомления</div>
                      <div className="text-sm text-gray-600">Отправка уведомлений по электронной почте</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.notifications.emailNotifications && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Шаблон: Новый пользователь</label>
                        <textarea
                          value={settings.notifications.emailTemplates.newUser}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              emailTemplates: { ...settings.notifications.emailTemplates, newUser: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white h-20"
                          placeholder="Добро пожаловать! Ваш аккаунт создан успешно."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Шаблон: Новая заявка</label>
                        <textarea
                          value={settings.notifications.emailTemplates.newApplication}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              emailTemplates: { ...settings.notifications.emailTemplates, newApplication: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white h-20"
                          placeholder="Новая заявка от клиента: {{client_name}}"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Шаблон: Системный алерт</label>
                        <textarea
                          value={settings.notifications.emailTemplates.systemAlert}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              emailTemplates: { ...settings.notifications.emailTemplates, systemAlert: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white h-20"
                          placeholder="Системное уведомление: {{message}}"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Шаблон: Сброс пароля</label>
                        <textarea
                          value={settings.notifications.emailTemplates.passwordReset}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              emailTemplates: { ...settings.notifications.emailTemplates, passwordReset: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white h-20"
                          placeholder="Ссылка для сброса пароля: {{reset_link}}"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Шаблон: Приветствие</label>
                        <textarea
                          value={settings.notifications.emailTemplates.welcome}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              emailTemplates: { ...settings.notifications.emailTemplates, welcome: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white h-20"
                          placeholder="Добро пожаловать в МЕТРИКА! Спасибо за регистрацию."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SMS уведомления */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">SMS уведомления</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">SMS уведомления</div>
                      <div className="text-sm text-gray-600">Отправка SMS сообщений</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, smsNotifications: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.notifications.smsNotifications && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Провайдер</label>
                          <select
                            value={settings.notifications.smsSettings.provider}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                smsSettings: { ...settings.notifications.smsSettings, provider: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          >
                            <option value="SMS.ru">SMS.ru</option>
                            <option value="SMSC.ru">SMSC.ru</option>
                            <option value="Twilio">Twilio</option>
                            <option value="Smsc">Smsc</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">API ключ</label>
                          <input
                            type="password"
                            value={settings.notifications.smsSettings.apiKey}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                smsSettings: { ...settings.notifications.smsSettings, apiKey: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите API ключ"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Имя отправителя</label>
                          <input
                            type="text"
                            value={settings.notifications.smsSettings.senderName}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                smsSettings: { ...settings.notifications.smsSettings, senderName: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="METRIKA"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Шаблон: Подтверждение</label>
                          <input
                            type="text"
                            value={settings.notifications.smsSettings.templates.verification}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                smsSettings: {
                                  ...settings.notifications.smsSettings,
                                  templates: { ...settings.notifications.smsSettings.templates, verification: e.target.value }
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Код подтверждения: {{code}}"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Шаблон: Напоминание</label>
                          <input
                            type="text"
                            value={settings.notifications.smsSettings.templates.reminder}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                smsSettings: {
                                  ...settings.notifications.smsSettings,
                                  templates: { ...settings.notifications.smsSettings.templates, reminder: e.target.value }
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Напоминание: {{message}}"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Шаблон: Алерт</label>
                          <input
                            type="text"
                            value={settings.notifications.smsSettings.templates.alert}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                smsSettings: {
                                  ...settings.notifications.smsSettings,
                                  templates: { ...settings.notifications.smsSettings.templates, alert: e.target.value }
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Важное уведомление: {{message}}"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Push уведомления */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Push уведомления</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Push уведомления</div>
                      <div className="text-sm text-gray-600">Браузерные push уведомления</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, pushNotifications: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.notifications.pushNotifications && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">VAPID Public Key</label>
                          <input
                            type="text"
                            value={settings.notifications.pushSettings.vapidPublicKey}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                pushSettings: { ...settings.notifications.pushSettings, vapidPublicKey: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите VAPID Public Key"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">VAPID Private Key</label>
                          <input
                            type="password"
                            value={settings.notifications.pushSettings.vapidPrivateKey}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                pushSettings: { ...settings.notifications.pushSettings, vapidPrivateKey: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите VAPID Private Key"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Server Key (FCM)</label>
                        <input
                          type="password"
                          value={settings.notifications.pushSettings.serverKey}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              pushSettings: { ...settings.notifications.pushSettings, serverKey: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите Server Key"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Webhook уведомления */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Webhook уведомления</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Webhook уведомления</div>
                      <div className="text-sm text-gray-600">Отправка данных на внешние сервисы</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.webhookNotifications}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, webhookNotifications: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.notifications.webhookNotifications && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Webhook URL</label>
                          <input
                            type="url"
                            value={settings.notifications.webhookSettings.url}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                webhookSettings: { ...settings.notifications.webhookSettings, url: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="https://example.com/webhook"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Секретный ключ</label>
                          <input
                            type="password"
                            value={settings.notifications.webhookSettings.secret}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                webhookSettings: { ...settings.notifications.webhookSettings, secret: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите секретный ключ"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">События для отправки</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['user_registered', 'application_created', 'system_error', 'payment_received', 'task_completed'].map(event => (
                            <label key={event} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.notifications.webhookSettings.events.includes(event)}
                                onChange={(e) => {
                                  const updatedEvents = e.target.checked
                                    ? [...settings.notifications.webhookSettings.events, event]
                                    : settings.notifications.webhookSettings.events.filter(ev => ev !== event)
                                  setSettings({
                                    ...settings,
                                    notifications: {
                                      ...settings.notifications,
                                      webhookSettings: { ...settings.notifications.webhookSettings, events: updatedEvents }
                                    }
                                  })
                                }}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">
                                {event === 'user_registered' && 'Регистрация пользователя'}
                                {event === 'application_created' && 'Создание заявки'}
                                {event === 'system_error' && 'Системная ошибка'}
                                {event === 'payment_received' && 'Получение платежа'}
                                {event === 'task_completed' && 'Завершение задачи'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Количество попыток повтора</label>
                        <input
                          type="number"
                          value={settings.notifications.webhookSettings.retryAttempts}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              webhookSettings: { ...settings.notifications.webhookSettings, retryAttempts: parseInt(e.target.value) }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Расписание уведомлений */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Расписание уведомлений</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Рабочие часы</label>
                        <input
                          type="text"
                          value={settings.notifications.scheduleSettings.workingHours}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              scheduleSettings: { ...settings.notifications.scheduleSettings, workingHours: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Пн-Пт: 9:00-18:00"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Часовой пояс</label>
                        <select
                          value={settings.notifications.scheduleSettings.timezone}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              scheduleSettings: { ...settings.notifications.scheduleSettings, timezone: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="Europe/Moscow">Москва (UTC+3)</option>
                          <option value="Europe/London">Лондон (UTC+0)</option>
                          <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.scheduleSettings.weekendNotifications}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              scheduleSettings: { ...settings.notifications.scheduleSettings, weekendNotifications: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Уведомления в выходные</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.scheduleSettings.holidayNotifications}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              scheduleSettings: { ...settings.notifications.scheduleSettings, holidayNotifications: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Уведомления в праздники</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Система резервного копирования */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Система резервного копирования</h3>
              
              {/* Общие настройки */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Общие настройки</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Автоматическое резервное копирование</div>
                        <div className="text-sm text-gray-600">Включить автоматическое создание резервных копий</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.backup.autoBackup}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: { ...settings.backup, autoBackup: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Частота копирования</label>
                        <select
                          value={settings.backup.backupFrequency}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: { ...settings.backup, backupFrequency: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="hourly">Каждый час</option>
                          <option value="daily">Ежедневно</option>
                          <option value="weekly">Еженедельно</option>
                          <option value="monthly">Ежемесячно</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Хранение (дни)</label>
                        <input
                          type="number"
                          value={settings.backup.backupRetention}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: { ...settings.backup, backupRetention: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="1"
                          max="365"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Последняя копия</label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
                          {settings.backup.lastBackup}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Провайдеры хранения */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Провайдеры хранения</h4>
                
                {/* Локальное хранение */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Локальное хранение</div>
                      <div className="text-sm text-gray-600">Сохранение на локальном сервере</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.backup.storageProviders.local.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            storageProviders: {
                              ...settings.backup.storageProviders,
                              local: { ...settings.backup.storageProviders.local, enabled: e.target.checked }
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.backup.storageProviders.local.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Путь к папке</label>
                        <input
                          type="text"
                          value={settings.backup.storageProviders.local.path}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              storageProviders: {
                                ...settings.backup.storageProviders,
                                local: { ...settings.backup.storageProviders.local, path: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="/var/backups/metrika"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Максимальный размер (MB)</label>
                        <input
                          type="number"
                          value={settings.backup.storageProviders.local.maxSize}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              storageProviders: {
                                ...settings.backup.storageProviders,
                                local: { ...settings.backup.storageProviders.local, maxSize: parseInt(e.target.value) }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="100"
                          max="100000"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Облачное хранение */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Облачное хранение</div>
                      <div className="text-sm text-gray-600">Сохранение в облачных сервисах</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.backup.storageProviders.cloud.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            storageProviders: {
                              ...settings.backup.storageProviders,
                              cloud: { ...settings.backup.storageProviders.cloud, enabled: e.target.checked }
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.backup.storageProviders.cloud.enabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Провайдер</label>
                          <select
                            value={settings.backup.storageProviders.cloud.provider}
                            onChange={(e) => setSettings({
                              ...settings,
                              backup: {
                                ...settings.backup,
                                storageProviders: {
                                  ...settings.backup.storageProviders,
                                  cloud: { ...settings.backup.storageProviders.cloud, provider: e.target.value }
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          >
                            <option value="AWS S3">AWS S3</option>
                            <option value="Google Cloud Storage">Google Cloud Storage</option>
                            <option value="Azure Blob Storage">Azure Blob Storage</option>
                            <option value="Yandex Object Storage">Yandex Object Storage</option>
                            <option value="Dropbox">Dropbox</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Bucket/Container</label>
                          <input
                            type="text"
                            value={settings.backup.storageProviders.cloud.bucket}
                            onChange={(e) => setSettings({
                              ...settings,
                              backup: {
                                ...settings.backup,
                                storageProviders: {
                                  ...settings.backup.storageProviders,
                                  cloud: { ...settings.backup.storageProviders.cloud, bucket: e.target.value }
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="metrika-backups"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Регион</label>
                          <input
                            type="text"
                            value={settings.backup.storageProviders.cloud.region}
                            onChange={(e) => setSettings({
                              ...settings,
                              backup: {
                                ...settings.backup,
                                storageProviders: {
                                  ...settings.backup.storageProviders,
                                  cloud: { ...settings.backup.storageProviders.cloud, region: e.target.value }
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="eu-west-1"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Access Key</label>
                          <input
                            type="password"
                            value={settings.backup.storageProviders.cloud.accessKey}
                            onChange={(e) => setSettings({
                              ...settings,
                              backup: {
                                ...settings.backup,
                                storageProviders: {
                                  ...settings.backup.storageProviders,
                                  cloud: { ...settings.backup.storageProviders.cloud, accessKey: e.target.value }
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите Access Key"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Secret Key</label>
                        <input
                          type="password"
                          value={settings.backup.storageProviders.cloud.secretKey}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              storageProviders: {
                                ...settings.backup.storageProviders,
                                cloud: { ...settings.backup.storageProviders.cloud, secretKey: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите Secret Key"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* FTP хранение */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">FTP хранение</div>
                      <div className="text-sm text-gray-600">Сохранение на FTP сервер</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.backup.storageProviders.ftp.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            storageProviders: {
                              ...settings.backup.storageProviders,
                              ftp: { ...settings.backup.storageProviders.ftp, enabled: e.target.checked }
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.backup.storageProviders.ftp.enabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">FTP хост</label>
                          <input
                            type="text"
                            value={settings.backup.storageProviders.ftp.host}
                            onChange={(e) => setSettings({
                              ...settings,
                              backup: {
                                ...settings.backup,
                                storageProviders: {
                                  ...settings.backup.storageProviders,
                                  ftp: { ...settings.backup.storageProviders.ftp, host: e.target.value }
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="ftp.example.com"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Порт</label>
                          <input
                            type="number"
                            value={settings.backup.storageProviders.ftp.port}
                            onChange={(e) => setSettings({
                              ...settings,
                              backup: {
                                ...settings.backup,
                                storageProviders: {
                                  ...settings.backup.storageProviders,
                                  ftp: { ...settings.backup.storageProviders.ftp, port: parseInt(e.target.value) }
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            min="1"
                            max="65535"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Имя пользователя</label>
                          <input
                            type="text"
                            value={settings.backup.storageProviders.ftp.username}
                            onChange={(e) => setSettings({
                              ...settings,
                              backup: {
                                ...settings.backup,
                                storageProviders: {
                                  ...settings.backup.storageProviders,
                                  ftp: { ...settings.backup.storageProviders.ftp, username: e.target.value }
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="ftp_user"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Пароль</label>
                          <input
                            type="password"
                            value={settings.backup.storageProviders.ftp.password}
                            onChange={(e) => setSettings({
                              ...settings,
                              backup: {
                                ...settings.backup,
                                storageProviders: {
                                  ...settings.backup.storageProviders,
                                  ftp: { ...settings.backup.storageProviders.ftp, password: e.target.value }
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                            placeholder="Введите пароль"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Путь на сервере</label>
                        <input
                          type="text"
                          value={settings.backup.storageProviders.ftp.path}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              storageProviders: {
                                ...settings.backup.storageProviders,
                                ftp: { ...settings.backup.storageProviders.ftp, path: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="/backups"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Email хранение */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Email хранение</div>
                      <div className="text-sm text-gray-600">Отправка резервных копий по email</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.backup.storageProviders.email.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            storageProviders: {
                              ...settings.backup.storageProviders,
                              email: { ...settings.backup.storageProviders.email, enabled: e.target.checked }
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.backup.storageProviders.email.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Email адрес</label>
                        <input
                          type="email"
                          value={settings.backup.storageProviders.email.email}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              storageProviders: {
                                ...settings.backup.storageProviders,
                                email: { ...settings.backup.storageProviders.email, email: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="backup@metrika.ru"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Максимальный размер (MB)</label>
                        <input
                          type="number"
                          value={settings.backup.storageProviders.email.maxSize}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              storageProviders: {
                                ...settings.backup.storageProviders,
                                email: { ...settings.backup.storageProviders.email, maxSize: parseInt(e.target.value) }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="1"
                          max="100"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Типы резервного копирования */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Типы резервного копирования</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.backup.backupTypes.database}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            backupTypes: { ...settings.backup.backupTypes, database: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">База данных</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.backup.backupTypes.files}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            backupTypes: { ...settings.backup.backupTypes, files: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Файлы системы</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.backup.backupTypes.media}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            backupTypes: { ...settings.backup.backupTypes, media: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Медиафайлы</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.backup.backupTypes.config}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            backupTypes: { ...settings.backup.backupTypes, config: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Конфигурация</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.backup.backupTypes.logs}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            backupTypes: { ...settings.backup.backupTypes, logs: e.target.checked }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Логи системы</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Сжатие и шифрование */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Сжатие и шифрование</h4>
                
                {/* Сжатие */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Сжатие файлов</div>
                      <div className="text-sm text-gray-600">Сжатие резервных копий для экономии места</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.backup.compression.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            compression: { ...settings.backup.compression, enabled: e.target.checked }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.backup.compression.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Алгоритм сжатия</label>
                        <select
                          value={settings.backup.compression.algorithm}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              compression: { ...settings.backup.compression, algorithm: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="gzip">GZIP</option>
                          <option value="bzip2">BZIP2</option>
                          <option value="xz">XZ</option>
                          <option value="zip">ZIP</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Уровень сжатия</label>
                        <input
                          type="range"
                          min="1"
                          max="9"
                          value={settings.backup.compression.level}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              compression: { ...settings.backup.compression, level: parseInt(e.target.value) }
                            }
                          })}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-600 text-center">{settings.backup.compression.level}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Шифрование */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Шифрование файлов</div>
                      <div className="text-sm text-gray-600">Шифрование резервных копий для безопасности</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.backup.encryption.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            encryption: { ...settings.backup.encryption, enabled: e.target.checked }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.backup.encryption.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Пароль шифрования</label>
                        <input
                          type="password"
                          value={settings.backup.encryption.password}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              encryption: { ...settings.backup.encryption, password: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="Введите пароль"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Алгоритм шифрования</label>
                        <select
                          value={settings.backup.encryption.algorithm}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              encryption: { ...settings.backup.encryption, algorithm: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="AES-256">AES-256</option>
                          <option value="AES-128">AES-128</option>
                          <option value="Blowfish">Blowfish</option>
                          <option value="3DES">3DES</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Расписание */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Расписание резервного копирования</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Время запуска</label>
                        <input
                          type="time"
                          value={settings.backup.schedule.time}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              schedule: { ...settings.backup.schedule, time: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Часовой пояс</label>
                        <select
                          value={settings.backup.schedule.timezone}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              schedule: { ...settings.backup.schedule, timezone: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="Europe/Moscow">Москва (UTC+3)</option>
                          <option value="Europe/London">Лондон (UTC+0)</option>
                          <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Дни недели</label>
                      <div className="grid grid-cols-7 gap-2">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                          <label key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.backup.schedule.weekdays.includes(day)}
                              onChange={(e) => {
                                const updatedWeekdays = e.target.checked
                                  ? [...settings.backup.schedule.weekdays, day]
                                  : settings.backup.schedule.weekdays.filter(d => d !== day)
                                setSettings({
                                  ...settings,
                                  backup: {
                                    ...settings.backup,
                                    schedule: { ...settings.backup.schedule, weekdays: updatedWeekdays }
                                  }
                                })
                              }}
                              className="mr-1"
                            />
                            <span className="text-xs text-gray-700">
                              {day === 'monday' && 'Пн'}
                              {day === 'tuesday' && 'Вт'}
                              {day === 'wednesday' && 'Ср'}
                              {day === 'thursday' && 'Чт'}
                              {day === 'friday' && 'Пт'}
                              {day === 'saturday' && 'Сб'}
                              {day === 'sunday' && 'Вс'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Уведомления */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Уведомления о резервном копировании</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.backup.notifications.success}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              notifications: { ...settings.backup.notifications, success: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Уведомления об успешном копировании</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.backup.notifications.failure}
                          onChange={(e) => setSettings({
                            ...settings,
                            backup: {
                              ...settings.backup,
                              notifications: { ...settings.backup.notifications, failure: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Уведомления об ошибках</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Email для уведомлений</label>
                      <input
                        type="email"
                        value={settings.backup.notifications.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          backup: {
                            ...settings.backup,
                            notifications: { ...settings.backup.notifications, email: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        placeholder="admin@metrika.ru"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Быстрые действия */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Быстрые действия</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex gap-4">
                    <button className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <Database className="w-4 h-4 inline mr-2" />
                      Создать резервную копию
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Проверить статус
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <Download className="w-4 h-4 inline mr-2" />
                      Скачать последнюю копию
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Система мониторинга производительности */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Мониторинг производительности и оптимизация</h3>
              
              {/* Общие настройки производительности */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Общие настройки производительности</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Кэширование</div>
                        <div className="text-sm text-gray-600">Включить кэширование для ускорения загрузки</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.performance.enableCaching}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: { ...settings.performance, enableCaching: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Время жизни кэша (сек)</label>
                        <input
                          type="number"
                          value={settings.performance.cacheExpiry}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: { ...settings.performance, cacheExpiry: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="60"
                          max="86400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">CDN URL</label>
                        <input
                          type="url"
                          value={settings.performance.cdnUrl}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: { ...settings.performance, cdnUrl: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="https://cdn.metrika.ru"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.performance.cdnEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: { ...settings.performance, cdnEnabled: e.target.checked }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Использовать CDN</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Мониторинг */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Система мониторинга</h4>
                
                {/* Общие настройки мониторинга */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-black">Мониторинг производительности</div>
                      <div className="text-sm text-gray-600">Отслеживание метрик в реальном времени</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.performance.monitoring.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            monitoring: { ...settings.performance.monitoring, enabled: e.target.checked }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                  
                  {settings.performance.monitoring.enabled && (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.performance.monitoring.realTimeMonitoring}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              monitoring: { ...settings.performance.monitoring, realTimeMonitoring: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Мониторинг в реальном времени</span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Пороги предупреждений</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Время отклика (мс)</label>
                            <input
                              type="number"
                              value={settings.performance.monitoring.alertThresholds.responseTime}
                              onChange={(e) => setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  monitoring: {
                                    ...settings.performance.monitoring,
                                    alertThresholds: {
                                      ...settings.performance.monitoring.alertThresholds,
                                      responseTime: parseInt(e.target.value)
                                    }
                                  }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="100"
                              max="10000"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Использование CPU (%)</label>
                            <input
                              type="number"
                              value={settings.performance.monitoring.alertThresholds.cpuUsage}
                              onChange={(e) => setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  monitoring: {
                                    ...settings.performance.monitoring,
                                    alertThresholds: {
                                      ...settings.performance.monitoring.alertThresholds,
                                      cpuUsage: parseInt(e.target.value)
                                    }
                                  }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="10"
                              max="100"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Использование памяти (%)</label>
                            <input
                              type="number"
                              value={settings.performance.monitoring.alertThresholds.memoryUsage}
                              onChange={(e) => setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  monitoring: {
                                    ...settings.performance.monitoring,
                                    alertThresholds: {
                                      ...settings.performance.monitoring.alertThresholds,
                                      memoryUsage: parseInt(e.target.value)
                                    }
                                  }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="10"
                              max="100"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Использование диска (%)</label>
                            <input
                              type="number"
                              value={settings.performance.monitoring.alertThresholds.diskUsage}
                              onChange={(e) => setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  monitoring: {
                                    ...settings.performance.monitoring,
                                    alertThresholds: {
                                      ...settings.performance.monitoring.alertThresholds,
                                      diskUsage: parseInt(e.target.value)
                                    }
                                  }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="10"
                              max="100"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Процент ошибок (%)</label>
                            <input
                              type="number"
                              value={settings.performance.monitoring.alertThresholds.errorRate}
                              onChange={(e) => setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  monitoring: {
                                    ...settings.performance.monitoring,
                                    alertThresholds: {
                                      ...settings.performance.monitoring.alertThresholds,
                                      errorRate: parseInt(e.target.value)
                                    }
                                  }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                              min="1"
                              max="50"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Отслеживаемые метрики</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.performance.monitoring.metrics.pageLoadTime}
                              onChange={(e) => setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  monitoring: {
                                    ...settings.performance.monitoring,
                                    metrics: { ...settings.performance.monitoring.metrics, pageLoadTime: e.target.checked }
                                  }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Время загрузки страниц</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.performance.monitoring.metrics.serverResponseTime}
                              onChange={(e) => setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  monitoring: {
                                    ...settings.performance.monitoring,
                                    metrics: { ...settings.performance.monitoring.metrics, serverResponseTime: e.target.checked }
                                  }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Время отклика сервера</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.performance.monitoring.metrics.databaseQueryTime}
                              onChange={(e) => setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  monitoring: {
                                    ...settings.performance.monitoring,
                                    metrics: { ...settings.performance.monitoring.metrics, databaseQueryTime: e.target.checked }
                                  }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Время запросов к БД</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.performance.monitoring.metrics.apiResponseTime}
                              onChange={(e) => setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  monitoring: {
                                    ...settings.performance.monitoring,
                                    metrics: { ...settings.performance.monitoring.metrics, apiResponseTime: e.target.checked }
                                  }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Время отклика API</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.performance.monitoring.metrics.resourceUsage}
                              onChange={(e) => setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  monitoring: {
                                    ...settings.performance.monitoring,
                                    metrics: { ...settings.performance.monitoring.metrics, resourceUsage: e.target.checked }
                                  }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Использование ресурсов</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.performance.monitoring.metrics.errorTracking}
                              onChange={(e) => setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  monitoring: {
                                    ...settings.performance.monitoring,
                                    metrics: { ...settings.performance.monitoring.metrics, errorTracking: e.target.checked }
                                  }
                                }
                              })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Отслеживание ошибок</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Оптимизация базы данных */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Оптимизация базы данных</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.database.queryOptimization}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              database: { ...settings.performance.optimization.database, queryOptimization: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Оптимизация запросов</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.database.connectionPooling}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              database: { ...settings.performance.optimization.database, connectionPooling: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Пул соединений</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.database.indexOptimization}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              database: { ...settings.performance.optimization.database, indexOptimization: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Оптимизация индексов</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.database.cacheQueries}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              database: { ...settings.performance.optimization.database, cacheQueries: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Кэширование запросов</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.database.slowQueryLogging}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              database: { ...settings.performance.optimization.database, slowQueryLogging: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Логирование медленных запросов</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Оптимизация фронтенда */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Оптимизация фронтенда</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.frontend.codeSplitting}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              frontend: { ...settings.performance.optimization.frontend, codeSplitting: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Разделение кода</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.frontend.treeShaking}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              frontend: { ...settings.performance.optimization.frontend, treeShaking: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Tree Shaking</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.frontend.bundleOptimization}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              frontend: { ...settings.performance.optimization.frontend, bundleOptimization: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Оптимизация бандлов</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.frontend.criticalCSS}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              frontend: { ...settings.performance.optimization.frontend, criticalCSS: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Critical CSS</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.frontend.preloadResources}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              frontend: { ...settings.performance.optimization.frontend, preloadResources: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Предзагрузка ресурсов</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Оптимизация сервера */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Оптимизация сервера</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.performance.optimization.server.gzipCompression}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              optimization: {
                                ...settings.performance.optimization,
                                server: { ...settings.performance.optimization.server, gzipCompression: e.target.checked }
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">GZIP сжатие</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.performance.optimization.server.http2Enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              optimization: {
                                ...settings.performance.optimization,
                                server: { ...settings.performance.optimization.server, http2Enabled: e.target.checked }
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">HTTP/2</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.performance.optimization.server.keepAlive}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              optimization: {
                                ...settings.performance.optimization,
                                server: { ...settings.performance.optimization.server, keepAlive: e.target.checked }
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Keep-Alive</span>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Количество worker процессов</label>
                        <input
                          type="number"
                          value={settings.performance.optimization.server.workerProcesses}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              optimization: {
                                ...settings.performance.optimization,
                                server: { ...settings.performance.optimization.server, workerProcesses: parseInt(e.target.value) }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="1"
                          max="32"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Максимум соединений</label>
                        <input
                          type="number"
                          value={settings.performance.optimization.server.maxConnections}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              optimization: {
                                ...settings.performance.optimization,
                                server: { ...settings.performance.optimization.server, maxConnections: parseInt(e.target.value) }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          min="100"
                          max="10000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Оптимизация изображений */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Оптимизация изображений</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.images.webpConversion}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              images: { ...settings.performance.optimization.images, webpConversion: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Конвертация в WebP</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.images.responsiveImages}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              images: { ...settings.performance.optimization.images, responsiveImages: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Адаптивные изображения</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.images.imageCompression}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              images: { ...settings.performance.optimization.images, imageCompression: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Сжатие изображений</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.images.lazyLoading}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              images: { ...settings.performance.optimization.images, lazyLoading: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Ленивая загрузка</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.performance.optimization.images.placeholderImages}
                        onChange={(e) => setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            optimization: {
                              ...settings.performance.optimization,
                              images: { ...settings.performance.optimization.images, placeholderImages: e.target.checked }
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Placeholder изображения</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Уведомления и отчеты */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Уведомления и отчеты</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Email для уведомлений</label>
                        <input
                          type="email"
                          value={settings.performance.alerts.email}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              alerts: { ...settings.performance.alerts, email: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="admin@metrika.ru"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Частота отчетов</label>
                        <select
                          value={settings.performance.monitoring.reporting.frequency}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              monitoring: {
                                ...settings.performance.monitoring,
                                reporting: { ...settings.performance.monitoring.reporting, frequency: e.target.value }
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                        >
                          <option value="hourly">Каждый час</option>
                          <option value="daily">Ежедневно</option>
                          <option value="weekly">Еженедельно</option>
                          <option value="monthly">Ежемесячно</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.performance.monitoring.reporting.emailReports}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              monitoring: {
                                ...settings.performance.monitoring,
                                reporting: { ...settings.performance.monitoring.reporting, emailReports: e.target.checked }
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Email отчеты</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.performance.monitoring.reporting.dashboardUpdates}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              monitoring: {
                                ...settings.performance.monitoring,
                                reporting: { ...settings.performance.monitoring.reporting, dashboardUpdates: e.target.checked }
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Обновления дашборда</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Форматы экспорта</label>
                      <div className="flex gap-4">
                        {['pdf', 'csv', 'json', 'xlsx'].map(format => (
                          <label key={format} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.performance.monitoring.reporting.exportFormats.includes(format)}
                              onChange={(e) => {
                                const updatedFormats = e.target.checked
                                  ? [...settings.performance.monitoring.reporting.exportFormats, format]
                                  : settings.performance.monitoring.reporting.exportFormats.filter(f => f !== format)
                                setSettings({
                                  ...settings,
                                  performance: {
                                    ...settings.performance,
                                    monitoring: {
                                      ...settings.performance.monitoring,
                                      reporting: { ...settings.performance.monitoring.reporting, exportFormats: updatedFormats }
                                    }
                                  }
                                })
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 uppercase">{format}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Автоматическое обслуживание */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Автоматическое обслуживание</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black">Автоматическая оптимизация</div>
                        <div className="text-sm text-gray-600">Автоматическое применение оптимизаций</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.performance.maintenance.autoOptimization}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              maintenance: { ...settings.performance.maintenance, autoOptimization: e.target.checked }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Окно обслуживания</label>
                        <input
                          type="text"
                          value={settings.performance.maintenance.maintenanceWindow}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              maintenance: { ...settings.performance.maintenance, maintenanceWindow: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                          placeholder="02:00-04:00"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.performance.maintenance.backupBeforeOptimization}
                          onChange={(e) => setSettings({
                            ...settings,
                            performance: {
                              ...settings.performance,
                              maintenance: { ...settings.performance.maintenance, backupBeforeOptimization: e.target.checked }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Резервная копия перед оптимизацией</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Быстрые действия */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Быстрые действия</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex gap-4">
                    <button className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                      style={{backgroundColor: '#fff60b'}}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                    >
                      <Server className="w-4 h-4 inline mr-2" />
                      Запустить оптимизацию
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <Monitor className="w-4 h-4 inline mr-2" />
                      Проверить производительность
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                      <Download className="w-4 h-4 inline mr-2" />
                      Скачать отчет
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Настройки кадрового учёта */}
          {activeTab === 'hr' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Настройки кадрового учёта и бухгалтерии</h3>
              
              {/* Рабочее время */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Рабочее время</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Время начала работы
                      </label>
                      <input
                        type="time"
                        value={settings.hr.workingHours.defaultStartTime}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hr: {
                            ...prev.hr,
                            workingHours: {
                              ...prev.hr.workingHours,
                              defaultStartTime: e.target.value
                            }
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Время окончания работы
                      </label>
                      <input
                        type="time"
                        value={settings.hr.workingHours.defaultEndTime}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hr: {
                            ...prev.hr,
                            workingHours: {
                              ...prev.hr.workingHours,
                              defaultEndTime: e.target.value
                            }
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Коэффициент переработки
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.hr.workingHours.overtimeRate}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hr: {
                            ...prev.hr,
                            workingHours: {
                              ...prev.hr.workingHours,
                              overtimeRate: parseFloat(e.target.value)
                            }
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Продолжительность перерыва (мин)
                      </label>
                      <input
                        type="number"
                        value={settings.hr.workingHours.breakDuration}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hr: {
                            ...prev.hr,
                            workingHours: {
                              ...prev.hr.workingHours,
                              breakDuration: parseInt(e.target.value)
                            }
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Зарплата */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Настройки зарплаты</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Валюта
                      </label>
                      <select
                        value={settings.hr.salary.currency}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hr: {
                            ...prev.hr,
                            salary: {
                              ...prev.hr.salary,
                              currency: e.target.value
                            }
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="RUB">₽ Рубль</option>
                        <option value="USD">$ Доллар</option>
                        <option value="EUR">€ Евро</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Налоговая ставка (%)
                      </label>
                      <input
                        type="number"
                        value={settings.hr.salary.taxRate}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hr: {
                            ...prev.hr,
                            salary: {
                              ...prev.hr.salary,
                              taxRate: parseInt(e.target.value)
                            }
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Социальные взносы (%)
                      </label>
                      <input
                        type="number"
                        value={settings.hr.salary.socialContributions}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hr: {
                            ...prev.hr,
                            salary: {
                              ...prev.hr.salary,
                              socialContributions: parseInt(e.target.value)
                            }
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.hr.salary.autoCalculation}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hr: {
                              ...prev.hr,
                              salary: {
                                ...prev.hr.salary,
                                autoCalculation: e.target.checked
                              }
                            }
                          }))}
                          className="mr-2"
                        />
                        Автоматический расчёт
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.hr.salary.monthlyCalculation}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hr: {
                              ...prev.hr,
                              salary: {
                                ...prev.hr.salary,
                                monthlyCalculation: e.target.checked
                              }
                            }
                          }))}
                          className="mr-2"
                        />
                        Ежемесячный расчёт
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Уведомления */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Уведомления</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.hr.notifications.emailNotifications}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hr: {
                              ...prev.hr,
                              notifications: {
                                ...prev.hr.notifications,
                                emailNotifications: e.target.checked
                              }
                            }
                          }))}
                          className="mr-2"
                        />
                        Email уведомления
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.hr.notifications.pushNotifications}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hr: {
                              ...prev.hr,
                              notifications: {
                                ...prev.hr.notifications,
                                pushNotifications: e.target.checked
                              }
                            }
                          }))}
                          className="mr-2"
                        />
                        Push уведомления
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.hr.notifications.smsNotifications}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hr: {
                              ...prev.hr,
                              notifications: {
                                ...prev.hr.notifications,
                                smsNotifications: e.target.checked
                              }
                            }
                          }))}
                          className="mr-2"
                        />
                        SMS уведомления
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Права доступа */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Права доступа</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.hr.permissions.roleBasedAccess}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hr: {
                              ...prev.hr,
                              permissions: {
                                ...prev.hr.permissions,
                                roleBasedAccess: e.target.checked
                              }
                            }
                          }))}
                          className="mr-2"
                        />
                        Ролевая система доступа
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.hr.permissions.allowSelfRegistration}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hr: {
                              ...prev.hr,
                              permissions: {
                                ...prev.hr.permissions,
                                allowSelfRegistration: e.target.checked
                              }
                            }
                          }))}
                          className="mr-2"
                        />
                        Самостоятельная регистрация
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Роль по умолчанию
                      </label>
                      <select
                        value={settings.hr.permissions.defaultRole}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hr: {
                            ...prev.hr,
                            permissions: {
                              ...prev.hr.permissions,
                              defaultRole: e.target.value
                            }
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="employee">Сотрудник</option>
                        <option value="manager">Менеджер</option>
                        <option value="hr">HR менеджер</option>
                        <option value="admin">Администратор</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Конструктор договоров */}
          {activeTab === 'contracts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">Настройки конструктора договоров</h3>
              
              {/* Доступные шаблоны */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-black">Доступные шаблоны договоров</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Шаблон 1: Агентский договор */}
                    <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <button className="text-xs text-blue-600 hover:text-blue-800">Редактировать</button>
                      </div>
                      <h5 className="font-semibold text-black mb-1">Агентский договор</h5>
                      <p className="text-sm text-gray-600">Для сделок с недвижимостью</p>
                      <div className="mt-3 text-xs text-gray-500">
                        6 полей • Категория: Клиентские
                      </div>
                    </div>

                    {/* Шаблон 2: Договор аренды */}
                    <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <button className="text-xs text-blue-600 hover:text-blue-800">Редактировать</button>
                      </div>
                      <h5 className="font-semibold text-black mb-1">Договор аренды</h5>
                      <p className="text-sm text-gray-600">Аренда жилой/коммерческой недвижимости</p>
                      <div className="mt-3 text-xs text-gray-500">
                        9 полей • Категория: Аренда
                      </div>
                    </div>

                    {/* Шаблон 3: Договор подряда */}
                    <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <button className="text-xs text-blue-600 hover:text-blue-800">Редактировать</button>
                      </div>
                      <h5 className="font-semibold text-black mb-1">Договор подряда</h5>
                      <p className="text-sm text-gray-600">Подрядные работы</p>
                      <div className="mt-3 text-xs text-gray-500">
                        9 полей • Категория: Подряд
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Добавление нового шаблона */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-semibold text-black">Добавить новый шаблон</h4>
                  <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Добавить шаблон
                  </button>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Название шаблона
                      </label>
                      <input
                        type="text"
                        placeholder="Например: Договор купли-продажи"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Категория
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Выберите категорию</option>
                        <option value="client">Клиентские</option>
                        <option value="rent">Аренда</option>
                        <option value="contractor">Подряд</option>
                        <option value="sale">Продажа</option>
                        <option value="other">Другое</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Загрузить файл шаблона (DOCX/PDF)
                      </label>
                      <div className="flex items-center gap-4">
                        <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all">
                          <Upload className="w-4 h-4 inline mr-2" />
                          Выбрать файл
                        </button>
                        <span className="text-sm text-gray-500">Файл не выбран</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">3</div>
                      <div className="text-sm text-gray-600">Шаблонов</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center">
                    <Database className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">0</div>
                      <div className="text-sm text-gray-600">Созданных договоров</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center">
                    <BarChart className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-black">0</div>
                      <div className="text-sm text-gray-600">За текущий месяц</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Информация */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Совет:</strong> Вы можете создать новые шаблоны договоров или редактировать существующие. 
                    После сохранения шаблона он будет доступен в разделе &quot;Конструктор договоров&quot; админ-панели.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно добавления IP */}
      {showIPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-300">
              <h3 className="text-lg font-semibold text-black">
                Добавить {ipModalType === 'whitelist' ? 'в белый список' : 'в заблокированные'}
              </h3>
              <button
                onClick={() => setShowIPModal(false)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">IP адрес</label>
                <input
                  type="text"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
                  placeholder="192.168.1.1"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddIP}
                  className="flex-1 px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                >
                  Добавить
                </button>
                <button
                  onClick={() => setShowIPModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
