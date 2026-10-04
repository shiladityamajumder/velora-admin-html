import { z } from "../vendor/schema.js";
const text = (key, label, kind = "text", section = "Basic Information", required = false) => ({ key, label, kind, section, required });
const num = (key, label, kind = "number", section = "Basic Information", max) => ({ key, label, kind, section, min: 0, max });
const select = (key, label, options, section = "Basic Information") => ({
  key,
  label,
  kind: "select",
  section,
  options,
  required: true
});
const note = text("notes", "Notes", "textarea", "Notes");
export const fieldSets = {
  products: [
    text("sku", "SKU", "text", "Basic Information", true),
    text("category", "Category", "text", "Basic Information", true),
    text("brand", "Brand"),
    text("manufacturer", "Manufacturer"),
    text("media", "Media", "media", "Media"),
    num("mrp", "MRP", "currency", "Pricing"),
    num("price", "Price", "currency", "Pricing"),
    num("tax", "Tax", "number", "Pricing", 100),
    num("stock", "Stock", "number", "Inventory"),
    text("variants", "Variants", "textarea", "Variants"),
    text("attributes", "Attributes", "textarea", "Attributes"),
    num("weight", "Weight", "number", "Shipping"),
    text("genericName", "Generic name", "text", "Healthcare Information"),
    text("dosageForm", "Dosage form", "text", "Healthcare Information"),
    text("strength", "Strength", "text", "Healthcare Information"),
    text("packSize", "Pack size", "text", "Healthcare Information"),
    text(
      "prescriptionRequired",
      "Prescription required",
      "boolean",
      "Healthcare Information"
    ),
    text("storage", "Storage requirement", "text", "Healthcare Information"),
    text("seo", "SEO", "textarea", "SEO"),
    text("tags", "Tags", "text", "Visibility"),
    note
  ],
  customers: [
    text("email", "Email", "email", "Basic Information", true),
    text("phone", "Phone", "text", "Basic Information", true),
    text("city", "City"),
    text("address", "Address", "textarea", "Addresses"),
    text("pincode", "Pincode", "text", "Addresses"),
    select("segment", "Segments", ["Retail", "Loyal", "Corporate", "New"]),
    num("wallet", "Wallet", "currency"),
    num("loyalty", "Loyalty"),
    note
  ],
  orders: [
    text("customer", "Customer", "text", "Basic Information", true),
    text("email", "Email", "email"),
    text("city", "City"),
    text("address", "Delivery address", "textarea", "Shipping"),
    num("amount", "Amount", "currency", "Pricing"),
    num("discount", "Discount", "currency", "Pricing"),
    num("tax", "Tax", "currency", "Pricing"),
    select(
      "paymentMethod",
      "Payment method",
      ["UPI", "Card", "COD", "Wallet"],
      "Pricing"
    ),
    select(
      "paymentStatus",
      "Payment status",
      ["Pending", "Paid", "Refunded"],
      "Pricing"
    ),
    text("items", "Items", "textarea", "Items", true),
    text("tracking", "Tracking", "text", "Shipping"),
    note
  ],
  inventory: [
    text("sku", "SKU", "text", "Basic Information", true),
    text("batch", "Batch number", "text", "Basic Information", true),
    text("manufactureDate", "Manufacturing date", "date"),
    text("expiryDate", "Expiry date", "date", "Basic Information", true),
    select("warehouse", "Warehouse", [
      "Kolkata Central",
      "Mumbai West",
      "Delhi North",
      "Bengaluru South"
    ]),
    num("quantity", "Quantity"),
    num("reserved", "Reserved quantity"),
    num("purchasePrice", "Purchase price", "currency"),
    num("mrp", "MRP", "currency"),
    note
  ],
  movements: [
    text("sku", "SKU"),
    text("batch", "Batch number"),
    text("warehouse", "Warehouse"),
    num("previousQuantity", "Previous quantity"),
    num("quantity", "Quantity"),
    { key: "change", label: "Quantity change", kind: "number", min: -1e6 },
    text("reference", "Reference"),
    note
  ],
  transfers: [
    text("sku", "SKU", "text", "Basic Information", true),
    text("batch", "Batch number", "text", "Basic Information", true),
    select("sourceWarehouse", "Source warehouse", [
      "Kolkata Central",
      "Mumbai West",
      "Delhi North",
      "Bengaluru South"
    ]),
    select("destinationWarehouse", "Destination warehouse", [
      "Kolkata Central",
      "Mumbai West",
      "Delhi North",
      "Bengaluru South"
    ]),
    num("quantity", "Quantity"),
    text("date", "Date", "date"),
    note
  ],
  adjustments: [
    text("sku", "SKU", "text", "Basic Information", true),
    text("batch", "Batch number", "text", "Basic Information", true),
    select("warehouse", "Warehouse", [
      "Kolkata Central",
      "Mumbai West",
      "Delhi North",
      "Bengaluru South"
    ]),
    num("quantity", "Quantity"),
    text("date", "Date", "date"),
    note
  ],
  vendors: [
    text("email", "Email", "email", "Basic Information", true),
    text("phone", "Phone"),
    text("city", "City"),
    num("commission", "Commission", "number", "Basic Information", 100),
    num("amount", "Amount", "currency"),
    text("documents", "Documents", "textarea", "Documents"),
    note
  ],
  crm: [
    text("email", "Email", "email", "Basic Information", true),
    text("phone", "Phone"),
    text("owner", "Owner", "text", "Basic Information", true),
    select("source", "Source", ["Website", "Referral", "Campaign", "Partner"]),
    num("value", "Value", "currency"),
    num("probability", "Probability", "number", "Basic Information", 100),
    text("closeDate", "Expected close", "date"),
    note
  ],
  tickets: [
    text("customer", "Customer", "text", "Basic Information", true),
    text("email", "Email", "email"),
    text("order", "Orders"),
    select("priority", "Priority", ["Low", "Medium", "High", "Urgent"]),
    text("owner", "Owner"),
    select("channel", "Channel", ["Email", "Chat", "Phone", "App"]),
    note
  ],
  prescriptions: [
    text("customer", "Customer", "text", "Basic Information", true),
    text("order", "Orders"),
    text("owner", "Assign reviewer"),
    text("document", "Synthetic document", "textarea", "Media"),
    note
  ],
  bookings: [
    text("customer", "Customer", "text", "Basic Information", true),
    text("test", "Tests", "text", "Basic Information", true),
    text("lab", "Labs"),
    select("collection", "Collection", ["Home", "Lab visit"]),
    text("date", "Date", "date", "Basic Information", true),
    text("owner", "Owner"),
    num("amount", "Amount", "currency"),
    note
  ],
  appointments: [
    text("customer", "Customer", "text", "Basic Information", true),
    text("doctor", "Doctors", "text", "Basic Information", true),
    text("specialization", "Specialization"),
    text("date", "Date", "date", "Basic Information", true),
    text("time", "Time", "text", "Basic Information", true),
    text("clinic", "Clinics"),
    num("amount", "Amount", "currency"),
    note
  ],
  procurement: [
    text("vendor", "Vendor", "text", "Basic Information", true),
    text("warehouse", "Warehouse"),
    num("quantity", "Quantity"),
    num("amount", "Amount", "currency"),
    text("date", "Date", "date"),
    note
  ],
  shipments: [
    text("order", "Orders", "text", "Basic Information", true),
    text("customer", "Customer"),
    select("carrier", "Carrier", [
      "Demo Express",
      "Demo Health Logistics",
      "Demo Local"
    ]),
    text("tracking", "Tracking", "text", "Basic Information", true),
    text("city", "City"),
    text("date", "Date", "date"),
    note
  ],
  finance: [
    text("order", "Orders"),
    text("customer", "Customer"),
    num("amount", "Amount", "currency"),
    select("method", "Payment method", ["UPI", "Card", "COD", "Wallet"]),
    text("reference", "Reference", "text", "Basic Information", true),
    text("date", "Date", "date"),
    note
  ],
  campaigns: [
    select("type", "Type", ["Coupon", "Email", "Push", "Banner", "Referral"]),
    select("audience", "Audience", ["All", "New", "Loyal", "Corporate"]),
    num("discount", "Discount", "number", "Basic Information", 100),
    num("usageLimit", "Usage limit"),
    text("startDate", "Start date", "date", "Basic Information", true),
    text("endDate", "End date", "date", "Basic Information", true),
    num("budget", "Budget", "currency"),
    note
  ],
  content: [
    text("slug", "Slug", "text", "Basic Information", true),
    text("category", "Category"),
    text("author", "Author"),
    text("content", "Content", "textarea", "Content", true),
    text("seo", "SEO", "textarea", "SEO"),
    note
  ],
  tasks: [
    text("owner", "Owner"),
    select("priority", "Priority", ["Low", "Medium", "High"]),
    text("date", "Date", "date"),
    note
  ],
  directory: [
    text("category", "Category"),
    text("location", "Location"),
    text("owner", "Owner"),
    text("email", "Email", "email"),
    text("phone", "Phone"),
    note
  ]
};
const defs = [];
function add(path, title, group, kind, view, manage, statuses = ["Active", "Inactive", "Draft"], feature, workflow = false) {
  defs.push({
    path,
    title,
    group,
    kind,
    fields: fieldSets[kind],
    statuses,
    view,
    manage,
    feature,
    workflow
  });
}
add(
  "commerce/products",
  "Products",
  "Commerce",
  "products",
  "products.view",
  "products.update"
);
add(
  "commerce/customers",
  "Customers",
  "Commerce",
  "customers",
  "customers.view",
  "customers.update"
);
add(
  "commerce/orders",
  "Orders",
  "Commerce",
  "orders",
  "orders.view",
  "orders.update",
  [
    "New",
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
    "Refunded"
  ],
  void 0,
  true
);
for (const [slug, title] of [
  ["categories", "Categories"],
  ["brands", "Brands"],
  ["manufacturers", "Manufacturers"],
  ["medicine-types", "Medicine Types"],
  ["units", "Units"],
  ["attributes", "Attributes"],
  ["reviews", "Reviews"],
  ["questions", "Product Questions"]
])
  add(
    "commerce/" + slug,
    title,
    "Commerce",
    "directory",
    "products.view",
    "products.update"
  );
add(
  "pharmacy/prescriptions",
  "Prescriptions",
  "Pharmacy",
  "prescriptions",
  "pharmacy.view",
  "pharmacy.manage",
  ["Pending", "Approved", "Rejected", "Needs clarification"],
  void 0,
  true
);
add(
  "diagnostics/bookings",
  "Bookings",
  "Diagnostics",
  "bookings",
  "diagnostics.view",
  "diagnostics.manage",
  [
    "Booked",
    "Assigned",
    "Collected",
    "Received",
    "Processing",
    "Completed",
    "Cancelled"
  ],
  "diagnostics",
  true
);
for (const [slug, title] of [
  ["tests", "Tests"],
  ["packages", "Test Packages"],
  ["labs", "Labs"],
  ["centers", "Collection Centers"],
  ["phlebotomists", "Phlebotomists"],
  ["reports", "Reports"]
])
  add(
    "diagnostics/" + slug,
    title,
    "Diagnostics",
    "directory",
    "diagnostics.view",
    "diagnostics.manage",
    ["Active", "Pending", "Completed"],
    "diagnostics"
  );
add(
  "doctors/appointments",
  "Appointments",
  "Doctors",
  "appointments",
  "doctors.view",
  "doctors.manage",
  ["Booked", "Confirmed", "Completed", "Cancelled"],
  "telemedicine",
  true
);
for (const [slug, title] of [
  ["directory", "Doctors"],
  ["specializations", "Specializations"],
  ["clinics", "Clinics"],
  ["availability", "Availability"]
])
  add(
    "doctors/" + slug,
    title,
    "Doctors",
    "directory",
    "doctors.view",
    "doctors.manage",
    ["Active", "Unavailable"],
    "telemedicine"
  );
add(
  "inventory/stock",
  "Stock",
  "Inventory",
  "inventory",
  "inventory.view",
  "inventory.manage",
  ["Active", "Low stock", "Out of stock", "Damaged", "Non-saleable"]
);
add(
  "inventory/transfers",
  "Transfers",
  "Inventory",
  "transfers",
  "inventory.view",
  "inventory.manage",
  ["Pending", "Approved", "Completed", "Cancelled"],
  void 0,
  true
);
add(
  "inventory/adjustments",
  "Adjustments",
  "Inventory",
  "adjustments",
  "inventory.view",
  "inventory.manage",
  ["Pending", "Approved", "Completed", "Cancelled"],
  void 0,
  true
);
add(
  "inventory/warehouses",
  "Warehouses",
  "Inventory",
  "directory",
  "inventory.view",
  "inventory.manage"
);
add(
  "inventory/movements",
  "Stock Movement",
  "Inventory",
  "movements",
  "inventory.view",
  "inventory.manage",
  ["Pending", "Approved", "Completed"]
);
add(
  "procurement/vendors",
  "Vendors",
  "Procurement",
  "vendors",
  "vendors.view",
  "vendors.manage"
);
for (const [slug, title] of [
  ["requests", "Purchase Requests"],
  ["orders", "Purchase Orders"],
  ["grn", "Goods Received"],
  ["putaway", "Putaway"],
  ["returns", "Purchase Returns"]
])
  add(
    "procurement/" + slug,
    title,
    "Procurement",
    "procurement",
    "procurement.view",
    "procurement.manage",
    [
      "Purchase Request",
      "Purchase Order",
      "Goods Received",
      "Quality Check",
      "Putaway",
      "Inventory"
    ],
    void 0,
    true
  );
for (const [slug, title] of [
  ["zones", "Zones"],
  ["racks", "Racks"],
  ["bins", "Bins"],
  ["trays", "Trays"],
  ["picking", "Picking"],
  ["packing", "Packing"],
  ["dispatch", "Dispatch"]
])
  add(
    "warehouse/" + slug,
    title,
    "Warehouse",
    "directory",
    "inventory.view",
    "inventory.manage",
    ["Available", "Occupied", "Blocked"],
    "warehouse"
  );
for (const [slug, title] of [
  ["contacts", "Contacts"],
  ["leads", "Leads"],
  ["deals", "Deals"]
])
  add(
    "crm/" + slug,
    title,
    "CRM",
    "crm",
    "crm.view",
    "crm.manage",
    ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"],
    "crm"
  );
add(
  "crm/activities",
  "Activities",
  "CRM",
  "tasks",
  "crm.view",
  "crm.manage",
  ["Open", "Completed"],
  "crm"
);
add(
  "support/tickets",
  "Tickets",
  "Support",
  "tickets",
  "support.view",
  "support.manage",
  ["Open", "Pending", "Resolved", "Closed"],
  void 0,
  true
);
for (const [slug, title] of [
  ["agents", "Agents"],
  ["teams", "Teams"],
  ["responses", "Canned Responses"],
  ["categories", "Categories"]
])
  add(
    "support/" + slug,
    title,
    "Support",
    "directory",
    "support.view",
    "support.manage"
  );
add(
  "logistics/shipments",
  "Shipments",
  "Logistics",
  "shipments",
  "logistics.view",
  "logistics.manage",
  [
    "Confirmed",
    "Packed",
    "Picked up",
    "In transit",
    "Out for delivery",
    "Delivered",
    "Failed",
    "Returned"
  ],
  void 0,
  true
);
for (const [slug, title] of [
  ["partners", "Delivery Partners"],
  ["zones", "Delivery Zones"],
  ["pincodes", "Pincodes"],
  ["returns", "Returns"]
])
  add(
    "logistics/" + slug,
    title,
    "Logistics",
    "directory",
    "logistics.view",
    "logistics.manage"
  );
for (const [slug, title] of [
  ["transactions", "Transactions"],
  ["payments", "Payments"],
  ["refunds", "Refunds"],
  ["settlements", "Settlements"],
  ["payouts", "Vendor Payouts"],
  ["reconciliation", "Reconciliation"],
  ["invoices", "Invoices"],
  ["credit-notes", "Credit Notes"],
  ["tax-reports", "Tax Reports"],
  ["wallet", "Wallet Transactions"]
])
  add(
    "finance/" + slug,
    title,
    "Finance",
    "finance",
    "finance.view",
    "finance.manage",
    ["Pending", "Paid", "Failed", "Reconciled", "Refunded"]
  );
for (const [slug, title] of [
  ["campaigns", "Campaigns"],
  ["coupons", "Coupons"],
  ["offers", "Offers"],
  ["banners", "Banners"],
  ["notifications", "Push Notifications"],
  ["email", "Email Campaigns"],
  ["referrals", "Referral Program"]
])
  add(
    "marketing/" + slug,
    title,
    "Marketing",
    "campaigns",
    "marketing.view",
    "marketing.manage",
    ["Draft", "Scheduled", "Active", "Completed"],
    "marketing"
  );
for (const [slug, title] of [
  ["pages", "Pages"],
  ["blogs", "Blogs"],
  ["faqs", "FAQs"],
  ["navigation", "Navigation"],
  ["landing-pages", "Landing Pages"]
])
  add(
    "content/" + slug,
    title,
    "Content",
    "content",
    "content.view",
    "content.manage",
    ["Draft", "Published", "Archived"]
  );
for (const [slug, title] of [
  ["applications", "Seller Applications"],
  ["sellers", "Sellers"],
  ["commissions", "Commissions"],
  ["documents", "Documents"],
  ["performance", "Performance"]
])
  add(
    "vendors/" + slug,
    title,
    "Vendors",
    "vendors",
    "vendors.view",
    "vendors.manage",
    ["Pending", "Approved", "Active", "Rejected"],
    "vendors"
  );
for (const [slug, title] of [
  ["users", "Users"],
  ["teams", "Teams"],
  ["sessions", "Sessions"],
  ["login-history", "Login History"]
])
  add(
    "admin/" + slug,
    title,
    "Administration",
    "directory",
    "users.manage",
    "users.manage"
  );
add("apps/tasks", "Tasks", "Apps", "tasks", "crm.view", "crm.manage", [
  "Open",
  "In progress",
  "Completed"
]);
export const modules = defs;
export function getModule(path) {
  return modules.find((module) => module.path === path);
}
export function moduleSchema(module) {
  const shape = {
    id: z.string(),
    createdAt: z.string(),
    name: z.string().trim().min(2, "Required field"),
    status: z.enum(module.statuses)
  };
  for (const field of module.fields) {
    if (["number", "currency"].includes(field.kind)) {
      let numeric = z.number().min(field.min ?? 0, "Enter a valid number").max(field.max ?? Number.MAX_SAFE_INTEGER, "Enter a valid number");
      if (["stock", "quantity", "reserved", "usageLimit", "loyalty"].includes(
        field.key
      ))
        numeric = numeric.int("Enter a valid number");
      shape[field.key] = numeric;
    } else if (field.kind === "boolean") shape[field.key] = z.boolean();
    else if (field.kind === "select")
      shape[field.key] = z.enum(field.options);
    else if (field.kind === "email")
      shape[field.key] = field.required ? z.email("Enter a valid email") : z.union([z.email("Enter a valid email"), z.literal("")]);
    else
      shape[field.key] = field.required ? z.string().trim().min(1, "Required field") : z.string();
  }
  return z.object(shape).superRefine((value, context) => {
    const issue = (path, message) => context.addIssue({ code: "custom", path: [path], message });
    if (module.kind === "products" && Number(value.price) > Number(value.mrp))
      issue("price", "Price must not exceed MRP");
    if (module.kind === "inventory" && Number(value.reserved) > Number(value.quantity))
      issue("reserved", "Reserved quantity exceeds stock");
    if (module.kind === "inventory" && String(value.manufactureDate) > String(value.expiryDate))
      issue("expiryDate", "Expiry must follow manufacture date");
    if (module.kind === "campaigns" && String(value.startDate) > String(value.endDate))
      issue("endDate", "End date must follow start date");
    for (const field of module.fields.filter((field2) => field2.kind === "date"))
      if (value[field.key] && !isIsoDate(String(value[field.key])))
        issue(field.key, "Required field");
  });
}
export function emptyRecord(module) {
  const fields = Object.fromEntries(
    module.fields.map((field) => [
      field.key,
      field.kind === "boolean" ? false : ["number", "currency"].includes(field.kind) ? 0 : field.kind === "select" ? field.options?.[0] ?? "" : ""
    ])
  );
  return {
    ...fields,
    id: "",
    createdAt: "",
    name: "",
    status: module.statuses[0]
  };
}
export function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T00:00:00Z");
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
