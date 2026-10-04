import { readDemo, writeDemo } from "./repository.js";
import { appConfig } from "../config/app.js";
export const demoUsers = [
  {
    id: "u1",
    name: "Demo Administrator",
    email: "superadmin@example.com",
    role: "Super Admin"
  },
  {
    id: "u2",
    name: "Demo Operations",
    email: "operations@example.com",
    role: "Operations Manager"
  },
  {
    id: "u3",
    name: "Demo Pharmacy",
    email: "pharmacy@example.com",
    role: "Pharmacy Manager"
  },
  {
    id: "u4",
    name: "Demo Support",
    email: "support@example.com",
    role: "Customer Support Agent"
  },
  {
    id: "u5",
    name: "Demo Finance",
    email: "finance@example.com",
    role: "Finance Manager"
  },
  {
    id: "u6",
    name: "Demo Vendor",
    email: "vendor@example.com",
    role: "Vendor"
  }
];
export const authService = {
  async login(email, password) {
    const user = [
      ...demoUsers,
      ...readDemo("registered-users", [])
    ].find((user2) => user2.email === email.trim().toLowerCase());
    if (!user || password !== appConfig.demoPassword)
      throw new Error("Invalid demo credentials");
    return user;
  },
  async register(name, email, password) {
    if (!name.trim() || !email.includes("@") || password.length < 12)
      throw new Error("Required field");
    if ([...demoUsers, ...readDemo("registered-users", [])].some(
      (user2) => user2.email === email.trim().toLowerCase()
    ))
      throw new Error("Email already exists");
    const user = {
      id: "demo-" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: "Analyst"
    };
    writeDemo("registered-users", [
      ...readDemo("registered-users", []),
      user
    ]);
    return user;
  },
  async requestRecovery(email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      throw new Error("Invalid email address");
  },
  async resetPassword(password) {
    if (password.length < 12) throw new Error("Use at least 12 characters.");
  },
  async changePassword(email, currentPassword, newPassword) {
    await authService.login(email, currentPassword);
    await authService.resetPassword(newPassword);
    if (currentPassword === newPassword)
      throw new Error("Choose a different new password.");
  },
  async enableTwoFactor(email, code) {
    if (!await authService.verify(code))
      throw new Error("Invalid verification code");
    await authService.requestRecovery(email);
    writeDemo("two-factor-preferences", {
      ...readDemo("two-factor-preferences", {}),
      [email.trim().toLowerCase()]: true
    });
  },
  async verify(code) {
    return code === appConfig.demoOtp;
  }
};
export function homeForRole(role) {
  const routes = {
    "Pharmacy Manager": "/dashboard/pharmacy",
    "Diagnostics Manager": "/dashboard/diagnostics",
    "Inventory Manager": "/dashboard/inventory",
    "Procurement Manager": "/inventory/stock",
    "Doctor Operations": "/doctors/appointments",
    "Customer Support Agent": "/dashboard/support",
    "Customer Support Manager": "/dashboard/support",
    "Finance Manager": "/dashboard/finance",
    "Marketing Manager": "/dashboard/marketing",
    "Delivery Manager": "/dashboard/logistics",
    Vendor: "/dashboard/vendor",
    Seller: "/dashboard/vendor",
    "Content Manager": "/content/pages",
    "Compliance Manager": "/pharmacy/prescriptions"
  };
  return routes[role] ?? "/dashboard/executive";
}
