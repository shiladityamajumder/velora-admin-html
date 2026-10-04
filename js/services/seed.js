import {
  emptyRecord
} from "../config/modules.js";
const customers = [
  "Demo Asha Roy",
  "Demo Arjun Mehta",
  "Demo Nila Sen",
  "Demo Kabir Das",
  "Demo Mira Rao",
  "Demo Rohan Shah"
];
const cities = ["Kolkata", "Mumbai", "Bengaluru", "Delhi", "Chennai", "Pune"];
const medicines = [
  "Demo Vitamin C 500",
  "Demo Wellness Tablets",
  "Demo First Aid Kit",
  "Demo Digital Thermometer",
  "Demo ORS Sachets",
  "Demo Care Supplement"
];
const warehouses = [
  "Kolkata Central",
  "Mumbai West",
  "Delhi North",
  "Bengaluru South"
];
const names = {
  customers,
  movements: ["Demo inbound stock", "Demo outbound stock"],
  transfers: ["Warehouse replenishment transfer", "Regional stock transfer"],
  adjustments: ["Cycle count adjustment", "Demo stock correction"],
  products: medicines,
  orders: [
    "Healthcare essentials",
    "Wellness refill",
    "Family care bundle",
    "Monthly supplies"
  ],
  inventory: medicines,
  vendors: [
    "Demo Care Distributors",
    "Demo Wellness Supply",
    "Demo Pharma Wholesale",
    "Demo Lab Partners"
  ],
  crm: [
    "Demo Horizon Clinic",
    "Demo Retail Partnership",
    "Demo Corporate Wellness",
    "Demo Care Network"
  ],
  tickets: [
    "Delivery status query",
    "Invoice correction request",
    "Damaged packaging",
    "Refund follow-up"
  ],
  prescriptions: ["Demo prescription document"],
  bookings: ["Annual screening", "Demo wellness check", "Routine test booking"],
  appointments: ["Demo consultation", "Scheduled follow-up"],
  procurement: [
    "Monthly replenishment",
    "Warehouse restocking",
    "Seasonal supplies"
  ],
  shipments: ["Healthcare parcel", "Wellness package", "Warehouse dispatch"],
  finance: [
    "Order payment",
    "Vendor settlement",
    "Demo adjustment",
    "Customer refund"
  ],
  campaigns: [
    "Wellness Week",
    "New Customer Welcome",
    "Care Essentials",
    "Loyalty Rewards"
  ],
  content: [
    "About the demo company",
    "Delivery information",
    "Wellness guide",
    "Frequently asked questions"
  ],
  tasks: [
    "Follow up with lead",
    "Review warehouse report",
    "Resolve support queue",
    "Prepare monthly summary"
  ]
};
const directoryNames = {
  "commerce/categories": [
    "Wellness",
    "Personal Care",
    "Medical Devices",
    "First Aid"
  ],
  "commerce/brands": ["Demo Care", "Demo Wellness", "Demo Health"],
  "commerce/manufacturers": ["Demo Care Manufacturing", "Demo Lab Industries"],
  "commerce/medicine-types": ["Tablet", "Capsule", "Liquid", "Topical"],
  "commerce/units": ["Pack", "Bottle", "Strip", "Unit"],
  "commerce/attributes": ["Strength", "Pack size", "Storage", "Color"],
  "commerce/reviews": [
    "Demo review \xB7 reliable delivery",
    "Demo review \xB7 good packaging"
  ],
  "commerce/questions": ["What is the pack size?", "Is the item in stock?"],
  "diagnostics/tests": [
    "Demo CBC Test",
    "Demo Lipid Panel",
    "Demo Wellness Screen"
  ],
  "diagnostics/packages": ["Demo Annual Wellness", "Demo Basic Screening"],
  "diagnostics/labs": ["Demo Kolkata Lab", "Demo Mumbai Lab"],
  "diagnostics/centers": ["Demo Central Collection", "Demo North Collection"],
  "diagnostics/phlebotomists": ["Demo Collector One", "Demo Collector Two"],
  "diagnostics/reports": ["Demo booking report", "Synthetic report metadata"],
  "doctors/directory": ["Dr. Demo Sen", "Dr. Demo Mehta", "Dr. Demo Rao"],
  "doctors/specializations": ["General Medicine", "Dermatology", "Pediatrics"],
  "doctors/clinics": ["Demo Care Central", "Demo Care West"],
  "doctors/availability": ["Morning appointments", "Afternoon appointments"],
  "inventory/warehouses": warehouses,
  "warehouse/zones": ["Receiving zone", "Picking zone", "Dispatch zone"],
  "warehouse/racks": ["Rack A1", "Rack B2", "Rack C3"],
  "warehouse/bins": ["Bin A-01", "Bin A-02", "Bin B-01"],
  "warehouse/trays": ["Tray 01", "Tray 02"],
  "warehouse/picking": ["Pick list NX-1001", "Pick list NX-1002"],
  "warehouse/packing": ["Pack station 01", "Pack station 02"],
  "warehouse/dispatch": ["Dispatch morning shift", "Dispatch evening shift"],
  "support/agents": ["Demo Support One", "Demo Support Two"],
  "support/teams": ["Order Support", "Payment Support", "General Support"],
  "support/responses": ["Delivery acknowledgement", "Refund acknowledgement"],
  "support/categories": ["Order Query", "Payment Query", "Product Query"],
  "logistics/partners": ["Demo Express", "Demo Health Logistics", "Demo Local"],
  "logistics/zones": ["East Zone", "West Zone", "South Zone"],
  "logistics/pincodes": ["700001", "400001", "560001"],
  "logistics/returns": [
    "Demo return request NX-1001",
    "Demo return request NX-1002"
  ],
  "admin/users": ["Demo Administrator", "Demo Operations", "Demo Support"],
  "admin/teams": ["Operations", "Customer Care", "Finance"],
  "admin/sessions": ["Demo Chrome session", "Demo Mobile session"],
  "admin/login-history": ["Demo sign-in record", "Demo role switch"],
  "apps/files": [
    "Demo product catalogue.csv",
    "Demo operations report.txt",
    "Demo brand guidelines.txt"
  ]
};
export function seedModule(module) {
  const records = directoryNames[module.path] ?? names[module.kind] ?? [module.title];
  const count = module.kind === "directory" ? records.length : 24;
  return Array.from({ length: count }, (_, i) => {
    const date = `2026-09-${String(i % 28 + 1).padStart(2, "0")}`;
    const customer = customers[i % customers.length], city = cities[i % cities.length];
    const base = emptyRecord(module);
    let values = {};
    switch (module.kind) {
      case "products": {
        const product = {
          sku: "DEMO-SKU-" + (1001 + i),
          category: i % 2 ? "Wellness" : "Medical Devices",
          brand: "Demo Care",
          manufacturer: "Demo Care Manufacturing",
          genericName: "Synthetic catalogue item",
          dosageForm: "Demo pack",
          strength: "Demo 500",
          packSize: "10 units",
          mrp: 120 + i * 45,
          price: 99 + i * 40,
          tax: 12,
          stock: i % 5 === 0 ? 0 : 15 + i * 7,
          prescriptionRequired: i % 3 === 0,
          storage: "Follow demo label instructions",
          tags: "demo, healthcare",
          media: "",
          attributes: "Pack size: 10\nColor: neutral",
          variants: "Standard pack\nFamily pack",
          weight: 100,
          seo: "Synthetic healthcare catalogue demonstration",
          notes: "Synthetic product. Not medical advice."
        };
        values = product;
        break;
      }
      case "customers": {
        const value = {
          address: `Demo Building ${i + 1}, Example Road, ${city}`,
          pincode: "000000",
          email: `customer${i + 1}@example.com`,
          phone: `00000${String(i + 1).padStart(5, "0")}`,
          city,
          segment: ["Retail", "Loyal", "Corporate", "New"][i % 4],
          wallet: i * 150,
          loyalty: i * 25,
          notes: "Synthetic customer; no real patient information."
        };
        values = value;
        break;
      }
      case "orders":
        values = {
          customer,
          email: `customer${i + 1}@example.com`,
          city,
          address: `Demo Building ${i + 1}, Example Road, ${city}, 000000`,
          amount: 499 + i * 120,
          discount: 20,
          tax: 54,
          paymentMethod: ["UPI", "Card", "COD", "Wallet"][i % 4],
          paymentStatus: i % 3 ? "Paid" : "Pending",
          items: `2 \xD7 ${medicines[i % 6]} \xB7 \u20B9${(499 + i * 120) / 2}`,
          tracking: "DEMO-TRACK-" + (1001 + i),
          notes: "Synthetic order for template demonstration."
        };
        break;
      case "inventory":
        values = {
          sku: "DEMO-SKU-" + (1001 + i),
          batch: "BATCH-DEMO-" + (1001 + i),
          manufactureDate: "2026-03-01",
          expiryDate: i % 5 === 0 ? "2026-09-20" : i % 3 === 0 ? "2026-10-20" : "2027-09-01",
          warehouse: warehouses[i % 4],
          quantity: i % 5 === 0 ? 0 : 20 + i * 8,
          reserved: i % 5 === 0 ? 0 : 5,
          purchasePrice: 65 + i * 20,
          mrp: 120 + i * 45,
          notes: "Synthetic batch. Expiry badges use the current date."
        };
        break;
      case "movements":
        values = {
          sku: "DEMO-SKU-" + (1001 + i),
          batch: "BATCH-DEMO-" + (1001 + i),
          warehouse: warehouses[i % 4],
          previousQuantity: 100 + i * 8,
          quantity: 90 + i * 8,
          change: -10,
          reference: "DEMO-MOVE-" + (1001 + i),
          notes: "Synthetic historical stock movement."
        };
        break;
      case "transfers":
        values = {
          sku: "DEMO-SKU-" + (1002 + i % 23),
          batch: "BATCH-DEMO-" + (1002 + i % 23),
          sourceWarehouse: warehouses[(i % 23 + 1) % 4],
          destinationWarehouse: warehouses[(i % 23 + 2) % 4],
          quantity: 10,
          date,
          notes: "Completing this demo transfer updates the inventory batches."
        };
        break;
      case "adjustments":
        values = {
          sku: "DEMO-SKU-" + (1002 + i % 23),
          batch: "BATCH-DEMO-" + (1002 + i % 23),
          warehouse: warehouses[(i % 23 + 1) % 4],
          quantity: 100,
          date,
          notes: "Completing this demo adjustment applies the new absolute stock quantity."
        };
        break;
      case "vendors":
        values = {
          email: `vendor${i + 1}@example.com`,
          phone: "0000000000",
          city,
          commission: 8 + i % 8,
          amount: 18e3 + i * 1800,
          documents: "Demo business registration\nDemo tax registration",
          notes: "All business documents are synthetic."
        };
        break;
      case "crm":
        values = {
          email: `lead${i + 1}@example.com`,
          phone: "0000000000",
          owner: ["Demo Asha", "Demo Arjun", "Demo Mira"][i % 3],
          source: ["Website", "Referral", "Campaign", "Partner"][i % 4],
          value: 18e3 + i * 2200,
          probability: (i % 5 + 1) * 15,
          closeDate: "2026-11-15",
          notes: "Discuss the synthetic corporate wellness proposal."
        };
        break;
      case "tickets":
        values = {
          customer,
          email: `customer${i + 1}@example.com`,
          order: "NX-O" + (1001 + i),
          priority: ["Low", "Medium", "High", "Urgent"][i % 4],
          owner: ["Demo Support One", "Demo Support Two"][i % 2],
          channel: ["Email", "Chat", "Phone", "App"][i % 4],
          notes: "Please help with this demo order."
        };
        break;
      case "prescriptions":
        values = {
          customer,
          order: "NX-O" + (1001 + i),
          owner: "Demo Reviewer",
          document: "SYNTHETIC DOCUMENT\nReference: DEMO-RX-" + (1001 + i) + "\nExample administrative upload\nNo patient data or clinical instructions",
          notes: "For administrative workflow demonstration only."
        };
        break;
      case "bookings":
        values = {
          customer,
          test: ["Demo CBC", "Demo Lipid Panel", "Demo Annual Wellness"][i % 3],
          lab: "Demo " + city + " Lab",
          collection: i % 2 ? "Home" : "Lab visit",
          date: "2026-10-" + String(i % 20 + 3).padStart(2, "0"),
          owner: "Demo Collector",
          amount: 599 + i * 80,
          notes: "Synthetic booking; reports are demo metadata."
        };
        break;
      case "appointments":
        values = {
          customer,
          doctor: ["Dr. Demo Sen", "Dr. Demo Mehta", "Dr. Demo Rao"][i % 3],
          specialization: "General Medicine",
          date: "2026-10-" + String(i % 20 + 3).padStart(2, "0"),
          time: i % 2 ? "10:30" : "14:00",
          clinic: "Demo Care " + city,
          amount: 500,
          notes: "Synthetic appointment, no real consultation."
        };
        break;
      case "procurement":
        values = {
          vendor: "Demo Care Distributors",
          warehouse: warehouses[i % 4],
          quantity: 100 + i * 20,
          amount: 15e3 + i * 1500,
          date,
          notes: "Demo replenishment workflow."
        };
        break;
      case "shipments":
        values = {
          order: "NX-O" + (1001 + i),
          customer,
          carrier: ["Demo Express", "Demo Health Logistics", "Demo Local"][i % 3],
          tracking: "DEMO-TRACK-" + (1001 + i),
          city,
          date,
          notes: "Synthetic shipment; external carrier not connected."
        };
        break;
      case "finance":
        values = {
          order: "NX-O" + (1001 + i),
          customer,
          amount: 499 + i * 120,
          method: ["UPI", "Card", "COD", "Wallet"][i % 4],
          reference: "DEMO-PAY-" + (1001 + i),
          date,
          notes: "Local financial record; no actual payment or payout."
        };
        break;
      case "campaigns":
        values = {
          type: ["Coupon", "Email", "Push", "Banner", "Referral"][i % 5],
          audience: ["All", "New", "Loyal", "Corporate"][i % 4],
          discount: 10 + i % 15,
          usageLimit: 500,
          startDate: "2026-10-01",
          endDate: "2026-11-01",
          budget: 5e3 + i * 1e3,
          notes: "Demo campaign; no outgoing communication."
        };
        break;
      case "content":
        values = {
          slug: "demo-content-" + (i + 1),
          category: "Company",
          author: "Demo Editor",
          content: "Welcome to the synthetic NexaPanel demonstration. This content can be edited and previewed locally.",
          seo: "Demo template page",
          notes: "Local CMS draft."
        };
        break;
      case "tasks":
        values = {
          owner: "Demo Operations",
          priority: ["Low", "Medium", "High"][i % 3],
          date: "2026-10-15",
          notes: "Follow up on this demo task."
        };
        break;
      default:
        values = {
          category: module.title,
          location: city,
          owner: "Demo Administrator",
          email: `demo${i + 1}@example.com`,
          phone: "0000000000",
          notes: "Synthetic " + module.title.toLowerCase() + " record. Editable demo metadata."
        };
    }
    return {
      ...base,
      ...values,
      id: "NX-" + (module.kind === "orders" ? "O" : module.kind.slice(0, 2).toUpperCase()) + (1001 + i),
      name: records[i % records.length] + (count > records.length ? " \xB7 " + (i + 1) : ""),
      status: module.statuses[i % module.statuses.length],
      createdAt: date + "T08:00:00.000Z"
    };
  });
}
