export interface OrderMilestone {
  stage: string;
  stageHi: string;
  completed: boolean;
  date?: string;
  note?: string;
}

export interface B2BOrder {
  id: string;
  product_id: string;
  product_name: string;
  product_name_hi?: string;
  product_image: string;
  craft: string;
  material?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  buyer_name: string;
  buyer_type: "Institutional" | "Enterprise" | "Retailer" | "Exporter";
  artisan_id: string;
  artisan_name: string;
  cluster_id: string;
  cluster_name: string;
  status: "pending" | "on_the_way" | "completed";
  created_at: string;
  lead_time_days: number;
  estimated_delivery: string;
  tracking_number?: string;
  shipping_carrier?: string;
  destination: string;
  milestones: OrderMilestone[];
  notes?: string;
}

const DEFAULT_ORDERS: B2BOrder[] = [
  {
    id: "ORD-B2B-8941",
    product_id: "PROD_bamboo_basket_01",
    product_name: "Handwoven Hexagonal Lattice Bamboo Storage Basket",
    product_name_hi: "हस्तनिर्मित षट्कोणीय बांस की टोकरी",
    product_image: "https://images.unsplash.com/photo-1675081632939-5294f776dd75?auto=format&fit=crop&w=800&q=80",
    craft: "Bamboo & Cane Craft",
    material: "Natural Moso Bamboo & Rattan Cane",
    quantity: 250,
    unit_price: 450,
    total_price: 112500,
    buyer_name: "FabIndia Enterprise Sourcing",
    buyer_type: "Enterprise",
    artisan_id: "ART001",
    artisan_name: "Rameshwar Kumbhar",
    cluster_id: "CL_WB_BANKURA",
    cluster_name: "Bankura Artisan Guild",
    status: "pending",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    lead_time_days: 14,
    estimated_delivery: new Date(Date.now() + 86400000 * 12).toISOString(),
    destination: "FabIndia Distribution Hub, Gurgaon, Haryana",
    notes: "Batch require unvarnished natural herbal brine curing. Pre-shipment sample approved.",
    milestones: [
      { stage: "Order Confirmed & Escrow Funded", stageHi: "ऑर्डर पुष्ट व एस्क्रो फंडेड", completed: true, date: "2 days ago" },
      { stage: "Cluster Raw Material Allocation", stageHi: "क्लस्टर कच्चा माल आवंटन", completed: true, date: "Yesterday" },
      { stage: "Artisan Weaving in Progress", stageHi: "कारीगर बुनाई कार्य प्रगति पर", completed: false, note: "60/250 units woven" },
      { stage: "QC Inspection & Dispatch", stageHi: "गुणवत्ता निरीक्षण व प्रेषण", completed: false },
      { stage: "Delivered to Warehouse", stageHi: "गोदाम में डिलीवरी", completed: false },
    ],
  },
  {
    id: "ORD-B2B-7420",
    product_id: "PROD_15e690bec0",
    product_name: "Handcrafted Earthen Terracotta Sculpted Pitcher",
    product_name_hi: "प्राकृतिक शीतलक टेराकोटा जलपात्र",
    product_image: "/images/artisan-potter-hero.png",
    craft: "Terracotta & Pottery",
    material: "Natural Alluvial River Clay",
    quantity: 300,
    unit_price: 420,
    total_price: 126000,
    buyer_name: "The Oberoi Group Luxury Living",
    buyer_type: "Institutional",
    artisan_id: "ART001",
    artisan_name: "Rameshwar Kumbhar",
    cluster_id: "CL_WB_BANKURA",
    cluster_name: "Bankura Artisan Guild",
    status: "on_the_way",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    lead_time_days: 10,
    estimated_delivery: new Date(Date.now() + 86400000 * 2).toISOString(),
    tracking_number: "BD-EXP-98214432-IN",
    shipping_carrier: "BlueDart Artisanal Express Logistics",
    destination: "Oberoi Rajvilas, Goner Road, Jaipur, Rajasthan",
    notes: "Double-walled corrugated protective packaging with zero-plastic straw cushioning.",
    milestones: [
      { stage: "Order Confirmed & Escrow Funded", stageHi: "ऑर्डर पुष्ट व एस्क्रो फंडेड", completed: true, date: "8 days ago" },
      { stage: "Kiln Firing & Slow Cooling", stageHi: "भट्टी पकाई व प्राकृतिक शीतलन", completed: true, date: "4 days ago" },
      { stage: "Zero-Defect Water Leakage QC Passed", stageHi: "शून्य-दोष जल रिसाव परीक्षण सफल", completed: true, date: "Yesterday" },
      { stage: "Dispatched — In Transit (On the Way)", stageHi: "प्रेषित — मार्ग में (रास्ते में)", completed: true, date: "Today morning", note: "Out for transit, ETA 48 hrs" },
      { stage: "Delivered to Resort Hub", stageHi: "रिसॉर्ट हब में डिलीवरी", completed: false },
    ],
  },
  {
    id: "ORD-B2B-6190",
    product_id: "PROD_dhokra_cast_01",
    product_name: "Dhokra Lost-Wax Cast Bell Metal Figurine",
    product_name_hi: "ढोकरा प्राचीन खोया-मोम धातु शिल्प",
    product_image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
    craft: "Dhokra & Metal Craft",
    material: "Brass & Bell Metal Alloy",
    quantity: 80,
    unit_price: 1250,
    total_price: 100000,
    buyer_name: "National Crafts Museum & Emporium",
    buyer_type: "Institutional",
    artisan_id: "ART001",
    artisan_name: "Rameshwar Kumbhar",
    cluster_id: "CL_WB_BANKURA",
    cluster_name: "Bankura Artisan Guild",
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 22).toISOString(),
    lead_time_days: 20,
    estimated_delivery: new Date(Date.now() - 86400000 * 2).toISOString(),
    tracking_number: "IN-POST-ART-881290-DEL",
    shipping_carrier: "India Post Speed Post Cargo",
    destination: "Crafts Museum, Pragati Maidan, Bhairon Marg, New Delhi",
    notes: "Delivered in mint archival condition with signed artisan provenance certificate.",
    milestones: [
      { stage: "Order Confirmed & Escrow Funded", stageHi: "ऑर्डर पुष्ट व एस्क्रो फंडेड", completed: true, date: "22 days ago" },
      { stage: "Wax Model Sculpting & Molten Casting", stageHi: "मोम ढलाई व धातु शोधन", completed: true, date: "14 days ago" },
      { stage: "Artisan Finishing & QC Passed", stageHi: "शिल्पकार परिष्करण व गुणवत्ता परीक्षण", completed: true, date: "6 days ago" },
      { stage: "Dispatched from Bastar Cluster", stageHi: "क्लस्टर से प्रेषित", completed: true, date: "4 days ago" },
      { stage: "Delivered & Funds Released to Artisan", stageHi: "सफलतापूर्वक प्राप्त व राशि सीधे कारीगर को हस्तांतरित", completed: true, date: "2 days ago" },
    ],
  },
];

export function getStoredB2BOrders(): B2BOrder[] {
  if (typeof window === "undefined") return DEFAULT_ORDERS;
  try {
    const raw = localStorage.getItem("artkala_b2b_orders");
    if (!raw) {
      localStorage.setItem("artkala_b2b_orders", JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ORDERS;
  } catch {
    return DEFAULT_ORDERS;
  }
}

export function saveStoredB2BOrders(orders: B2BOrder[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("artkala_b2b_orders", JSON.stringify(orders));
  } catch {}
}

export function createB2BOrder(order: Partial<B2BOrder>): B2BOrder {
  const current = getStoredB2BOrders();
  const idNum = Math.floor(1000 + Math.random() * 9000);
  const newOrder: B2BOrder = {
    id: order.id || `ORD-B2B-${idNum}`,
    product_id: order.product_id || "PROD_15e690bec0",
    product_name: order.product_name || "Handcrafted Artisan Product",
    product_name_hi: order.product_name_hi,
    product_image: order.product_image || "/images/artisan-potter-hero.png",
    craft: order.craft || "Artisan Craft",
    material: order.material || "Natural Materials",
    quantity: order.quantity || 200,
    unit_price: order.unit_price || 420,
    total_price: (order.quantity || 200) * (order.unit_price || 420),
    buyer_name: order.buyer_name || "Institutional Procurement Buyer",
    buyer_type: order.buyer_type || "Institutional",
    artisan_id: order.artisan_id || "ART001",
    artisan_name: order.artisan_name || "Rameshwar Kumbhar",
    cluster_id: order.cluster_id || "CL_WB_BANKURA",
    cluster_name: order.cluster_name || "Bankura Artisan Guild",
    status: order.status || "pending",
    created_at: new Date().toISOString(),
    lead_time_days: order.lead_time_days || 14,
    estimated_delivery: new Date(Date.now() + 86400000 * 14).toISOString(),
    destination: order.destination || "Central Procurement Warehouse, New Delhi",
    notes: order.notes || "Wholesale B2B enquiry initiated from product catalog.",
    milestones: [
      { stage: "B2B Order Enquiry Placed", stageHi: "थोक ऑर्डर पूछताछ दर्ज", completed: true, date: "Just now" },
      { stage: "Cluster Allocation & Raw Material Staging", stageHi: "क्लस्टर आवंटन व कच्चा माल व्यवस्था", completed: false },
      { stage: "Artisan Guild Handcrafting", stageHi: "कारीगर गिल्ड द्वारा हस्तनिर्माण", completed: false },
      { stage: "Inspection & Transit (On the Way)", stageHi: "निरीक्षण व प्रेषण (रास्ते में)", completed: false },
      { stage: "Fulfillment & Delivery", stageHi: "वितरण व अंतिम डिलीवरी", completed: false },
    ],
  };

  const updated = [newOrder, ...current.filter((o) => o.id !== newOrder.id)];
  saveStoredB2BOrders(updated);
  return newOrder;
}

export function updateB2BOrderStatus(
  orderId: string,
  newStatus: "pending" | "on_the_way" | "completed"
): B2BOrder | null {
  const current = getStoredB2BOrders();
  const index = current.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  const target = current[index];
  const updatedMilestones = [...target.milestones];

  if (newStatus === "on_the_way") {
    updatedMilestones.forEach((m, i) => {
      if (i <= 3) m.completed = true;
    });
  } else if (newStatus === "completed") {
    updatedMilestones.forEach((m) => {
      m.completed = true;
    });
  }

  const updated: B2BOrder = {
    ...target,
    status: newStatus,
    tracking_number: target.tracking_number || (newStatus === "on_the_way" ? `BD-TRK-${Math.floor(100000 + Math.random() * 900000)}` : target.tracking_number),
    shipping_carrier: target.shipping_carrier || "Artisanal Logistics Network",
    milestones: updatedMilestones,
  };

  current[index] = updated;
  saveStoredB2BOrders(current);
  return updated;
}
