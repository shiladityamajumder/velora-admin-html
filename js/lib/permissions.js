export const permissions = [
  "orders.view",
  "orders.create",
  "orders.update",
  "orders.cancel",
  "products.view",
  "products.create",
  "products.update",
  "products.delete",
  "customers.view",
  "customers.create",
  "customers.update",
  "customers.delete",
  "inventory.view",
  "inventory.manage",
  "procurement.view",
  "procurement.manage",
  "pharmacy.view",
  "pharmacy.manage",
  "diagnostics.view",
  "diagnostics.manage",
  "doctors.view",
  "doctors.manage",
  "crm.view",
  "crm.manage",
  "support.view",
  "support.manage",
  "finance.view",
  "finance.manage",
  "marketing.view",
  "marketing.manage",
  "logistics.view",
  "logistics.manage",
  "vendors.view",
  "vendors.manage",
  "content.view",
  "content.manage",
  "users.manage",
  "settings.manage",
  "analytics.view"
];
export const roles = [
  "Super Admin",
  "Administrator",
  "Operations Manager",
  "Pharmacy Manager",
  "Inventory Manager",
  "Procurement Manager",
  "Diagnostics Manager",
  "Doctor Operations",
  "Customer Support Agent",
  "Customer Support Manager",
  "Finance Manager",
  "Marketing Manager",
  "Delivery Manager",
  "Vendor",
  "Seller",
  "Content Manager",
  "Compliance Manager",
  "Analyst"
];
const access = (...domains) => permissions.filter(
  (permission) => domains.some((domain) => permission.startsWith(domain + "."))
);
export const rolePermissions = {
  "Super Admin": permissions,
  Administrator: permissions,
  "Operations Manager": access(
    "orders",
    "products",
    "customers",
    "inventory",
    "logistics",
    "procurement",
    "analytics"
  ),
  "Pharmacy Manager": access("pharmacy", "orders", "products", "inventory"),
  "Inventory Manager": access("inventory", "products"),
  "Procurement Manager": access("procurement", "vendors", "inventory"),
  "Diagnostics Manager": access("diagnostics", "customers"),
  "Doctor Operations": access("doctors", "customers"),
  "Customer Support Agent": [
    "support.view",
    "support.manage",
    "orders.view",
    "customers.view"
  ],
  "Customer Support Manager": access("support", "customers", "orders"),
  "Finance Manager": [...access("finance"), "orders.view", "vendors.view"],
  "Marketing Manager": access("marketing", "crm", "customers"),
  "Delivery Manager": access("logistics", "orders"),
  Vendor: ["vendors.view", "products.view", "orders.view", "inventory.view"],
  Seller: ["vendors.view", "products.view", "orders.view"],
  "Content Manager": access("content", "marketing"),
  "Compliance Manager": [
    "pharmacy.view",
    "diagnostics.view",
    "products.view",
    "customers.view",
    "users.manage"
  ],
  Analyst: permissions.filter((permission) => permission.endsWith(".view"))
};
export function can(role, permission) {
  return !permission || !!role && rolePermissions[role].includes(permission);
}
