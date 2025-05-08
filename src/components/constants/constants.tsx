export interface DataSet {
  id: string;
  name: string;
  status: "active" | "inactive" | "waiting";
  fields: string[];
  purpose: string[];
  expiryDate: string;
  accessToken: string;
}

export interface Application {
  id: string;
  name: string;
  app_created_date?: string;
  app_desc?: string;
  applicationRegisteredDate?: string;
  applicationDescription?: string;
  dataSets: DataSet[];
}

export const preload_dashboard_apps: Application[] = [
  {
    id: `app-${Date.now()}`,
    name: "TrustAssure",
    app_created_date: new Date().toISOString().split("T")[0],
    app_desc: "KYC verification based on user information details",
    dataSets: [
      {
        id: `ds-${Date.now()}`,
        name: "User Profiles",
        status: "active",
        fields: [
          "FullName",
          "DOB",
          "Gender",
          "Email",
          "Phone Number",
          "PAN Card Number",
          "Aadhar Number",
          "Passport Number",
          "Address",
        ],
        purpose: [
          "Verification",
          "Customer onboarding",
          "Audit Trail",
          "Learning and Auditing",
          "Record Keeping",
          "Legal Compliance",
          "Security Alert",
          "User Authentication",
        ],
        expiryDate: "15-04-2026 05:35",
        accessToken:
          "eyBillPol.eyJSb2RestrictedlIjoiQ29uc3VtZRestrictedIiLCJleHAiOjE3NDQzNjEyMDB9.Oa4gUS4Ghw8A1IZRestrictedwIk",
      },
    ],
  },
  {
    id: "app-001",
    name: "KYC Submission",
    app_created_date: "2025-04-15",
    app_desc:
      "Provides customers with access to their profiles, services, and support options.",
    dataSets: [
      {
        id: "ds-001",
        name: "Customer Information",
        status: "inactive",
        fields: ["Name", "Email", "Phone", "Address", "Customer ID"],
        purpose: [
          "Verification",
          "Customer onboarding",
          "Audit Trail",
          "Learning and Auditing",
        ],
        expiryDate: "2025-06-15",
        accessToken: " ",
      },
      {
        id: "ds-002",
        name: "Payment Details",
        status: "active",
        fields: ["Credit Card", "Billing Address", "Payment History"],
        purpose: ["Payment Processing", "Fraud Prevention"],
        expiryDate: "2025-08-22",
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhU2V0IjoiZHMtMDAyIn0.Xy",
      },
    ],
  },
  {
    id: "app-002",
    name: "Insurance Claim",
    app_created_date: "2025-04-15",
    app_desc:
      "Analyzes user interaction data to drive marketing strategies and improve user experience.",
    dataSets: [
      {
        id: "ds-003",
        name: "User Behavior",
        status: "active",
        fields: [
          "Click Events",
          "Page Views",
          "Time on Page",
          "Referral Source",
        ],
        purpose: [
          "Record Keeping",
          "Legal Compliance",
          "Security Alert",
          "User Authentication",
        ],
        expiryDate: "2025-05-10",
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhU2V0IjoiZHMtMDAzIn0.Ab",
      },
      {
        id: "ds-004",
        name: "Campaign Performance",
        status: "inactive",
        fields: ["Campaign ID", "Impressions", "Clicks", "Conversions", "ROI"],
        purpose: ["Analytics", "Marketing"],
        expiryDate: "2025-04-01",
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      },
    ],
  },
  {
    id: "app-003",
    name: "Underwriting",
    app_created_date: "2023-05-07",
    app_desc:
      "Centralized interface for employees to manage their profiles and access internal resources.",
    dataSets: [
      {
        id: "ds-005",
        name: "Employee Records",
        status: "waiting",
        fields: ["Name", "Employee ID", "Department", "Position", "Hire Date"],
        purpose: ["HR Management", "Access Control"],
        expiryDate: "2025-07-18",
        accessToken: "eyJkYXRhU2V0IjoiZHMtMDAxIn0",
      },
    ],
  },
  {
    id: "app-004",
    name: "Customer Service",
    app_created_date: "2023-06-12",
    app_desc:
      "Tracks inventory levels, orders, sales, and deliveries to streamline supply chain operations.",
    dataSets: [
      {
        id: "ds-006",
        name: "Product Catalog",
        status: "active",
        fields: ["Product ID", "Name", "Category", "Price", "Stock Level"],
        purpose: ["Inventory Management", "Sales"],
        expiryDate: "2025-09-30",
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhU2V0IjoiZHMtMDA2In0.Cd",
      },
      {
        id: "ds-007",
        name: "Supplier Information",
        status: "inactive",
        fields: ["Supplier ID", "Name", "Contact", "Address", "Products"],
        purpose: ["Procurement", "Supply Chain Management"],
        expiryDate: "2025-03-15",
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      },
      {
        id: "ds-008",
        name: "Order History",
        status: "waiting",
        fields: ["Order ID", "Date", "Products", "Quantity", "Status"],
        purpose: ["Order Fulfillment", "Analytics"],
        expiryDate: "2025-10-05",
        accessToken: "eyJkYXRhU2V0IjoiZHMtMDAxIn0",
      },
    ],
  },
  {
    id: "app-005",
    name: "Fraud Investigation",
    app_created_date: "2023-04-22",
    app_desc:
      "Manages customer support requests and tracks issue resolution processes.",
    dataSets: [
      {
        id: "ds-009",
        name: "Ticket Data",
        status: "active",
        fields: ["Ticket ID", "Customer", "Subject", "Description", "Status"],
        purpose: ["Customer Support", "Issue Tracking"],
        expiryDate: "2025-08-10",
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhU2V0IjoiZHMtMDA5In0.Ef",
      },
    ],
  },
];

export const register_app_default_data_sets: {
  name: string;
  fields: string[];
  purpose: string[];
}[] = [
  {
    name: "User Profile Data",
    fields: ["name", "email", "age", "location"],
    purpose: ["Authentication", "User personalization"],
  },
  {
    name: "Analytics Data",
    fields: ["user_id", "page_views", "session_time", "interactions"],
    purpose: ["User behavior tracking", "Analytics"],
  },
  {
    name: "Payment Information",
    fields: ["card_type", "last_four", "billing_address"],
    purpose: ["Processing transactions", "Payments"],
  },
];

export const available_fields_to_register: string[] = [
  "name",
  "email",
  "age",
  "location",
  "user_id",
  "page_views",
  "session_time",
  "interactions",
  "card_type",
  "last_four",
  "billing_address",
  "phone",
  "preferences",
  "settings",
  "avatar",
  "subscription_type",
  "login_history",
  "device_info",
  "ip_address",
];

export const available_purposes_to_register: string[] = [
  "Authentication",
  "User personalization",
  "User behavior tracking",
  "Analytics",
  "Processing transactions",
  "Payments",
  "Marketing",
  "Customer support",
  "Fraud detection",
  "Regulatory compliance",
  "Product improvement",
  "Research",
];
