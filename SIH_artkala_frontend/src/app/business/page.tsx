"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Send,
  ShieldCheck,
  AlertCircle,
  FileText,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  User,
  Sliders,
  DollarSign,
  Package,
  Calendar,
  X,
  Printer,
  ChevronRight,
  Info,
  Clock,
  MapPin,
  ExternalLink,
  Check,
  SlidersHorizontal,
  ChevronDown,
  Award,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { HunarCapabilityTwin } from "@/components/artisan/HunarCapabilityTwin";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { createRequirement, runMatching } from "@/lib/api/buyers";
import type { BuyerRequirement, MatchResult } from "@/types";

export interface ClusterArtisan {
  id: string;
  name: string;
  nameHi: string;
  role: string;
  roleHi: string;
  location: string;
  locationHi: string;
  craftKey: string;
  capacityLimit: number; // monthly operational ceiling
  availableBuffer: number;
  leadDays: number;
  experienceYears: number;
  verificationBadge: string;
  verificationBadgeHi: string;
  lastQcAudit: string;
}

export interface CraftClusterRule {
  id: string;
  keywords: string[];
  craft: string;
  craftHi: string;
  product: string;
  productHi: string;
  cluster: string;
  clusterHi: string;
  baseCapacity: number;
  costFloor: number;
  leadDays: number;
  artisans: ClusterArtisan[];
}

export interface OrderPlacedRecord {
  orderId: string;
  placedAt: string;
  buyerName: string;
  organization: string;
  deliveryAddress: string;
  product: string;
  craft: string;
  clusterName: string;
  totalQuantity: number;
  targetPrice: number;
  totalAmount: number;
  leadDays: number;
  artisanBreakdown: {
    artisanId: string;
    artisanName: string;
    artisanNameHi: string;
    location: string;
    locationHi: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    trackingToken: string;
    leadDays: number;
    estimatedDispatchDate: string;
  }[];
}

// Authentic craft validation rules & constituent cluster artisans
const CRAFT_RULES: CraftClusterRule[] = [
  {
    id: "CL_BAMBOO_01",
    keywords: ["bamboo", "cane", "rattan", "wicker", "basket", "बांस", "बेंत", "टोकरी", "दौरा"],
    craft: "Bamboo & Cane Craft",
    craftHi: "बांस एवं बेंत शिल्प",
    product: "Handcrafted Bamboo Storage Basket",
    productHi: "हस्तनिर्मित बांस भंडारण टोकरी",
    cluster: "Maharashtra & Assam Bamboo Clusters",
    clusterHi: "महाराष्ट्र एवं असम बांस शिल्प समूह",
    baseCapacity: 600,
    costFloor: 280,
    leadDays: 16,
    artisans: [
      {
        id: "ART_BAM_01",
        name: "Devendra Barman",
        nameHi: "देवेन्द्र बर्मन",
        role: "Master Bamboo Artisan",
        roleHi: "मास्टर बांस शिल्पकार",
        location: "Nalbari Cluster Guild, Assam",
        locationHi: "नलबाड़ी क्लस्टर गिल्ड, असम",
        craftKey: "basketry",
        capacityLimit: 180,
        availableBuffer: 150,
        leadDays: 14,
        experienceYears: 18,
        verificationBadge: "Confirmed (GIS Geo-Tagged Studio)",
        verificationBadgeHi: "पुष्ट (जीआईएस जिओ-टैग कार्यशाला)",
        lastQcAudit: "QC_AUDIT_AS_2026_112",
      },
      {
        id: "ART_BAM_02",
        name: "Kamala Baiga",
        nameHi: "कमला बैगा",
        role: "Senior Weaving Artisan",
        roleHi: "वरिष्ठ बुनाई कारीगर",
        location: "Chandrapur Cluster Guild, Maharashtra",
        locationHi: "चंद्रपुर क्लस्टर गिल्ड, महाराष्ट्र",
        craftKey: "basketry",
        capacityLimit: 220,
        availableBuffer: 180,
        leadDays: 16,
        experienceYears: 14,
        verificationBadge: "Confirmed (State Awardee)",
        verificationBadgeHi: "पुष्ट (राज्य पुरस्कार प्राप्त)",
        lastQcAudit: "QC_AUDIT_MH_2026_882",
      },
      {
        id: "ART_BAM_03",
        name: "Biren Das",
        nameHi: "बिरेन दास",
        role: "Guild Craft Leader",
        roleHi: "गिल्ड शिल्प प्रमुख",
        location: "Barpeta Cluster Guild, Assam",
        locationHi: "बारपेटा क्लस्टर गिल्ड, असम",
        craftKey: "basketry",
        capacityLimit: 200,
        availableBuffer: 160,
        leadDays: 15,
        experienceYears: 22,
        verificationBadge: "Confirmed (Interlocking Joint Certified)",
        verificationBadgeHi: "पुष्ट (इंटरलॉकिंग जोड़ प्रमाणित)",
        lastQcAudit: "QC_AUDIT_AS_2026_094",
      },
    ],
  },
  {
    id: "CL_TERRACOTTA_02",
    keywords: ["pottery", "terracotta", "clay", "earthen", "matka", "handi", "pitcher", "मटका", "मिट्टी", "टेराकोटा", "घड़ा", "कुम्हार"],
    craft: "Terracotta & Pottery",
    craftHi: "टेराकोटा एवं मृदभांड शिल्प",
    product: "Earthen Terracotta Sculpted Vessel",
    productHi: "पारंपरिक टेराकोटा नक्काशीदार पात्र",
    cluster: "Bankura & Kutch Guilds",
    clusterHi: "बांकुरा एवं कच्छ टेराकोटा गिल्ड",
    baseCapacity: 540,
    costFloor: 220,
    leadDays: 15,
    artisans: [
      {
        id: "ART_TER_01",
        name: "Rameshwar Kumbhar",
        nameHi: "रामेश्वर कुम्हार",
        role: "Master Potter & Guild President",
        roleHi: "मास्टर कुम्हार व गिल्ड अध्यक्ष",
        location: "Panchmura Guild, Bankura, West Bengal",
        locationHi: "पंचमुड़ा गिल्ड, बांकुरा, पश्चिम बंगाल",
        craftKey: "terracotta",
        capacityLimit: 200,
        availableBuffer: 160,
        leadDays: 12,
        experienceYears: 24,
        verificationBadge: "Confirmed (GI Certified Master)",
        verificationBadgeHi: "पुष्ट (जीआई प्रमाणित मास्टर)",
        lastQcAudit: "QC_TERRA_BANKURA_2026_409",
      },
      {
        id: "ART_TER_02",
        name: "Lakshmi Devi",
        nameHi: "लक्ष्मी देवी",
        role: "Senior Terracotta Sculptor",
        roleHi: "वरिष्ठ टेराकोटा मूर्तिकार",
        location: "Bishnupur Craft Node, Bankura, West Bengal",
        locationHi: "विष्णुपुर शिल्प नोड, बांकुरा, पश्चिम बंगाल",
        craftKey: "terracotta",
        capacityLimit: 160,
        availableBuffer: 130,
        leadDays: 14,
        experienceYears: 16,
        verificationBadge: "Confirmed (Lab Assay Passed)",
        verificationBadgeHi: "पुष्ट (लैब परख उत्तीर्ण)",
        lastQcAudit: "QC_TERRA_BNK_2026_718",
      },
      {
        id: "ART_TER_03",
        name: "Gopaldas Prajapati",
        nameHi: "गोपालदास प्रजापति",
        role: "Traditional Kiln Master",
        roleHi: "पारंपरिक भट्ठी मास्टर",
        location: "Bhuj Artisan Guild, Kutch, Gujarat",
        locationHi: "भुज कारीगर गिल्ड, कच्छ, गुजरात",
        craftKey: "terracotta",
        capacityLimit: 180,
        availableBuffer: 150,
        leadDays: 15,
        experienceYears: 20,
        verificationBadge: "Confirmed (Bio-Reduction Heat Certified)",
        verificationBadgeHi: "पुष्ट (बायो-रिडक्शन ताप प्रमाणित)",
        lastQcAudit: "QC_KUTCH_2026_330",
      },
    ],
  },
  {
    id: "CL_HANDLOOM_03",
    keywords: ["handloom", "textile", "weaving", "silk", "tussar", "cotton", "khadi", "saree", "dupatta", "shawl", "हथकरघा", "रेशम", "साड़ी", "खादी", "दुपट्टा"],
    craft: "Handloom & Textiles",
    craftHi: "हथकरघा एवं वस्त्र शिल्प",
    product: "Pure Handspun Tussar Silk Dupatta",
    productHi: "शुद्ध हस्तनिर्मित टसर सिल्क दुपट्टा",
    cluster: "Champa & Varanasi Weavers Guild",
    clusterHi: "चांपा एवं वाराणसी बुनकर गिल्ड",
    baseCapacity: 240,
    costFloor: 950,
    leadDays: 20,
    artisans: [
      {
        id: "ART_TEX_01",
        name: "Ramprasad Devangan",
        nameHi: "रामप्रसाद देवांगन",
        role: "Master Tussar Silk Weaver",
        roleHi: "मास्टर टसर सिल्क बुनकर",
        location: "Champa Weavers Guild, Chhattisgarh",
        locationHi: "चांपा बुनकर गिल्ड, छत्तीसगढ़",
        craftKey: "handloom",
        capacityLimit: 85,
        availableBuffer: 70,
        leadDays: 18,
        experienceYears: 22,
        verificationBadge: "Confirmed (Silk Mark India #SM_992)",
        verificationBadgeHi: "पुष्ट (सिल्क मार्क इंडिया #SM_992)",
        lastQcAudit: "QC_SILK_CG_2026_551",
      },
      {
        id: "ART_TEX_02",
        name: "Salma Khatun",
        nameHi: "सलमा खातून",
        role: "Master Brocade Weaver",
        roleHi: "मास्टर ब्रोकेड बुनकर",
        location: "Kashi Silk Weavers Node, Varanasi, UP",
        locationHi: "काशी सिल्क बुनकर नोड, वाराणसी, उत्तर प्रदेश",
        craftKey: "handloom",
        capacityLimit: 75,
        availableBuffer: 60,
        leadDays: 20,
        experienceYears: 19,
        verificationBadge: "Confirmed (Geographical Indication)",
        verificationBadgeHi: "पुष्ट (भौगोलिक उपदर्शन)",
        lastQcAudit: "QC_VARANASI_2026_883",
      },
      {
        id: "ART_TEX_03",
        name: "Govind Das",
        nameHi: "गोविंद दास",
        role: "Senior Handloom Weaver",
        roleHi: "वरिष्ठ हथकरघा बुनकर",
        location: "Bishnupur Baluchari Guild, West Bengal",
        locationHi: "विष्णुपुर बालूचरी गिल्ड, पश्चिम बंगाल",
        craftKey: "handloom",
        capacityLimit: 80,
        availableBuffer: 65,
        leadDays: 19,
        experienceYears: 17,
        verificationBadge: "Confirmed (Natural Dye Certified)",
        verificationBadgeHi: "पुष्ट (प्राकृतिक रंग प्रमाणित)",
        lastQcAudit: "QC_BALUCHARI_2026_219",
      },
    ],
  },
  {
    id: "CL_WOOD_04",
    keywords: ["wood", "carving", "teak", "sheesham", "sandalwood", "inlay", "toy", "channapatna", "लकड़ी", "काष्ठ", "नक्काशी"],
    craft: "Wood Carving & Inlay",
    craftHi: "काष्ठ नक्काशी एवं इनले शिल्प",
    product: "Hand-Carved Wooden Decorative Object",
    productHi: "हस्त-उत्कीर्ण काष्ठ सजावटी कलाकृति",
    cluster: "Saharanpur & Channapatna Guilds",
    clusterHi: "सहारनपुर एवं चन्नापटना शिल्प गिल्ड",
    baseCapacity: 270,
    costFloor: 480,
    leadDays: 18,
    artisans: [
      {
        id: "ART_WOD_01",
        name: "Mohammad Irfan",
        nameHi: "मोहम्मद इरफान",
        role: "Master Wood Inlay Craftsman",
        roleHi: "मास्टर काष्ठ इनले शिल्पकार",
        location: "Saharanpur Woodcraft Guild, UP",
        locationHi: "सहारनपुर काष्ठ शिल्प गिल्ड, उत्तर प्रदेश",
        craftKey: "woodcarving",
        capacityLimit: 100,
        availableBuffer: 85,
        leadDays: 16,
        experienceYears: 25,
        verificationBadge: "Confirmed (FSC Certified Timber)",
        verificationBadgeHi: "पुष्ट (एफएससी प्रमाणित काष्ठ)",
        lastQcAudit: "QC_SAHARANPUR_2026_402",
      },
      {
        id: "ART_WOD_02",
        name: "Chennappa Gowda",
        nameHi: "चेन्नप्पा गौड़ा",
        role: "Master Lacquerware Turner",
        roleHi: "मास्टर लाख खिलौना शिल्पकार",
        location: "Channapatna Craft Cluster, Karnataka",
        locationHi: "चन्नापटना शिल्प समूह, कर्नाटक",
        craftKey: "woodcarving",
        capacityLimit: 90,
        availableBuffer: 75,
        leadDays: 15,
        experienceYears: 21,
        verificationBadge: "Confirmed (Non-Toxic Vegetable Dyes)",
        verificationBadgeHi: "पुष्ट (अहानिकर वानस्पतिक रंग)",
        lastQcAudit: "QC_CHANNAPATNA_2026_661",
      },
      {
        id: "ART_WOD_03",
        name: "Rashid Ahmed",
        nameHi: "राशीद अहमद",
        role: "Senior Relief Carver",
        roleHi: "वरिष्ठ उभार नक्काशीकार",
        location: "Nagina Wood Cluster, Bijnor, UP",
        locationHi: "नगीना काष्ठ समूह, बिजनौर, उत्तर प्रदेश",
        craftKey: "woodcarving",
        capacityLimit: 80,
        availableBuffer: 65,
        leadDays: 18,
        experienceYears: 18,
        verificationBadge: "Confirmed (Hand Chisel Certification)",
        verificationBadgeHi: "पुष्ट (हस्त छेनी प्रमाणन)",
        lastQcAudit: "QC_NAGINA_2026_118",
      },
    ],
  },
  {
    id: "CL_DHOKRA_05",
    keywords: ["dhokra", "brass", "bronze", "metal", "bell metal", "lost wax", "tribal", "ढोकरा", "पीतल", "कांसा", "धातु"],
    craft: "Dhokra & Metal Craft",
    craftHi: "ढोकरा एवं धातु शिल्प",
    product: "Dhokra Lost-Wax Bell Metal Figurine",
    productHi: "ढोकरा लॉस्ट-वैक्स बेल मेटल कलाकृति",
    cluster: "Bastar & Dhenkanal Castings Guild",
    clusterHi: "बस्तर एवं ढेंकनाल धातु ढलाई गिल्ड",
    baseCapacity: 135,
    costFloor: 750,
    leadDays: 22,
    artisans: [
      {
        id: "ART_MET_01",
        name: "Sukhlal Jhara",
        nameHi: "सुखलाल झारा",
        role: "Master Bell Metal Caster",
        roleHi: "मास्टर बेल मेटल शिल्पकार",
        location: "Kondagaon Guild, Bastar, Chhattisgarh",
        locationHi: "कोंडागांव गिल्ड, बस्तर, छत्तीसगढ़",
        craftKey: "dhokra",
        capacityLimit: 50,
        availableBuffer: 42,
        leadDays: 20,
        experienceYears: 26,
        verificationBadge: "Confirmed (Tribal Heritage GI Certified)",
        verificationBadgeHi: "पुष्ट (जनजातीय धरोहर जीआई प्रमाणित)",
        lastQcAudit: "QC_BASTAR_2026_773",
      },
      {
        id: "ART_MET_02",
        name: "Bhagirathi Maharana",
        nameHi: "भागीरथी महाराणा",
        role: "Senior Lost-Wax Artisan",
        roleHi: "वरिष्ठ लॉस्ट-वैक्स शिल्पकार",
        location: "Sadeibarni Guild, Dhenkanal, Odisha",
        locationHi: "सदेईबरणी गिल्ड, ढेंकनाल, ओडिशा",
        craftKey: "dhokra",
        capacityLimit: 45,
        availableBuffer: 38,
        leadDays: 22,
        experienceYears: 20,
        verificationBadge: "Confirmed (Beeswax Core Certification)",
        verificationBadgeHi: "पुष्ट (मधुमक्खी मोम कोर प्रमाणन)",
        lastQcAudit: "QC_DHENKANAL_2026_819",
      },
      {
        id: "ART_MET_03",
        name: "Mangli Bai",
        nameHi: "मंगली बाई",
        role: "Traditional Tribal Sculptor",
        roleHi: "पारंपरिक जनजातीय मूर्तिकार",
        location: "Jagdalpur Cluster, Bastar, Chhattisgarh",
        locationHi: "जगदलपुर समूह, बस्तर, छत्तीसगढ़",
        craftKey: "dhokra",
        capacityLimit: 40,
        availableBuffer: 35,
        leadDays: 21,
        experienceYears: 16,
        verificationBadge: "Confirmed (Clay Core Assay Passed)",
        verificationBadgeHi: "पुष्ट (मिट्टी कोर परीक्षण उत्तीर्ण)",
        lastQcAudit: "QC_BASTAR_2026_902",
      },
    ],
  },
];

function BusinessContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialItemQuery = searchParams.get("item") || "";

  const [rawText, setRawText] = useState(initialItemQuery);
  const [buyerName, setBuyerName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnidentified, setIsUnidentified] = useState(false);
  const [requirement, setRequirement] = useState<BuyerRequirement | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  // Editable fields on the buyer end
  const [editableQuantity, setEditableQuantity] = useState<number>(300);
  const [editablePrice, setEditablePrice] = useState<number>(450);
  const [editableDeadline, setEditableDeadline] = useState<number>(24);
  const [matchedCraftData, setMatchedCraftData] = useState<CraftClusterRule | null>(null);

  // Exact Artisan Quantity Allocations (up to each artisan's capacity limit)
  const [artisanAllocations, setArtisanAllocations] = useState<Record<string, number>>({});
  const [limitExceededArtisanId, setLimitExceededArtisanId] = useState<string | null>(null);

  // Inspected Artisan for Capability Profile Modal / Drawer
  const [inspectedArtisan, setInspectedArtisan] = useState<ClusterArtisan | null>(null);

  // Order Placement Modal and Final Placed Order Record
  const [isOrderReviewModalOpen, setIsOrderReviewModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlacedData, setOrderPlacedData] = useState<OrderPlacedRecord | null>(null);

  // Handle URL search param prefill
  useEffect(() => {
    if (initialItemQuery && !matchedCraftData) {
      setRawText(initialItemQuery);
      executeSearch(initialItemQuery, "Institutional Buyer");
    }
  }, [initialItemQuery]);

  const executeSearch = (searchText: string, bName: string) => {
    setIsSubmitting(true);
    setIsUnidentified(false);
    setOrderPlacedData(null);

    const textLower = searchText.toLowerCase();
    const matchedRule = CRAFT_RULES.find((rule) =>
      rule.keywords.some((kw) => textLower.includes(kw.toLowerCase()))
    );

    if (!matchedRule) {
      setIsUnidentified(true);
      setRequirement(null);
      setMatches([]);
      setMatchedCraftData(null);
      setArtisanAllocations({});
      setIsSubmitting(false);
      return;
    }

    setMatchedCraftData(matchedRule);

    const numbersInText = searchText.match(/\d[\d,]*/g);
    let qty = 300;
    if (numbersInText && numbersInText.length > 0) {
      const parsed = parseInt(numbersInText[0].replace(/,/g, ""), 10);
      if (parsed > 0) qty = parsed;
    }
    setEditableQuantity(qty);
    setEditablePrice(matchedRule.costFloor + 150);
    setEditableDeadline(matchedRule.leadDays + 6);

    // Initialize allocations across artisans up to each artisan's limit
    const initialAlloc: Record<string, number> = {};
    let remaining = qty;
    matchedRule.artisans.forEach((art) => {
      const alloc = Math.min(art.capacityLimit, remaining);
      initialAlloc[art.id] = alloc;
      remaining -= alloc;
    });
    setArtisanAllocations(initialAlloc);

    generateDynamicMatches(qty, matchedRule.costFloor + 150, matchedRule.leadDays + 6, matchedRule, bName, searchText);
    setIsSubmitting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    executeSearch(rawText, buyerName || "Institutional Buyer");
  };

  const generateDynamicMatches = (
    qty: number,
    price: number,
    deadline: number,
    craftData: CraftClusterRule,
    bName: string,
    queryText: string
  ) => {
    const isCapacitySufficient = qty <= craftData.baseCapacity;
    const isPriceFair = price >= craftData.costFloor;
    const isDeadlineFeasible = deadline >= craftData.leadDays;

    const demoReq: BuyerRequirement = {
      id: `REQ_${Date.now()}`,
      buyer_name: bName || "Institutional Buyer",
      raw_text: queryText,
      product: craftData.product,
      craft: craftData.craft,
      quantity: qty,
      max_price: price,
      deadline_days: deadline,
      customization: true,
      branding: true,
      quality_threshold: 90,
      location: craftData.cluster,
      is_demo_data: true,
      status: "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setRequirement(demoReq);

    const reasons: string[] = [];
    const rejectionReasons: string[] = [];

    if (isCapacitySufficient) {
      reasons.push(
        language === "hi"
          ? `क्लस्टर क्षमता ${craftData.baseCapacity} नग/माह आपकी मांग ${qty} नग को आसानी से पूरा करती है।`
          : `Cluster federation capacity of ${craftData.baseCapacity} units/mo exceeds requested batch of ${qty} units.`
      );
    } else {
      rejectionReasons.push(
        language === "hi"
          ? `मांग (${qty} नग) क्लस्टर क्षमता (${craftData.baseCapacity} नग) से अधिक है। बहु-क्लस्टर विभाजन अनुशंसित है।`
          : `Requested batch (${qty} units) exceeds cluster capacity (${craftData.baseCapacity} units). Multi-cluster federation recommended.`
      );
    }

    if (isPriceFair) {
      reasons.push(
        language === "hi"
          ? `प्रस्तावित दर ₹${price}/नग कारीगर न्यूनतम पारिश्रमिक आधार (₹${craftData.costFloor}) का पूर्ण सम्मान करती है।`
          : `Target price of ₹${price}/unit exceeds minimum statutory artisan cost floor of ₹${craftData.costFloor}/unit.`
      );
    } else {
      rejectionReasons.push(
        language === "hi"
          ? `प्रस्तावित दर (₹${price}) कारीगर लागत आधार (₹${craftData.costFloor}) से कम है। कृपया पारिश्रमिक संशोधित करें।`
          : `Target price (₹${price}) is below statutory artisan cost floor (₹${craftData.costFloor}). Fair wage floor violated.`
      );
    }

    if (isDeadlineFeasible) {
      reasons.push(
        language === "hi"
          ? `क्लस्टर उत्पादन समय ${craftData.leadDays} दिन ${deadline} दिनों की समय-सीमा में सुरक्षित रूप से संभव है।`
          : `Cluster lead time of ${craftData.leadDays} days allows delivery within ${deadline}-day fulfillment window.`
      );
    } else {
      rejectionReasons.push(
        language === "hi"
          ? `समय-सीमा (${deadline} दिन) न्यूनतम उत्पादन समय (${craftData.leadDays} दिन) से कम है।`
          : `Deadline of ${deadline} days is tighter than minimum craftsmanship curing cycle (${craftData.leadDays} days).`
      );
    }

    setMatches([
      {
        id: "MATCH_01",
        requirement_id: demoReq.id,
        artisan_id: craftData.id,
        matched: isCapacitySufficient && isPriceFair && isDeadlineFeasible,
        hard_constraints: {
          capacity_ok: isCapacitySufficient,
          deadline_ok: isDeadlineFeasible,
        },
        score: isCapacitySufficient && isPriceFair && isDeadlineFeasible ? 0.96 : 0.64,
        reasons,
        rejection_reasons: rejectionReasons,
      },
    ]);
  };

  // Editable Quantity, Price, Deadline
  const handleBuyerEdit = (newQty: number, newPrice: number, newDeadline: number) => {
    setEditableQuantity(newQty);
    setEditablePrice(newPrice);
    setEditableDeadline(newDeadline);

    if (matchedCraftData) {
      generateDynamicMatches(
        newQty,
        newPrice,
        newDeadline,
        matchedCraftData,
        buyerName,
        rawText
      );
    }
  };

  // Artisan Allocation Change with strict capacity ceiling validation
  const handleArtisanAllocationChange = (artisanId: string, val: number, limit: number) => {
    if (val > limit) {
      setLimitExceededArtisanId(artisanId);
      setTimeout(() => setLimitExceededArtisanId(null), 3000);
    }

    const clamped = Math.max(0, Math.min(val, limit));
    setArtisanAllocations((prev) => ({
      ...prev,
      [artisanId]: clamped,
    }));
  };

  // Helper: Auto distribute target quantity across cluster artisans up to their limits
  const handleAutoDistribute = () => {
    if (!matchedCraftData) return;
    const newAlloc: Record<string, number> = {};
    let remaining = editableQuantity;

    matchedCraftData.artisans.forEach((art) => {
      const alloc = Math.min(art.capacityLimit, remaining);
      newAlloc[art.id] = alloc;
      remaining -= alloc;
    });

    setArtisanAllocations(newAlloc);
  };

  // Helper: Clear allocations
  const handleClearAllocations = () => {
    if (!matchedCraftData) return;
    const newAlloc: Record<string, number> = {};
    matchedCraftData.artisans.forEach((art) => {
      newAlloc[art.id] = 0;
    });
    setArtisanAllocations(newAlloc);
  };

  // Calculations for total allocated units and total order value
  const totalAllocatedUnits = Object.values(artisanAllocations).reduce(
    (sum, count) => sum + (count || 0),
    0
  );
  const totalClusteredOrderValue = totalAllocatedUnits * editablePrice;

  // Maximum lead days among artisans with allocated units > 0
  const activeArtisans = matchedCraftData
    ? matchedCraftData.artisans.filter(
        (art) => (artisanAllocations[art.id] || 0) > 0
      )
    : [];

  const maxLeadDays = activeArtisans.length > 0
    ? Math.max(...activeArtisans.map((a) => a.leadDays))
    : matchedCraftData?.leadDays || 16;

  // Order Placement Execution
  const handleConfirmOrderPlacement = () => {
    if (!matchedCraftData || totalAllocatedUnits === 0) return;

    setIsPlacingOrder(true);

    setTimeout(() => {
      const now = new Date();
      const orderId = `ORD-B2B-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      const breakdown = activeArtisans.map((art) => {
        const qty = artisanAllocations[art.id] || 0;
        const subtotal = qty * editablePrice;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + art.leadDays);

        return {
          artisanId: art.id,
          artisanName: art.name,
          artisanNameHi: art.nameHi,
          location: art.location,
          locationHi: art.locationHi,
          quantity: qty,
          unitPrice: editablePrice,
          subtotal,
          trackingToken: `DSP-${art.id.replace("ART_", "")}-${Math.floor(100 + Math.random() * 900)}`,
          leadDays: art.leadDays,
          estimatedDispatchDate: targetDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };
      });

      const record: OrderPlacedRecord = {
        orderId,
        placedAt: now.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        buyerName: buyerName || "Institutional Buyer",
        organization: organizationName || "Procurement Enterprise",
        deliveryAddress: deliveryAddress || "Central Supply Depot, Mumbai",
        product: matchedCraftData.product,
        craft: matchedCraftData.craft,
        clusterName: matchedCraftData.cluster,
        totalQuantity: totalAllocatedUnits,
        targetPrice: editablePrice,
        totalAmount: totalClusteredOrderValue,
        leadDays: maxLeadDays,
        artisanBreakdown: breakdown,
      };

      setOrderPlacedData(record);
      setIsPlacingOrder(false);
      setIsOrderReviewModalOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="border-b border-[#E8DFD5] bg-[#F4EFEA]/80 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D6CEBE] bg-white px-3.5 py-1 text-xs text-[#1C1917] shadow-xs">
                <Building2 className="h-3.5 w-3.5 text-[#C85A32]" />
                <span className="font-semibold uppercase tracking-wider text-[11px]">
                  {language === "hi"
                    ? "संस्थागत एवं थोक खरीद • क्लस्टर आवंटन"
                    : "Institutional & Bulk Procurement • Cluster Allocation"}
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#141311]">
                {language === "hi"
                  ? "कारीगर क्लस्टरों से सीधा संस्थागत जुड़ाव"
                  : "Direct Procurement from Artisan Clusters"}
              </h1>

              <p className="text-sm md:text-base text-[#78716C] leading-relaxed">
                {language === "hi"
                  ? "अपनी व्यावसायिक मांग बताएं। कला का एआई इंजन आवश्यकता का विश्लेषण कर क्लस्टर कारीगरों को खोजता है, उनकी क्षमता प्रोफाइल दिखाता है और आपको प्रत्येक कारीगर को उनकी सीमा तक सटीक मात्रा आवंटित करने की सुविधा देता है।"
                  : "Describe your enterprise requirements. ARTKALA matches your request with verified artisan clusters, exposes member artisans with their evidence-backed capability profiles, lets you allocate exact order amounts up to each artisan's capacity limit, and securely places your clustered order."}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ORDER PLACED VIEW (Renders when an order has been successfully placed)     */}
        {/* ========================================================================= */}
        {orderPlacedData && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-400">
            <div className="rounded-3xl bg-white p-6 sm:p-10 border-2 border-[#3F5E4D]/30 shadow-lg space-y-8">
              {/* Success Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E8DFD5] gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF1ED] text-[#3F5E4D] flex-shrink-0 shadow-xs">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF1ED] px-3 py-0.5 text-xs font-bold text-[#3F5E4D]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{language === "hi" ? "ऑर्डर सफलतापूर्वक दर्ज" : "Order Placed Successfully"}</span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1917]">
                      {language === "hi"
                        ? `क्लस्टर खरीद आदेश: ${orderPlacedData.orderId}`
                        : `Clustered Procurement Order: ${orderPlacedData.orderId}`}
                    </h2>
                    <p className="text-xs text-[#78716C]">
                      {language === "hi"
                        ? `दिनांक: ${orderPlacedData.placedAt} • क्रेता: ${orderPlacedData.buyerName} (${orderPlacedData.organization})`
                        : `Recorded on ${orderPlacedData.placedAt} • Buyer: ${orderPlacedData.buyerName} (${orderPlacedData.organization})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#D6CEBE] bg-[#FAF8F5] hover:bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1917] shadow-xs transition-colors"
                  >
                    <Printer className="h-4 w-4 text-[#C85A32]" />
                    <span>{language === "hi" ? "पीओ रसीद प्रिंट करें" : "Print PO Receipt"}</span>
                  </button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setOrderPlacedData(null);
                      setRawText("");
                      setMatchedCraftData(null);
                      setRequirement(null);
                    }}
                    className="rounded-xl text-xs gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>{language === "hi" ? "नया थोक ऑर्डर दें" : "New Procurement"}</span>
                  </Button>
                </div>
              </div>

              {/* Order Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD5] text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "उत्पाद एवं शिल्प" : "Product & Tradition"}
                  </span>
                  <p className="font-bold text-[#1C1917] mt-0.5">{orderPlacedData.product}</p>
                  <span className="text-[11px] text-[#C85A32]">{orderPlacedData.craft}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "कुल आवंटित मात्रा" : "Total Allocated Units"}
                  </span>
                  <p className="font-display text-xl font-bold text-[#1C1917] mt-0.5">
                    {orderPlacedData.totalQuantity}{" "}
                    <span className="text-xs font-normal text-[#78716C]">
                      {language === "hi" ? "नग" : "units"}
                    </span>
                  </p>
                  <span className="text-[11px] text-[#3F5E4D]">
                    {language === "hi"
                      ? `${orderPlacedData.artisanBreakdown.length} कारीगरों में विभाजित`
                      : `Split among ${orderPlacedData.artisanBreakdown.length} artisans`}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "कुल आदेश मूल्य (दर)" : "Total Clustered Value"}
                  </span>
                  <p className="font-display text-xl font-bold text-[#3F5E4D] mt-0.5">
                    ₹{orderPlacedData.totalAmount.toLocaleString("en-IN")}
                  </p>
                  <span className="text-[11px] text-[#78716C]">
                    @ ₹{orderPlacedData.targetPrice}/unit
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "आपूर्ति समय-सीमा" : "Fulfillment Timeline"}
                  </span>
                  <p className="font-bold text-[#1C1917] mt-0.5">
                    {orderPlacedData.leadDays} {language === "hi" ? "दिन अधिकतम" : "Days Max"}
                  </p>
                  <span className="text-[11px] text-[#3F5E4D]">
                    {language === "hi" ? "समकालिक क्लस्टर उत्पादन" : "Synchronized guild batches"}
                  </span>
                </div>
              </div>

              {/* Individual Artisan Dispatch Allocation Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-[#1C1917] flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-[#C85A32]" />
                    <span>
                      {language === "hi"
                        ? "कारीगर-वार उत्पादन व प्रेषण आवंटन"
                        : "Artisan-Wise Dispatch Breakdown & Escrow Allocations"}
                    </span>
                  </h3>
                  <span className="text-xs text-[#78716C]">
                    {language === "hi" ? "प्रत्यक्ष बैंक हस्तांतरण" : "Direct Guild Disbursement"}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#E8DFD5] bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E8DFD5] bg-[#FAF8F5] text-[10px] uppercase font-bold text-[#78716C]">
                        <th className="py-3 px-4">{language === "hi" ? "कारीगर एवं कार्यशाला" : "Artisan & Workshop"}</th>
                        <th className="py-3 px-4">{language === "hi" ? "आवंटित मात्रा" : "Allocated Qty"}</th>
                        <th className="py-3 px-4">{language === "hi" ? "प्रत्यक्ष दर" : "Unit Rate"}</th>
                        <th className="py-3 px-4">{language === "hi" ? "उप-योग (राशि)" : "Subtotal Amount"}</th>
                        <th className="py-3 px-4">{language === "hi" ? "प्रेषण टोकन" : "Dispatch Token"}</th>
                        <th className="py-3 px-4 text-right">{language === "hi" ? "अनुमानित प्रेषण" : "Est. Dispatch"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F4EFEA] text-[11px]">
                      {orderPlacedData.artisanBreakdown.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-[#1C1917] block">
                              {language === "hi" ? row.artisanNameHi : row.artisanName}
                            </span>
                            <span className="text-[10px] text-[#78716C]">
                              {language === "hi" ? row.locationHi : row.location}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-[#1C1917]">
                            {row.quantity} {language === "hi" ? "नग" : "units"}
                          </td>
                          <td className="py-3 px-4 text-[#78716C]">₹{row.unitPrice}</td>
                          <td className="py-3 px-4 font-bold text-[#3F5E4D]">
                            ₹{row.subtotal.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-[10px] bg-[#FAF8F5] border border-[#E8DFD5] px-2 py-0.5 rounded text-[#1C1917]">
                              {row.trackingToken}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-[#1C1917]">
                            {row.estimatedDispatchDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Escrow and Trust Guarantee Box */}
              <div className="rounded-2xl bg-[#EBF1ED]/80 p-5 border border-[#3F5E4D]/25 flex items-start gap-3 text-xs text-[#3F5E4D]">
                <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-sm block">
                    {language === "hi"
                      ? "कला एस्क्रो गारंटी • शत-प्रतिशत प्रत्यक्ष कारीगर भुगतान"
                      : "ARTKALA Escrow Guarantee • 100% Direct Co-operative Settlement"}
                  </span>
                  <p className="text-[11px] leading-relaxed text-[#2C4436]">
                    {language === "hi"
                      ? "यह आदेश क्लस्टर सहकारी खाते में आरक्षित है। कारीगरों द्वारा क्यूसी निरीक्षण एवं प्रेषण संपन्न होने पर राशि सीधे उनके बैंक खातों में जारी की जाएगी। शून्य बिचौलिया कटौती।"
                      : "Funds are securely placed in banking escrow and automatically disbursed to maker accounts upon geo-verified dispatch milestone verification. Zero commission deductions."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Natural Language Requirement Composer & Search */}
        {!orderPlacedData && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Form: Requirement Composer */}
              <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-6">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#C85A32]">
                    {language === "hi" ? "थोक मांग खोजक" : "Procurement Search & Match"}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[#1C1917]">
                    {language === "hi"
                      ? "अपनी थोक मांग दर्ज करें"
                      : "Search Artisan Clusters"}
                  </h2>
                  <p className="text-xs text-[#78716C]">
                    {language === "hi"
                      ? "उत्पाद, मात्रा या विशिष्ट शिल्प खोजें। उदाहरण: '300 bamboo baskets' या '500 terracotta jugs'"
                      : "Search craft items to discover verified clusters, member artisans, and allocate quantities."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-1.5">
                      {language === "hi" ? "संस्था / क्रेता का नाम" : "Organization / Buyer Name"}
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder={
                        language === "hi"
                          ? "संस्था या प्रतिनिधि का नाम (उदा. ताज रिसॉर्ट्स)"
                          : "Company or Representative Name (e.g. Taj Hotels)"
                      }
                      className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-3 text-xs text-[#1C1917] outline-none focus:border-[#C85A32] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-1.5">
                      {language === "hi"
                        ? "मांग विनिर्देश खोज (हिंदी या अंग्रेज़ी)"
                        : "Craft Item or Specification (English or Hindi)"}
                    </label>
                    <textarea
                      rows={3}
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder={
                        language === "hi"
                          ? "अपनी आवश्यकता लिखें (उदा. 300 बांस की टोकरियां या 400 टेराकोटा मटके)..."
                          : "E.g. We need 300 handwoven bamboo storage baskets or 500 terracotta jugs..."
                      }
                      required
                      className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-3.5 text-xs text-[#1C1917] outline-none focus:border-[#C85A32] focus:bg-white resize-none"
                    />
                  </div>

                  {/* Sample Quick Searches */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-[#A8A29E] block">
                      {language === "hi" ? "त्वरित शिल्प खोज उदाहरण:" : "Quick Craft Search Examples:"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { en: "300 Bamboo Baskets", hi: "300 बांस की टोकरियां", q: "300 handwoven bamboo baskets" },
                        { en: "400 Terracotta Pitchers", hi: "400 टेराकोटा मटके", q: "400 terracotta earthenware pitchers" },
                        { en: "150 Tussar Silk Shawls", hi: "150 टसर सिल्क शॉल", q: "150 pure tussar silk shawls" },
                        { en: "200 Carved Wood Accents", hi: "200 काष्ठ नक्काशी", q: "200 hand carved wooden trays" },
                        { en: "80 Dhokra Bell Figurines", hi: "80 ढोकरा कलाकृतियां", q: "80 dhokra lost wax bell metal figurines" },
                      ].map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setRawText(chip.q);
                            executeSearch(chip.q, buyerName || "Institutional Buyer");
                          }}
                          className="rounded-lg border border-[#E8DFD5] bg-[#FAF8F5] hover:border-[#C85A32] px-2.5 py-1 text-[11px] font-medium text-[#1C1917] transition-colors"
                        >
                          {language === "hi" ? chip.hi : chip.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full rounded-xl gap-2 text-xs font-semibold pt-3"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {language === "hi"
                        ? "क्लस्टर खोजें एवं कारीगर देखें"
                        : "Discover Cluster & Member Artisans"}
                    </span>
                  </Button>
                </form>
              </div>

              {/* Right Side: Matched Cluster & Constituent Artisans */}
              <div className="lg:col-span-7 space-y-6">
                {/* Unidentified Craft State */}
                {isUnidentified && (
                  <div className="rounded-3xl bg-amber-50/80 p-8 border border-amber-200 text-center space-y-4 animate-in fade-in duration-300">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-xs">
                      <AlertTriangle className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-amber-950">
                        {language === "hi"
                          ? "कोई प्रामाणिक भारतीय शिल्प क्लस्टर नहीं मिला"
                          : "No Authentic Artisan Craft Identified"}
                      </h3>
                      <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                        {language === "hi"
                          ? "कला केवल प्रामाणिक पारंपरिक शिल्पों (जैसे बांस व बेंत, टेराकोटा मृदभांड, हथकरघा वस्त्र, काष्ठ नक्काशी एवं ढोकरा धातु) का क्लस्टर मिलान करता है। कोई परिणाम नहीं मिला।"
                          : "ARTKALA exclusively connects authentic Indian craft traditions (bamboo/cane, terracotta pottery, handloom textiles, wood carving, or bell metalwork). Unrecognized items return zero matches."}
                      </p>
                    </div>
                    <span className="inline-block text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full">
                      {language === "hi" ? "शून्य परिणाम • कोई भ्रामक डेटा नहीं" : "Zero Results • No Fabricated Matches"}
                    </span>
                  </div>
                )}

                {/* Empty Initial Preview State */}
                {!requirement && !isUnidentified && (
                  <div className="rounded-3xl bg-[#F4EFEA]/60 p-10 border border-dashed border-[#D6CEBE] text-center space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#C85A32] shadow-xs">
                      <Layers className="h-7 w-7" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#1C1917]">
                      {language === "hi"
                        ? "क्लस्टर एवं कारीगर आवंटन पूर्वावलोकन"
                        : "Cluster & Artisan Allocation Workspace"}
                    </h3>
                    <p className="text-xs text-[#78716C] max-w-md mx-auto leading-relaxed">
                      {language === "hi"
                        ? "बाईं ओर अपनी थोक आवश्यकता खोजें। यह तुरंत संबंधित कारीगर क्लस्टर, उसके सदस्य कारीगरों, उनकी क्षमता प्रोफाइल और प्रत्येक कारीगर को उनकी सीमा तक ऑर्डर आवंटित करने का विकल्प दिखाएगा।"
                        : "Search your requirement on the left. The matching cluster will appear with member artisans, their verified capability profiles, and live allocation sliders up to each artisan's capacity limit."}
                    </p>
                  </div>
                )}

                {/* Matched Cluster Overview Card */}
                {requirement && matchedCraftData && !isUnidentified && (
                  <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-6 animate-in fade-in duration-300">
                    {/* Header: Cluster Badge & Name */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F4EFEA] gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded bg-[#EBF1ED] text-[#3F5E4D]">
                            <Layers className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-[11px] uppercase font-bold tracking-wider text-[#C85A32]">
                            {language === "hi" ? "सत्यापित कारीगर क्लस्टर" : "Verified Artisan Cluster"}
                          </span>
                          <span className="text-[10px] font-semibold text-[#3F5E4D] bg-[#EBF1ED] px-2 py-0.5 rounded-full">
                            {matchedCraftData.id}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-[#1C1917]">
                          {language === "hi" ? matchedCraftData.clusterHi : matchedCraftData.cluster}
                        </h3>
                        <p className="text-xs text-[#78716C]">
                          {matchedCraftData.craft} • {matchedCraftData.product}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                          {language === "hi" ? "क्लस्टर कुल क्षमता" : "Federated Capacity"}
                        </span>
                        <span className="font-display text-lg font-bold text-[#1C1917]">
                          {matchedCraftData.baseCapacity}{" "}
                          <span className="text-xs font-normal text-[#78716C]">
                            {language === "hi" ? "नग/माह" : "units/mo"}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Order Target Specifications (Quantity & Price editable) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      {/* EDITABLE TARGET QUANTITY */}
                      <div className="p-3 rounded-xl bg-white border-2 border-[#C85A32]/40 shadow-xs">
                        <label className="text-[10px] uppercase font-bold text-[#C85A32] block mb-1">
                          {language === "hi" ? "लक्ष्य मांग मात्रा" : "Target Order Qty"}
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editableQuantity}
                            onChange={(e) =>
                              handleBuyerEdit(
                                Math.max(1, Number(e.target.value)),
                                editablePrice,
                                editableDeadline
                              )
                            }
                            className="w-full text-sm font-bold text-[#1C1917] outline-none"
                          />
                          <span className="text-[10px] text-[#78716C]">
                            {language === "hi" ? "नग" : "units"}
                          </span>
                        </div>
                      </div>

                      {/* EDITABLE TARGET PRICE */}
                      <div className="p-3 rounded-xl bg-white border-2 border-[#C85A32]/40 shadow-xs">
                        <label className="text-[10px] uppercase font-bold text-[#C85A32] block mb-1">
                          {language === "hi" ? "इकाई मूल्य दर" : "Direct Unit Rate"}
                        </label>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-[#1C1917]">₹</span>
                          <input
                            type="number"
                            value={editablePrice}
                            onChange={(e) =>
                              handleBuyerEdit(
                                editableQuantity,
                                Math.max(1, Number(e.target.value)),
                                editableDeadline
                              )
                            }
                            className="w-full text-sm font-bold text-[#1C1917] outline-none"
                          />
                          <span className="text-[10px] text-[#78716C]">
                            {language === "hi" ? "/नग" : "/unit"}
                          </span>
                        </div>
                      </div>

                      {/* EDITABLE DEADLINE */}
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DFD5]">
                        <label className="text-[10px] uppercase font-bold text-[#78716C] block mb-1">
                          {language === "hi" ? "अधिकतम समय-सीमा" : "Max Deadline"}
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editableDeadline}
                            onChange={(e) =>
                              handleBuyerEdit(
                                editableQuantity,
                                editablePrice,
                                Math.max(1, Number(e.target.value))
                              )
                            }
                            className="w-full text-sm font-bold text-[#1C1917] outline-none bg-transparent"
                          />
                          <span className="text-[10px] text-[#78716C]">
                            {language === "hi" ? "दिन" : "days"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* ARTISANS IN THIS CLUSTER ROSTER                                            */}
                    {/* ========================================================================= */}
                    <div className="space-y-4 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5">
                            <UserCheck className="h-4 w-4 text-[#C85A32]" />
                            <span>
                              {language === "hi"
                                ? `इस क्लस्टर के सदस्य कारीगर (${matchedCraftData.artisans.length})`
                                : `Artisans in this Cluster (${matchedCraftData.artisans.length})`}
                            </span>
                          </h4>
                          <span className="text-[11px] text-[#78716C]">
                            {language === "hi"
                              ? "प्रत्येक कारीगर की हुनर क्षमता प्रोफाइल देखें एवं उनकी सीमा तक सटीक मात्रा तय करें"
                              : "Inspect each artisan's capability twin & allocate exact units up to their limit"}
                          </span>
                        </div>

                        {/* Helper Buttons: Auto-distribute & Clear */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={handleAutoDistribute}
                            className="text-[11px] font-semibold text-[#C85A32] bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E8DFD5] px-2.5 py-1 rounded-lg transition-colors"
                          >
                            {language === "hi" ? "स्वतः समान आवंटन" : "Auto-Distribute"}
                          </button>
                          <button
                            type="button"
                            onClick={handleClearAllocations}
                            className="text-[11px] font-semibold text-[#78716C] hover:underline"
                          >
                            {language === "hi" ? "रीसेट" : "Reset"}
                          </button>
                        </div>
                      </div>

                      {/* Warning notice if limit exceeded */}
                      {limitExceededArtisanId && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 animate-in fade-in">
                          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                          <span>
                            {language === "hi"
                              ? "कारीगर की आवंटित मात्रा उनकी सत्यापित मासिक क्षमता सीमा से अधिक नहीं हो सकती। मान को सीमा पर सीमित किया गया।"
                              : "Order allocation cannot exceed the artisan's verified monthly capacity limit. Capped to maximum ceiling."}
                          </span>
                        </div>
                      )}

                      {/* Artisan Cards List */}
                      <div className="space-y-4">
                        {matchedCraftData.artisans.map((artisan) => {
                          const allocated = artisanAllocations[artisan.id] || 0;
                          const isCapped = allocated >= artisan.capacityLimit;
                          const artisanSubtotal = allocated * editablePrice;

                          return (
                            <div
                              key={artisan.id}
                              className={`rounded-2xl p-5 border transition-all ${
                                allocated > 0
                                  ? "bg-white border-[#C85A32]/40 shadow-xs"
                                  : "bg-[#FAF8F5] border-[#E8DFD5]"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                {/* Artisan Details */}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-sm text-[#1C1917]">
                                      {language === "hi" ? artisan.nameHi : artisan.name}
                                    </span>
                                    <span className="text-[10px] font-semibold text-[#3F5E4D] bg-[#EBF1ED] px-2 py-0.5 rounded-full">
                                      {language === "hi" ? artisan.verificationBadgeHi : artisan.verificationBadge}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-[#78716C]">
                                    <span>{language === "hi" ? artisan.roleHi : artisan.role}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-[#A8A29E]" />
                                      {language === "hi" ? artisan.locationHi : artisan.location}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3 text-[11px] text-[#78716C] pt-1">
                                    <span>
                                      {language === "hi" ? "अनुभव:" : "Exp:"}{" "}
                                      <strong className="text-[#1C1917]">{artisan.experienceYears} {language === "hi" ? "वर्ष" : "yrs"}</strong>
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {language === "hi" ? "लीड समय:" : "Lead Time:"}{" "}
                                      <strong className="text-[#1C1917]">{artisan.leadDays} {language === "hi" ? "दिन" : "days"}</strong>
                                    </span>
                                    <span>•</span>
                                    <span className="font-mono text-[10px] text-[#A8A29E]">
                                      Audit: {artisan.lastQcAudit}
                                    </span>
                                  </div>
                                </div>

                                {/* Capability Profile Trigger Button */}
                                <button
                                  type="button"
                                  onClick={() => setInspectedArtisan(artisan)}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#D6CEBE] bg-[#FAF8F5] hover:bg-white hover:border-[#C85A32] px-3 py-1.5 text-xs font-semibold text-[#1C1917] shadow-xs transition-colors self-start"
                                >
                                  <ShieldCheck className="h-3.5 w-3.5 text-[#3F5E4D]" />
                                  <span>{language === "hi" ? "क्षमता प्रोफाइल देखें" : "View Capability Profile"}</span>
                                </button>
                              </div>

                              {/* Exact Quantity Allocation Controls (Up to Limit) */}
                              <div className="mt-4 pt-3 border-t border-[#F4EFEA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-bold text-[#78716C]">
                                      {language === "hi" ? "कारीगर क्षमता सीमा:" : "Artisan Capacity Limit:"}
                                    </span>
                                    <span className="font-bold text-xs text-[#1C1917]">
                                      {artisan.capacityLimit} {language === "hi" ? "नग/माह" : "units/mo"}
                                    </span>
                                    <span className="text-[10px] text-[#3F5E4D]">
                                      ({language === "hi" ? `उपलब्ध: ${artisan.availableBuffer}` : `Buffer: ${artisan.availableBuffer}`})
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-[#78716C]">
                                    {language === "hi"
                                      ? "आप इस सीमा तक सटीक मात्रा आवंटित कर सकते हैं"
                                      : "Specify exact quantity allocated to this maker up to their limit"}
                                  </span>
                                </div>

                                {/* Allocation Input Stepper */}
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center rounded-xl border border-[#D6CEBE] bg-white p-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleArtisanAllocationChange(
                                          artisan.id,
                                          Math.max(0, allocated - 10),
                                          artisan.capacityLimit
                                        )
                                      }
                                      className="h-8 w-8 text-sm font-bold text-[#1C1917] hover:bg-[#FAF8F5] rounded-lg"
                                      aria-label="Decrease"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      min={0}
                                      max={artisan.capacityLimit}
                                      value={allocated}
                                      onChange={(e) =>
                                        handleArtisanAllocationChange(
                                          artisan.id,
                                          Number(e.target.value),
                                          artisan.capacityLimit
                                        )
                                      }
                                      className="w-16 text-center text-xs font-bold text-[#1C1917] outline-none"
                                    />
                                    <button
                                      type="button"
                                      disabled={isCapped}
                                      onClick={() =>
                                        handleArtisanAllocationChange(
                                          artisan.id,
                                          Math.min(artisan.capacityLimit, allocated + 10),
                                          artisan.capacityLimit
                                        )
                                      }
                                      className="h-8 w-8 text-sm font-bold text-[#1C1917] hover:bg-[#FAF8F5] disabled:opacity-30 rounded-lg"
                                      aria-label="Increase"
                                    >
                                      +
                                    </button>
                                  </div>

                                  {/* Subtotal for this artisan */}
                                  <div className="text-right min-w-[90px]">
                                    <span className="text-[10px] uppercase text-[#A8A29E] block">
                                      {language === "hi" ? "कारीगर देय राशि" : "Payout"}
                                    </span>
                                    <span className="font-bold text-xs text-[#3F5E4D]">
                                      ₹{artisanSubtotal.toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* ALLOCATION SUMMARY & ORDER PLACEMENT ACTION                               */}
                    {/* ========================================================================= */}
                    <div className="pt-4 border-t border-[#E8DFD5] space-y-4">
                      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                            {language === "hi" ? "कुल आवंटित मात्रा" : "Total Allocated Units"}
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="font-display text-2xl font-bold text-[#1C1917]">
                              {totalAllocatedUnits}
                            </span>
                            <span className="text-[#78716C]">
                              / {editableQuantity} {language === "hi" ? "नग लक्ष्य" : "target units"}
                            </span>
                            {totalAllocatedUnits === editableQuantity && (
                              <span className="text-[10px] font-bold text-[#3F5E4D] bg-[#EBF1ED] px-2 py-0.5 rounded-full">
                                {language === "hi" ? "100% पूरा" : "100% Matched"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="sm:text-right space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                            {language === "hi" ? "कुल क्लस्टर ऑर्डर मूल्य" : "Total Clustered Order Value"}
                          </span>
                          <span className="font-display text-2xl font-bold text-[#3F5E4D]">
                            ₹{totalClusteredOrderValue.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Place Order CTA Button */}
                      <Button
                        variant="primary"
                        size="lg"
                        disabled={totalAllocatedUnits === 0}
                        onClick={() => setIsOrderReviewModalOpen(true)}
                        className="w-full rounded-2xl gap-2 text-sm font-semibold shadow-md py-4"
                      >
                        <Building2 className="h-5 w-5" />
                        <span>
                          {language === "hi"
                            ? `क्लस्टर ऑर्डर दर्ज करें (₹${totalClusteredOrderValue.toLocaleString("en-IN")})`
                            : `Proceed to Place Clustered Order (₹${totalClusteredOrderValue.toLocaleString("en-IN")})`}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: ARTISAN CAPABILITY PROFILE MODAL                                  */}
        {/* ========================================================================= */}
        {inspectedArtisan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl space-y-6">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#C85A32] bg-[#FAF8F5] border border-[#E8DFD5] px-2 py-0.5 rounded">
                      {inspectedArtisan.id}
                    </span>
                    <span className="text-xs text-[#78716C]">
                      {language === "hi" ? inspectedArtisan.roleHi : inspectedArtisan.role}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1C1917]">
                    {language === "hi" ? inspectedArtisan.nameHi : inspectedArtisan.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectedArtisan(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF8F5] text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Embed Hunar Capability Twin for this Artisan */}
              <HunarCapabilityTwin
                artisanId={inspectedArtisan.id}
                artisanName={language === "hi" ? inspectedArtisan.nameHi : inspectedArtisan.name}
                clusterName={language === "hi" ? inspectedArtisan.locationHi : inspectedArtisan.location}
                defaultCraftKey={inspectedArtisan.craftKey}
              />

              {/* Modal Footer: Quick Allocation Setting & Return */}
              <div className="pt-4 border-t border-[#E8DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#78716C]">
                    {language === "hi" ? "इस कारीगर हेतु वर्तमान आवंटन:" : "Current allocation for this artisan:"}
                  </span>
                  <span className="font-bold text-sm text-[#1C1917]">
                    {artisanAllocations[inspectedArtisan.id] || 0} / {inspectedArtisan.capacityLimit} {language === "hi" ? "नग" : "units"}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setInspectedArtisan(null)}
                  className="rounded-xl text-xs px-6"
                >
                  <span>{language === "hi" ? "समीक्षा पूर्ण • ऑर्डर पर लौटें" : "Done • Return to Order"}</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: ORDER PLACEMENT CONFIRMATION MODAL                                */}
        {/* ========================================================================= */}
        {isOrderReviewModalOpen && matchedCraftData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5]">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F5E4D]">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{language === "hi" ? "क्लस्टर थोक खरीद समीक्षा" : "Clustered Order Review"}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#1C1917]">
                    {language === "hi" ? "ऑर्डर की पुष्टि करें" : "Confirm & Place Clustered Order"}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOrderReviewModalOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF8F5] text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Details: Buyer Org & Shipping Hub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#78716C] mb-1">
                    {language === "hi" ? "क्रेता / संस्था का नाम *" : "Buyer / Organization Name *"}
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                    placeholder="E.g. Taj Hotels & Resorts"
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-3 text-xs text-[#1C1917] outline-none focus:border-[#C85A32] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#78716C] mb-1">
                    {language === "hi" ? "संस्था / विभाग" : "Enterprise Division"}
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="E.g. Central Procurement Hub"
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-3 text-xs text-[#1C1917] outline-none focus:border-[#C85A32] focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-[#78716C] mb-1">
                    {language === "hi" ? "डिलीवरी गंतव्य / गोदाम पता" : "Delivery Destination / Warehouse"}
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="E.g. Plot 42, Logistics Park, Navi Mumbai - 400705"
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-3 text-xs text-[#1C1917] outline-none focus:border-[#C85A32] focus:bg-white"
                  />
                </div>
              </div>

              {/* Order Breakdown Summary */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD5] space-y-3 text-xs">
                <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                  {language === "hi" ? "कारीगर आवंटन सारांश" : "Allocation Summary Across Artisans"}
                </span>

                <div className="space-y-2 divide-y divide-[#E8DFD5]">
                  {activeArtisans.map((art) => {
                    const qty = artisanAllocations[art.id] || 0;
                    return (
                      <div key={art.id} className="pt-2 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#1C1917] block">
                            {language === "hi" ? art.nameHi : art.name}
                          </span>
                          <span className="text-[10px] text-[#78716C]">
                            {language === "hi" ? art.locationHi : art.location} • {art.leadDays} days lead
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#1C1917] block">
                            {qty} {language === "hi" ? "नग" : "units"}
                          </span>
                          <span className="text-[10px] font-semibold text-[#3F5E4D]">
                            ₹{(qty * editablePrice).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-[#D6CEBE] flex items-center justify-between font-bold text-sm">
                  <span>{language === "hi" ? "कुल देय राशि:" : "Total Clustered Amount:"}</span>
                  <span className="text-[#3F5E4D]">
                    ₹{totalClusteredOrderValue.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOrderReviewModalOpen(false)}
                  className="rounded-xl border border-[#D6CEBE] px-5 py-2.5 text-xs font-semibold text-[#78716C] hover:bg-[#FAF8F5] transition-colors"
                >
                  {language === "hi" ? "संशोधन करें" : "Cancel"}
                </button>
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isPlacingOrder}
                  onClick={handleConfirmOrderPlacement}
                  className="rounded-xl text-xs font-bold gap-2 px-6"
                >
                  <Check className="h-4 w-4" />
                  <span>
                    {language === "hi"
                      ? "ऑर्डर की पुष्टि करें और दर्ज करें"
                      : "Confirm & Place Clustered Order"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BusinessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
      <BusinessContent />
    </Suspense>
  );
}
