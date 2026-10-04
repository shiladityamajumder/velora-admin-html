export const initialProducts = [
  {
    id: "p1",
    name: "Smart Watch",
    category: "Wearables",
    price: 89.99,
    stock: 120,
    rating: 4.5,
    emoji: "\u231A"
  },
  {
    id: "p2",
    name: "Bluetooth Speaker",
    category: "Audio",
    price: 49.99,
    stock: 85,
    rating: 4.8,
    emoji: "\u{1F50A}"
  },
  {
    id: "p3",
    name: "Running Shoes",
    category: "Footwear",
    price: 69.99,
    stock: 12,
    rating: 4.4,
    emoji: "\u{1F45F}"
  },
  {
    id: "p4",
    name: "Studio Headphones",
    category: "Audio",
    price: 249,
    stock: 284,
    rating: 4.6,
    emoji: "\u{1F3A7}"
  },
  {
    id: "p5",
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 139,
    stock: 842,
    rating: 4.7,
    emoji: "\u2328\uFE0F"
  },
  {
    id: "p6",
    name: "Desk Lamp Pro",
    category: "Lighting",
    price: 89,
    stock: 0,
    rating: 4.2,
    emoji: "\u{1F4A1}"
  }
];
export const initialInvoices = [
  {
    id: "INV-2048",
    client: "Northstar Labs",
    date: "2026-10-03",
    amount: 12480,
    status: "Paid"
  },
  {
    id: "INV-2047",
    client: "Helios Systems",
    date: "2026-10-02",
    amount: 8920,
    status: "Pending"
  },
  {
    id: "INV-2046",
    client: "Vertex Retail",
    date: "2026-09-28",
    amount: 4260,
    status: "Paid"
  },
  {
    id: "INV-2045",
    client: "BluePeak Health",
    date: "2026-09-25",
    amount: 6700,
    status: "Overdue"
  },
  {
    id: "INV-2044",
    client: "CloudCore",
    date: "2026-09-22",
    amount: 3180,
    status: "Paid"
  }
];
export const initialProfile = {
  firstName: "Shiladitya",
  lastName: "Majumder",
  email: "admin@example.com",
  role: "Administrator",
  timezone: "Asia/Kolkata",
  bio: "Workspace administrator.",
  location: "Kolkata, India",
  twoFactor: true
};
export const money = (value, decimals = 2) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals
}).format(value);
export function productStatus(product) {
  return product.stock === 0 ? "Out of stock" : product.stock < 25 ? "Low stock" : "Active";
}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function numberFromInput(value, label) {
  const parsed = Number(value.replace(/[$,]/g, ""));
  if (!value.trim() || !Number.isFinite(parsed) || parsed < 0)
    throw new Error(`${label} must be a valid nonnegative number.`);
  return parsed;
}
export const initialKitchenOrders = [
  {
    id: "ORD-1052",
    customer: "Sophia Loren",
    channel: "Dine-in \xB7 Table 8",
    items: "1\xD7 Alfredo, 1\xD7 Garlic Bread",
    status: "Placed"
  },
  {
    id: "ORD-1051",
    customer: "Emily Carter",
    channel: "Delivery",
    items: "2\xD7 Truffle Burger, 1\xD7 Matcha Latte",
    status: "Placed"
  },
  {
    id: "ORD-1048",
    customer: "Sarah Jenkins",
    channel: "Dine-in \xB7 Table 5",
    items: "2\xD7 Classic Burger, 1\xD7 Truffle Fries",
    status: "Preparing"
  },
  {
    id: "ORD-1047",
    customer: "Marcus Aurelius",
    channel: "Takeaway",
    items: "1\xD7 Pepperoni Pizza, 1\xD7 Caesar Salad",
    status: "Ready"
  },
  {
    id: "ORD-1046",
    customer: "David Miller",
    channel: "Takeaway",
    items: "3\xD7 Spicy Tuna Roll, 1\xD7 Miso",
    status: "Completed"
  }
];
