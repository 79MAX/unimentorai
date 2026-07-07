export const PLANS = {

  FREE: {
    id: "FREE",
    tier: 0,
    price: 0,
    currency: "USD",
    limits: {
      aiRequests: 20,
      jobs: 10,
      mentoring: false
    },
    features: [
      "Basic AI Career Coach",
      "Limited job suggestions",
      "Basic courses access"
    ]
  },

  PRO: {
    id: "PRO",
    tier: 1,
    price: 9.99,
    currency: "USD",
    billing: "monthly",
    limits: {
      aiRequests: "unlimited",
      jobs: "full",
      mentoring: true
    },
    features: [
      "Unlimited AI Career Coach",
      "Full job matching system",
      "Full education access",
      "Mentoring access",
      "Certificates system"
    ]
  },

  BUSINESS: {
    id: "BUSINESS",
    tier: 2,
    price: 29.99,
    currency: "USD",
    billing: "monthly",
    limits: {
      users: 50,
      aiRequests: "unlimited",
      mentoring: true,
      webinars: true
    },
    features: [
      "Company dashboard",
      "Employee training system",
      "Webinars & live sessions",
      "Analytics & reports",
      "Team mentoring system"
    ]
  },

  EDUCATION: {
    id: "EDUCATION",
    tier: 3,
    price: 49.99,
    currency: "USD",
    billing: "monthly",
    limits: {
      students: "unlimited",
      teachers: true,
      offlineMode: true
    },
    features: [
      "School / University LMS",
      "Student management system",
      "Courses + Exams + Certificates",
      "Teacher dashboard",
      "Offline learning mode"
    ]
  },

  ENTERPRISE: {
    id: "ENTERPRISE",
    tier: 4,
    price: 99.99,
    currency: "USD",
    billing: "custom",
    limits: {
      whiteLabel: true,
      apiAccess: true,
      aiTraining: true,
      globalDeploy: true
    },
    features: [
      "Full platform access",
      "White-label system",
      "API access",
      "Custom AI training",
      "Global enterprise deployment"
    ]
  }
};
