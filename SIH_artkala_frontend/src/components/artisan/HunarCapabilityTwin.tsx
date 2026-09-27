"use client";

import React, { useState } from "react";
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCheck,
  Calendar,
  Box,
  ChevronDown,
  ChevronUp,
  PackageCheck,
  Award,
  Sparkles,
  Info,
  Check,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { HunarProfile } from "@/types";

export interface CapabilityRecord {
  id: string;
  name: string;
  nameHi: string;
  craftType: string;
  craftTypeHi: string;
  status: "CONFIRMED" | "DEVELOPING" | "LIMITED_EVIDENCE" | "NEEDS_VERIFICATION";
  verificationStatus: "Verified" | "Partially Verified" | "Unverified";
  readiness: "Ready" | "Building Evidence" | "Limited Readiness";
  materials: {
    name: string;
    nameHi: string;
    status: "Confirmed" | "Developing" | "Needs Verification";
    evidence: string[];
    evidenceHi: string[];
  }[];
  techniques: {
    name: string;
    nameHi: string;
    status: "Confirmed" | "Developing" | "Needs Verification";
    evidence: string[];
    evidenceHi: string[];
  }[];
  productsCreated: {
    count: number;
    types: string[];
    typesHi: string[];
  };
  customisation: {
    supported: boolean;
    options: string[];
    optionsHi: string[];
  };
  productionCapability: {
    currentMonthlyCapacity: number; // operational estimate
    typicalLeadTime: string;
    typicalLeadTimeHi: string;
    customOrdersSupported: boolean;
    minOrderQuantity: number;
    availableCapacity: number;
    capacityNote: string;
    capacityNoteHi: string;
  };
  trackRecord: {
    totalProductsCreated: number;
    ordersFulfilled: number;
    b2cExperience: number;
    b2bExperience: number;
    qualityRecordsCount: number;
    fulfilmentHistory: string;
    fulfilmentHistoryHi: string;
  };
  qualityRecords: {
    checksCompleted: number;
    status: "PASSED_ZERO_DEFECT" | "AUDITED" | "UNDER_REVIEW";
    evidenceSummary: string;
    evidenceSummaryHi: string;
    lastAuditRef: string;
    auditHistory: string[];
    auditHistoryHi: string[];
  };
  freshness: {
    lastUpdated: string;
    lastUpdatedHi: string;
    lastEvidenceRecorded: string;
    lastEvidenceRecordedHi: string;
  };
  traceableEvidence: {
    item: string;
    itemHi: string;
    evidenceType: string;
    evidenceTypeHi: string;
    reference: string;
    date: string;
  }[];
}

const CAPABILITY_DATA: Record<string, CapabilityRecord> = {
  basketry: {
    id: "CAP_BASKETRY_01",
    name: "Basketry & Cane Weaving",
    nameHi: "बांस-बेंत बुनाई व टोकरी शिल्प",
    craftType: "Basketry & Cane Craft",
    craftTypeHi: "बांस एवं बेंत शिल्प",
    status: "CONFIRMED",
    verificationStatus: "Verified",
    readiness: "Ready",
    materials: [
      {
        name: "Natural Moso Bamboo & Rattan Cane",
        nameHi: "प्राकृतिक मोसो बांस व रतन बेंत",
        status: "Confirmed",
        evidence: [
          "Product record #PROD_RATTAN_01",
          "Artisan material batch self-declaration",
          "Workshop physical inspection audit",
          "Completed order #ORD_B2B_104",
        ],
        evidenceHi: [
          "उत्पाद रिकॉर्ड #PROD_RATTAN_01",
          "कारीगर सामग्री लॉट घोषणा",
          "कार्यशाला भौतिक निरीक्षण ऑडिट",
          "संपन्न ऑर्डर #ORD_B2B_104",
        ],
      },
      {
        name: "Organic Botanical Dyes & River Soaking",
        nameHi: "प्राकृतिक वनस्पति रंग व नदी उपचार",
        status: "Confirmed",
        evidence: [
          "Studio documentation certificate",
          "Cluster chemical-free lab test #QC_882",
        ],
        evidenceHi: [
          "स्टूडियो प्रलेखन प्रमाण पत्र",
          "क्लस्टर रसायन-मुक्त लैब परीक्षण #QC_882",
        ],
      },
    ],
    techniques: [
      {
        name: "Hexagonal Lattice Hand Weaving",
        nameHi: "षट्कोणीय जालीदार हस्त बुनाई",
        status: "Confirmed",
        evidence: [
          "Studio video demonstration verification",
          "Cluster master artisan peer sign-off",
        ],
        evidenceHi: [
          "स्टूडियो वीडियो प्रदर्शन सत्यापन",
          "क्लस्टर मास्टर कारीगर सहकर्मी अनुमोदन",
        ],
      },
      {
        name: "Splitting, Shaving & Interlocking Rims",
        nameHi: "बांस चीराई, घिसाई व इंटरलॉकिंग किनारे",
        status: "Confirmed",
        evidence: [
          "QC batch inspection #QC_711",
          "Workshop video archive",
        ],
        evidenceHi: [
          "क्यूसी बैच निरीक्षण #QC_711",
          "कार्यशाला वीडियो पुरालेख",
        ],
      },
    ],
    productsCreated: {
      count: 7,
      types: [
        "Hexagonal Lattice Storage Baskets",
        "Open-Weave Fruit Bowls",
        "Woven Planters",
        "Covered Laundry Bampers",
        "Bespoke Hospitality Trays",
        "Artisanal Bread Baskets",
        "Lidded Herb Containers",
      ],
      typesHi: [
        "षट्कोणीय भंडारण टोकरियां",
        "खुली बुनाई फल कटोरे",
        "बुने हुए प्लांटर्स",
        "कवर्ड लॉन्ड्री बास्केट्स",
        "हॉस्पिटैलिटी सर्विंग ट्रे",
        "हस्तनिर्मित ब्रेड बास्केट",
        "ढक्कनदार हर्ब डिब्बे",
      ],
    },
    customisation: {
      supported: true,
      options: [
        "Custom Sizing (15cm to 80cm diameter)",
        "Colour Tinting (Botanical Walnut, Madder Red, Natural Tan)",
        "Lattice Density & Pattern Variations",
        "Integrated Natural Leather Handles",
      ],
      optionsHi: [
        "कस्टम आकार (15 सेमी से 80 सेमी व्यास)",
        "रंग आभा (अखरोट भूरा, मजीठ लाल, प्राकृतिक टैन)",
        "जाली घनत्व और पैटर्न विविधता",
        "एकीकृत प्राकृतिक चमड़े के हैंडल",
      ],
    },
    productionCapability: {
      currentMonthlyCapacity: 150,
      typicalLeadTime: "7–10 days",
      typicalLeadTimeHi: "7–10 कार्यदिवस",
      customOrdersSupported: true,
      minOrderQuantity: 25,
      availableCapacity: 85,
      capacityNote:
        "Operational estimate calculated from active workshop benches and seasoned cane supply. Not a speculative quota.",
      capacityNoteHi:
        "कार्यशाला की सक्रिय बेंचों और उपचारित बेंत आपूर्ति पर आधारित व्यावहारिक अनुमान। कोई काल्पनिक वादा नहीं।",
    },
    trackRecord: {
      totalProductsCreated: 7,
      ordersFulfilled: 18,
      b2cExperience: 12,
      b2bExperience: 6,
      qualityRecordsCount: 5,
      fulfilmentHistory: "18 Completed Dispatches • 100% On-Time • 0 Return Disputes",
      fulfilmentHistoryHi: "18 पूर्ण प्रेषण • 100% समय पर • 0 विवाद या वापसी",
    },
    qualityRecords: {
      checksCompleted: 5,
      status: "PASSED_ZERO_DEFECT",
      evidenceSummary:
        "5 formal QC inspections passed (tensile weave test, moisture tolerance, smooth rim bevels).",
      evidenceSummaryHi:
        "5 औपचारिक क्यूसी निरीक्षण उत्तीर्ण (तन्यता बुनाई, नमी सहिष्णुता, चिकने किनारे)।",
      lastAuditRef: "QC_AUDIT_WB_2026_882",
      auditHistory: [
        "18 Sep 2026: Tensile Weave & Moisture Balance (Passed)",
        "02 Aug 2026: Batch Sizing Calibration & Rim Joinery (Passed)",
        "14 Jun 2026: Non-Toxic Botanical Oil Surface Finish (Passed)",
      ],
      auditHistoryHi: [
        "18 सितंबर 2026: तन्यता बुनाई व नमी संतुलन (उत्तीर्ण)",
        "02 अगस्त 2026: बैच आकार अंशांकन व रिम जोड़ (उत्तीर्ण)",
        "14 जून 2026: गैर-विषाक्त वनस्पति तेल फिनिश (उत्तीर्ण)",
      ],
    },
    freshness: {
      lastUpdated: "12 Sep 2026",
      lastUpdatedHi: "12 सितंबर 2026",
      lastEvidenceRecorded: "18 Sep 2026",
      lastEvidenceRecordedHi: "18 सितंबर 2026",
    },
    traceableEvidence: [
      {
        item: "Natural Rattan & Bamboo Provenance",
        itemHi: "प्राकृतिक बांस व बेंत स्रोत",
        evidenceType: "Workshop Audit & Invoice",
        evidenceTypeHi: "कार्यशाला ऑडिट व बीजक",
        reference: "EV_MAT_BAMBOO_902",
        date: "14 Sep 2026",
      },
      {
        item: "Hexagonal Lattice Technique",
        itemHi: "षट्कोणीय जाली बुनाई तकनीक",
        evidenceType: "Studio Video Documentation",
        evidenceTypeHi: "स्टूडियो वीडियो प्रलेखन",
        reference: "EV_TECH_HEX_104",
        date: "10 Sep 2026",
      },
      {
        item: "Completed B2B Order #ORD_B2B_104",
        itemHi: "संपन्न बी2बी आदेश #ORD_B2B_104",
        evidenceType: "Institutional Receipt & Dispatch",
        evidenceTypeHi: "संस्थागत रसीद व प्रेषण",
        reference: "ORD_B2B_104_CONF",
        date: "18 Sep 2026",
      },
      {
        item: "Tensile Quality Record",
        itemHi: "तन्यता गुणवत्ता परीक्षण",
        evidenceType: "Cluster Quality Certificate",
        evidenceTypeHi: "क्लस्टर गुणवत्ता प्रमाणपत्र",
        reference: "QC_AUDIT_WB_2026_882",
        date: "18 Sep 2026",
      },
    ],
  },

  terracotta: {
    id: "CAP_TERRACOTTA_02",
    name: "Terracotta & Pottery",
    nameHi: "टेराकोटा व मृदभांड शिल्प",
    craftType: "Terracotta & Earthenware Sculpting",
    craftTypeHi: "टेराकोटा एवं मृदा शिल्प",
    status: "CONFIRMED",
    verificationStatus: "Verified",
    readiness: "Ready",
    materials: [
      {
        name: "River Alluvial Red Clay (Ganga Basin)",
        nameHi: "गंगा बेसिन की तलछट लाल मिट्टी",
        status: "Confirmed",
        evidence: [
          "Clay bed soil testing certificate #SL_441",
          "Workshop physical inspection audit",
          "3 Fulfilled institutional dispatches",
        ],
        evidenceHi: [
          "मिट्टी तलछट परीक्षण प्रमाण पत्र #SL_441",
          "कार्यशाला भौतिक निरीक्षण ऑडिट",
          "3 संपन्न संस्थागत प्रेषण",
        ],
      },
      {
        name: "Botanical Mica Powder & Natural Ochre Slip",
        nameHi: "प्राकृतिक अभ्रक चूर्ण व गेरू लेप",
        status: "Confirmed",
        evidence: [
          "Traditional kiln recipe documentation",
          "Non-toxic laboratory food-safety assay",
        ],
        evidenceHi: [
          "पारंपरिक भट्ठी प्रलेखन",
          "गैर-विषाक्त खाद्य सुरक्षा लैब रिपोर्ट",
        ],
      },
    ],
    techniques: [
      {
        name: "Slow Potter's Wheel Hand Throwing",
        nameHi: "धीमे कुम्हार चाक पर हस्त गढ़ाई",
        status: "Confirmed",
        evidence: [
          "Generational lineage archive",
          "High-definition studio craftsmanship recording",
        ],
        evidenceHi: [
          "पीढ़ीगत वंशावली पुरालेख",
          "स्टूडियो शिल्प कौशल वीडियो रिकॉर्डिंग",
        ],
      },
      {
        name: "Relief Chisel Carving & Natural Wood Kiln Firing",
        nameHi: "उभार नक्काशी व प्राकृतिक काष्ठ भट्ठी पकाई",
        status: "Confirmed",
        evidence: [
          "Kiln pyrometer heat log audit",
          "Cluster quality seal #CL_QC_901",
        ],
        evidenceHi: [
          "भट्ठी तापक्रम लॉग ऑडिट",
          "क्लस्टर गुणवत्ता मुहर #CL_QC_901",
        ],
      },
    ],
    productsCreated: {
      count: 9,
      types: [
        "Natural Water Pitchers (Matkas)",
        "Spouted Terracotta Jugs",
        "Clay Curd Handis",
        "Deep Sculpted Wall Plates",
        "Temple Terracotta Sculptures",
        "Aromatherapy Clay Diffusers",
        "Garden Planters with Natural Drain",
      ],
      typesHi: [
        "प्राकृतिक जल मटके व सुराही",
        "टेराकोटा पानी जग",
        "मिट्टी की दही हांडी",
        "दीवार सजावटी प्लेट्स",
        "मंदिर टेराकोटा मूर्तियां",
        "सुगंधित मिट्टी डिफ्यूज़र",
        "प्राकृतिक जल निकासी प्लांटर्स",
      ],
    },
    customisation: {
      supported: true,
      options: [
        "Volume Sizing (1 Litre to 20 Litre capacity)",
        "Traditional Bankura Horse / Floral Relief Motifs",
        "Smoked Black Finish (Bio-Reduction Kiln)",
        "Laser-Etched Artisan Seal / Buyer Branding",
      ],
      optionsHi: [
        "आयतन आकार (1 लीटर से 20 लीटर क्षमता)",
        "पारंपरिक बांकुरा घोड़ा / पुष्प नक्काशी प्रारूप",
        "धुंआदार काला टेराकोटा (बायो-रिडक्शन पकाई)",
        "लेज़र-अंकित कारीगर मुहर / खरीदार ब्रांडिंग",
      ],
    },
    productionCapability: {
      currentMonthlyCapacity: 400,
      typicalLeadTime: "10–14 days",
      typicalLeadTimeHi: "10–14 कार्यदिवस",
      customOrdersSupported: true,
      minOrderQuantity: 50,
      availableCapacity: 220,
      capacityNote:
        "Capacity bounded by natural solar drying times and traditional wood-fired kiln firing cycles.",
      capacityNoteHi:
        "उत्पादन क्षमता प्राकृतिक धूप में सुखाने की अवधि और पारंपरिक भट्ठी चक्रों पर निर्भर है।",
    },
    trackRecord: {
      totalProductsCreated: 9,
      ordersFulfilled: 26,
      b2cExperience: 18,
      b2bExperience: 8,
      qualityRecordsCount: 7,
      fulfilmentHistory: "26 Completed Dispatches • 0 Breakage Claims • Verified Packaging",
      fulfilmentHistoryHi: "26 पूर्ण प्रेषण • 0 टूटन शिकायत • सत्यापित पैकेजिंग",
    },
    qualityRecords: {
      checksCompleted: 7,
      status: "PASSED_ZERO_DEFECT",
      evidenceSummary:
        "7 QC audits passed (porosity cooling index, drop-test cushioning, lead/cadmium zero-migration).",
      evidenceSummaryHi:
        "7 क्यूसी परीक्षण सफल (शीतलन सूचकांक, ड्रॉप-टेस्ट कुशनिंग, लेड/कैडमियम शून्य-प्रवासन)।",
      lastAuditRef: "QC_TERRA_BANKURA_2026_409",
      auditHistory: [
        "22 Sep 2026: Food Contact Safety & Heavy Metal Leaching (Passed)",
        "08 Aug 2026: Kiln Thermal Shock & Porosity Curing (Passed)",
        "15 May 2026: Transit Drop Packaging Validation (Passed)",
      ],
      auditHistoryHi: [
        "22 सितंबर 2026: खाद्य संपर्क सुरक्षा व भारी धातु मुक्तता (उत्तीर्ण)",
        "08 अगस्त 2026: भट्ठी थर्मल शॉक व सरंध्रता परीक्षण (उत्तीर्ण)",
        "15 मई 2026: पारगमन ड्रॉप पैकेजिंग सत्यापन (उत्तीर्ण)",
      ],
    },
    freshness: {
      lastUpdated: "24 Sep 2026",
      lastUpdatedHi: "24 सितंबर 2026",
      lastEvidenceRecorded: "26 Sep 2026",
      lastEvidenceRecordedHi: "26 सितंबर 2026",
    },
    traceableEvidence: [
      {
        item: "Alluvial Clay Laboratory Assay",
        itemHi: "नदी मिट्टी प्रयोगशाला परीक्षण",
        evidenceType: "Soil Mineral Report",
        evidenceTypeHi: "मृदा खनिज रिपोर्ट",
        reference: "EV_SOIL_BNK_441",
        date: "20 Sep 2026",
      },
      {
        item: "Wheel Throwing Certification",
        itemHi: "चाक गढ़ाई प्रमाणन",
        evidenceType: "Cluster Guild Evaluation",
        evidenceTypeHi: "क्लस्टर गिल्ड मूल्यांकन",
        reference: "EV_MASTERCRAFT_081",
        date: "15 Sep 2026",
      },
      {
        item: "B2B Bulk Export Batch #ORD_B2B_088",
        itemHi: "बी2बी निर्यात बैच #ORD_B2B_088",
        evidenceType: "Commercial Dispatch Bill",
        evidenceTypeHi: "वाणिज्यिक प्रेषण बिल",
        reference: "DISP_EXP_2026_088",
        date: "24 Sep 2026",
      },
    ],
  },

  handloom: {
    id: "CAP_HANDLOOM_03",
    name: "Handloom & Tussar Silk Weaving",
    nameHi: "हथकरघा व टसर रेशम बुनाई",
    craftType: "Pure Handloom & Brocade Weaving",
    craftTypeHi: "शुद्ध हथकरघा एवं ब्रोकेड बुनाई",
    status: "CONFIRMED",
    verificationStatus: "Verified",
    readiness: "Ready",
    materials: [
      {
        name: "Natural Handspun Tussar & Mulberry Silk",
        nameHi: "प्राकृतिक हस्तनिर्मित टसर व शहतूत रेशम",
        status: "Confirmed",
        evidence: [
          "Silk Mark India certification #SM_992",
          "Artisan yarn lot purity assay #YRN_411",
          "Fulfilled institutional order #ORD_B2B_219",
        ],
        evidenceHi: [
          "सिल्क मार्क इंडिया प्रमाणन #SM_992",
          "कारीगर धागा शुद्धता परख #YRN_411",
          "संपन्न संस्थागत आदेश #ORD_B2B_219",
        ],
      },
      {
        name: "Organic Botanical Dyes & River Cleansing",
        nameHi: "प्राकृतिक वानस्पतिक रंग व नदी प्रक्षालन",
        status: "Confirmed",
        evidence: [
          "Cluster eco-friendly lab certificate #ECO_CG_412",
          "Azo-free skin safety test passed",
        ],
        evidenceHi: [
          "क्लस्टर पर्यावरण-अनुकूल लैब प्रमाण #ECO_CG_412",
          "एज़ो-मुक्त त्वचा सुरक्षा परीक्षण सफल",
        ],
      },
    ],
    techniques: [
      {
        name: "Traditional Pit Loom Flying Shuttle Weaving",
        nameHi: "पारंपरिक गड्ढा लूम फ्लाई शटल बुनाई",
        status: "Confirmed",
        evidence: [
          "Studio weaving craftsmanship archive",
          "Master weaver guild peer evaluation",
        ],
        evidenceHi: [
          "स्टूडियो बुनाई शिल्प कौशल पुरालेख",
          "मास्टर बुनकर गिल्ड सहकर्मी मूल्यांकन",
        ],
      },
      {
        name: "Extra-Weft Jacquard Motif Inlay",
        nameHi: "अतिरिक्त-ताना जैकार्ड रूपांकन इनले",
        status: "Confirmed",
        evidence: [
          "Weft density audit #QC_JAC_881",
          "Geographical Indication Registry verification",
        ],
        evidenceHi: [
          "ताना घनत्व ऑडिट #QC_JAC_881",
          "भौगोलिक उपदर्शन रजिस्ट्री सत्यापन",
        ],
      },
    ],
    productsCreated: {
      count: 8,
      types: [
        "Pure Handspun Tussar Silk Sarees",
        "Hand-woven Silk Dupattas",
        "Textured Khadi Cotton Throws",
        "Brocade Stoles with Zari Borders",
        "Natural Organic Linen Table Runners",
        "Handloom Cushion Fabrics",
      ],
      typesHi: [
        "शुद्ध हस्तनिर्मित टसर रेशम साड़ियां",
        "हथकरघा रेशम दुपट्टे",
        "खादी सूती थ्रो व चादरें",
        "जरी किनारी वाले ब्रोकेड स्टोल",
        "प्राकृतिक लिनन टेबल रनर",
        "हथकरघा कुशन वस्त्र",
      ],
    },
    customisation: {
      supported: true,
      options: [
        "Custom Warp/Weft Sizing (1m to 6.5m length)",
        "Botanical Dye Palette Customization (Turmeric, Indigo, Madder)",
        "Zari Density Adjustments (Pure Silver or Tested Zari)",
        "Bespoke Monogram or Emblem Weaving",
      ],
      optionsHi: [
        "कस्टम ताना/बाना आकार (1 मी से 6.5 मी लंबाई)",
        "वानस्पतिक रंग पैलेट अनुकूलन (हल्दी, नील, मजीठ)",
        "जरी घनत्व समायोजन (शुद्ध चांदी या परीक्षित जरी)",
        "कस्टम मोनोग्राम या प्रतीक बुनाई",
      ],
    },
    productionCapability: {
      currentMonthlyCapacity: 85,
      typicalLeadTime: "16–20 days",
      typicalLeadTimeHi: "16–20 कार्यदिवस",
      customOrdersSupported: true,
      minOrderQuantity: 15,
      availableCapacity: 60,
      capacityNote:
        "Handloom capacity is physically bounded by manual shuttle cadence (max 4–6 metres per artisan day).",
      capacityNoteHi:
        "हथकरघा क्षमता हस्तचालित शटल गति (अधिकतम 4-6 मीटर प्रति कार्यदिवस) द्वारा सीमित है।",
    },
    trackRecord: {
      totalProductsCreated: 8,
      ordersFulfilled: 22,
      b2cExperience: 14,
      b2bExperience: 8,
      qualityRecordsCount: 6,
      fulfilmentHistory: "22 Completed Dispatches • 100% Weft Tension Uniformity • 0 Returns",
      fulfilmentHistoryHi: "22 पूर्ण प्रेषण • 100% ताना-बाना एकरूपता • 0 वापसी",
    },
    qualityRecords: {
      checksCompleted: 6,
      status: "PASSED_ZERO_DEFECT",
      evidenceSummary:
        "6 formal silk mark & color fastness audits passed with zero dimensional shrinkage.",
      evidenceSummaryHi:
        "6 औपचारिक सिल्क मार्क व रंग स्थिरता परीक्षण शून्य संकोचन के साथ सफल।",
      lastAuditRef: "QC_SILK_CG_2026_551",
      auditHistory: [
        "20 Sep 2026: Silk Purity Assay & Weight per Sq Metre (Passed)",
        "11 Aug 2026: Wet Rubbing Fastness & Azo-Free Dye Audit (Passed)",
        "02 Jun 2026: Tensile Warp Stress Resistance (Passed)",
      ],
      auditHistoryHi: [
        "20 सितंबर 2026: रेशम शुद्धता परख व भार प्रति वर्ग मीटर (उत्तीर्ण)",
        "11 अगस्त 2026: गीली रगड़ स्थिरता व एज़ो-मुक्त रंग परीक्षण (उत्तीर्ण)",
        "02 जून 2026: तन्यता ताना तनाव प्रतिरोध (उत्तीर्ण)",
      ],
    },
    freshness: {
      lastUpdated: "21 Sep 2026",
      lastUpdatedHi: "21 सितंबर 2026",
      lastEvidenceRecorded: "25 Sep 2026",
      lastEvidenceRecordedHi: "25 सितंबर 2026",
    },
    traceableEvidence: [
      {
        item: "Silk Mark India Registration",
        itemHi: "सिल्क मार्क इंडिया पंजीकरण",
        evidenceType: "Central Silk Board Certificate",
        evidenceTypeHi: "केंद्रीय रेशम बोर्ड प्रमाण पत्र",
        reference: "SM_IND_2026_992",
        date: "12 Sep 2026",
      },
      {
        item: "Flying Shuttle Video Demonstration",
        itemHi: "फ्लाई शटल वीडियो प्रदर्शन",
        evidenceType: "Craftsmanship Video Archive",
        evidenceTypeHi: "शिल्प कौशल वीडियो पुरालेख",
        reference: "EV_LOOM_DEMO_042",
        date: "18 Sep 2026",
      },
      {
        item: "B2B Export Order #ORD_B2B_219",
        itemHi: "बी2बी निर्यात आदेश #ORD_B2B_219",
        evidenceType: "Commercial Dispatch Bill",
        evidenceTypeHi: "वाणिज्यिक प्रेषण बिल",
        reference: "DISP_TEX_2026_219",
        date: "25 Sep 2026",
      },
    ],
  },

  woodcarving: {
    id: "CAP_WOOD_04",
    name: "Wood Carving & Timber Inlay",
    nameHi: "काष्ठ नक्काशी व पीतल इनले शिल्प",
    craftType: "Seasoned Timber Relief Carving & Inlay",
    craftTypeHi: "उपचारित काष्ठ उभार नक्काशी व इनले",
    status: "CONFIRMED",
    verificationStatus: "Verified",
    readiness: "Ready",
    materials: [
      {
        name: "Seasoned Sustainable Sheesham & Teak Wood",
        nameHi: "उपचारित पर्यावरण-अनुकूल शीशम व सागौन काष्ठ",
        status: "Confirmed",
        evidence: [
          "FSC Certified sustainable timber invoice #EV_FSC_992",
          "Moisture-content kiln check report #KILN_502",
        ],
        evidenceHi: [
          "एफएससी प्रमाणित काष्ठ बीजक #EV_FSC_992",
          "नमी-मात्रा भट्ठी परीक्षण रिपोर्ट #KILN_502",
        ],
      },
      {
        name: "Pure Solid Brass Wire & Shellac Lacquer",
        nameHi: "शुद्ध ठोस पीतल तार व प्राकृतिक लाख",
        status: "Confirmed",
        evidence: [
          "Non-toxic lacquer assay certification",
          "Raw brass alloy chemical composition sheet",
        ],
        evidenceHi: [
          "अहानिकर लाख परख प्रमाणन",
          "कच्ची पीतल मिश्र धातु रासायनिक रिपोर्ट",
        ],
      },
    ],
    techniques: [
      {
        name: "High-Relief Traditional Hand Chisel Gouging",
        nameHi: "उच्च-उभार पारंपरिक हस्त छेनी नक्काशी",
        status: "Confirmed",
        evidence: [
          "Guild Master Artisan peer evaluation",
          "Workshop high-resolution craftsmanship video",
        ],
        evidenceHi: [
          "गिल्ड मास्टर कारीगर सहकर्मी मूल्यांकन",
          "कार्यशाला उच्च-रिज़ॉल्यूशन शिल्प वीडियो",
        ],
      },
      {
        name: "Tarkashi Fine Brass Wire Inlay & Planing",
        nameHi: "तारकशी सूक्ष्म पीतल तार इनले व घिसाई",
        status: "Confirmed",
        evidence: [
          "Workshop audit report #QC_INLAY_330",
          "GI registered artisan node credential",
        ],
        evidenceHi: [
          "कार्यशाला ऑडिट रिपोर्ट #QC_INLAY_330",
          "जीआई पंजीकृत कारीगर नोड साख",
        ],
      },
    ],
    productsCreated: {
      count: 6,
      types: [
        "Jali Carved Storage Keepsake Boxes",
        "Brass Inlay Decorative Serving Trays",
        "Sculpted Floral Relief Wall Panels",
        "Turned Channapatna Lacquerware Accents",
        "Solid Hardwood Bookends & Coasters",
      ],
      typesHi: [
        "जाली नक्काशीदार भंडारण बक्से",
        "पीतल इनले सजावटी सर्विंग ट्रे",
        "पुष्प उभार नक्काशी दीवार पैनल",
        "चन्नापटना लाख खिलौने व सजावटी वस्तुएं",
        "ठोस काष्ठ बुकएंड्स व कोस्टर",
      ],
    },
    customisation: {
      supported: true,
      options: [
        "Timber Wood Grain Selection (Sheesham, Teak, Mango)",
        "Bespoke Brass Wire Inlay Patterns or Family Monograms",
        "Dimensional Sizing (Small 15cm to Architectural 120cm panels)",
        "Matte Wax vs Hand-Polished High Gloss Finish",
      ],
      optionsHi: [
        "काष्ठ प्रकार चयन (शीशम, सागौन, आम)",
        "कस्टम पीतल तार इनले पैटर्न या मोनोग्राम",
        "आकार विस्तार (15 सेमी से 120 सेमी तक)",
        "मैट मोम फिनिश अथवा हस्त-पॉलिश ग्लॉस",
      ],
    },
    productionCapability: {
      currentMonthlyCapacity: 100,
      typicalLeadTime: "14–18 days",
      typicalLeadTimeHi: "14–18 कार्यदिवस",
      customOrdersSupported: true,
      minOrderQuantity: 20,
      availableCapacity: 75,
      capacityNote:
        "Timber requires 30-day controlled solar curing prior to joinery to eliminate warpage under varied humidity.",
      capacityNoteHi:
        "आर्द्रता के प्रभाव से बचने हेतु नक्काशी से पूर्व लकड़ी को 30 दिन तक नियंत्रित सुखाना अनिवार्य है।",
    },
    trackRecord: {
      totalProductsCreated: 6,
      ordersFulfilled: 19,
      b2cExperience: 11,
      b2bExperience: 8,
      qualityRecordsCount: 5,
      fulfilmentHistory: "19 Completed Batches • Zero Splinter or Warpage Disputes",
      fulfilmentHistoryHi: "19 संपन्न बैच • शून्य दरार या विकृति विवाद",
    },
    qualityRecords: {
      checksCompleted: 5,
      status: "PASSED_ZERO_DEFECT",
      evidenceSummary:
        "5 formal QC inspections passed (moisture meter below 10%, brass flush joinery, food-safe oil).",
      evidenceSummaryHi:
        "5 औपचारिक क्यूसी परीक्षण उत्तीर्ण (नमी 10% से कम, सपाट पीतल जोड़, खाद्य-सुरक्षित तेल)।",
      lastAuditRef: "QC_SAHARANPUR_2026_402",
      auditHistory: [
        "19 Sep 2026: Timber Moisture Meter & Dimensional Flatness (Passed)",
        "04 Aug 2026: Brass Inlay Flushness & Edge Bevel Safety (Passed)",
        "28 May 2026: Food-Safe Plant Oil Finish Chemical Assay (Passed)",
      ],
      auditHistoryHi: [
        "19 सितंबर 2026: काष्ठ नमी मीटर व आयामी समतलता (उत्तीर्ण)",
        "04 अगस्त 2026: पीतल इनले समतलता व धार सुरक्षा (उत्तीर्ण)",
        "28 मई 2026: खाद्य-सुरक्षित वनस्पति तेल फिनिश रासायनिक परख (उत्तीर्ण)",
      ],
    },
    freshness: {
      lastUpdated: "19 Sep 2026",
      lastUpdatedHi: "19 सितंबर 2026",
      lastEvidenceRecorded: "23 Sep 2026",
      lastEvidenceRecordedHi: "23 सितंबर 2026",
    },
    traceableEvidence: [
      {
        item: "FSC Sustainable Timber Invoice",
        itemHi: "एफएससी प्रमाणित काष्ठ बीजक",
        evidenceType: "Forest Certification Document",
        evidenceTypeHi: "वन प्रमाणन दस्तावेज",
        reference: "EV_FSC_TIMBER_992",
        date: "14 Sep 2026",
      },
      {
        item: "Tarkashi Inlay Video Archive",
        itemHi: "तारकशी इनले वीडियो पुरालेख",
        evidenceType: "Studio Craftsmanship Recording",
        evidenceTypeHi: "स्टूडियो शिल्प रिकॉर्डिंग",
        reference: "EV_TARKASHI_VID_110",
        date: "10 Sep 2026",
      },
      {
        item: "Corporate Batch Dispatch #ORD_WOD_88",
        itemHi: "संस्थागत बैच प्रेषण #ORD_WOD_88",
        evidenceType: "Commercial Dispatch Receipt",
        evidenceTypeHi: "वाणिज्यिक प्रेषण रसीद",
        reference: "DISP_WOD_2026_088",
        date: "23 Sep 2026",
      },
    ],
  },

  dhokra: {
    id: "CAP_DHOKRA_05",
    name: "Dhokra Lost-Wax Bell Metal Craft",
    nameHi: "ढोकरा लॉस्ट-वैक्स बेल मेटल शिल्प",
    craftType: "Non-Ferrous Lost-Wax Metal Casting",
    craftTypeHi: "अलौह लॉस्ट-वैक्स धातु ढलाई",
    status: "CONFIRMED",
    verificationStatus: "Verified",
    readiness: "Ready",
    materials: [
      {
        name: "Bell Metal & Recycled Brass Bronze Alloy",
        nameHi: "बेल मेटल व पुनर्चक्रित पीतल कांस्य मिश्र धातु",
        status: "Confirmed",
        evidence: [
          "Spectrometry alloy testing report (78% Cu, 22% Sn)",
          "Artisan guild scrap batch declaration",
        ],
        evidenceHi: [
          "स्पेक्ट्रोमेट्री धातु परीक्षण रिपोर्ट (78% तांबा, 22% टिन)",
          "कारीगर गिल्ड स्क्रैप लॉट घोषणा",
        ],
      },
      {
        name: "Wild Forest Beeswax & River Alluvial Core",
        nameHi: "प्राकृतिक वन मधुमक्खी मोम व चिकनी मिट्टी कोर",
        status: "Confirmed",
        evidence: [
          "Forest cooperative purchase invoice",
          "Workshop traditional mold assay verification",
        ],
        evidenceHi: [
          "वन सहकारी समिति क्रय बीजक",
          "कार्यशाला पारंपरिक सांचा परीक्षण सत्यापन",
        ],
      },
    ],
    techniques: [
      {
        name: "Hand-Rolled Beeswax Thread Core Sculpting",
        nameHi: "हस्तनिर्मित मधुमक्खी मोम तार कोर मूर्तिकला",
        status: "Confirmed",
        evidence: [
          "Tribal heritage generational lineage archive",
          "Studio craftsmanship video recording",
        ],
        evidenceHi: [
          "जनजातीय धरोहर पीढ़ीगत वंशावली पुरालेख",
          "स्टूडियो शिल्प कौशल वीडियो रिकॉर्डिंग",
        ],
      },
      {
        name: "Open-Ground Pit Kiln Smelting & Metal Pouring",
        nameHi: "खुले गड्ढे की भट्ठी में धातु पिघलाई व ढलाई",
        status: "Confirmed",
        evidence: [
          "Kiln pyrometer heat log audit #HT_773",
          "Bastar artisan guild seal #BST_QC_091",
        ],
        evidenceHi: [
          "भट्ठी पायरोमीटर तापक्रम ऑडिट #HT_773",
          "बस्तर कारीगर गिल्ड मुहर #BST_QC_091",
        ],
      },
    ],
    productsCreated: {
      count: 5,
      types: [
        "Traditional Tribal Musician Figurines",
        "Dhokra Lost-Wax Oil Lamps (Diyas)",
        "Elephant & Horse Totemic Sculptures",
        "Geometric Open-Work Wall Hangings",
        "Bespoke Bell Metal Paperweights & Awards",
      ],
      typesHi: [
        "पारंपरिक जनजातीय संगीतकार मूर्तियां",
        "ढोकरा लॉस्ट-वैक्स दीप (दिए)",
        "हाथी व घोड़ा टोटेमिक धातु शिल्प",
        "ज्यामितीय जालीदार दीवार हैंगिंग",
        "कस्टम बेल मेटल पेपरवेट व स्मृति चिन्ह",
      ],
    },
    customisation: {
      supported: true,
      options: [
        "Sculpture Scale (10cm miniature to 60cm grand centerpiece)",
        "Patina Finish (Antiqued Bronze, Burnished Gold, or Natural Verdigris)",
        "Tribal Motif Adaptation (Sun, Moon, Peacocks, Village Life)",
        "Mounted Wooden Bases with Brass Inscription Plaques",
      ],
      optionsHi: [
        "मूर्तिकला आकार (10 सेमी लघु से 60 सेमी केंद्र बिंदु)",
        "पैटिना फिनिश (पुरातन कांस्य, चमकीला स्वर्ण, प्राकृतिक हरिता)",
        "जनजातीय रूपांकन अनुकूलन (सूर्य, चंद्रमा, मोर, ग्रामीण जीवन)",
        "काष्ठ आधार पर पीतल शिलालेख पट्टिका",
      ],
    },
    productionCapability: {
      currentMonthlyCapacity: 50,
      typicalLeadTime: "18–24 days",
      typicalLeadTimeHi: "18–24 कार्यदिवस",
      customOrdersSupported: true,
      minOrderQuantity: 10,
      availableCapacity: 35,
      capacityNote:
        "Every single cast requires complete destruction of the clay mold (lost-wax technique), keeping monthly batches boutique and unique.",
      capacityNoteHi:
        "प्रत्येक ढलाई में मिट्टी का सांचा पूर्णतः टूट जाता है (लॉस्ट-वैक्स विधि), जिससे मासिक क्षमता स्वाभाविक रूप से सीमित रहती है।",
    },
    trackRecord: {
      totalProductsCreated: 5,
      ordersFulfilled: 15,
      b2cExperience: 9,
      b2bExperience: 6,
      qualityRecordsCount: 4,
      fulfilmentHistory: "15 Completed Batches • Zero Casting Void Defects • 100% Solid Core",
      fulfilmentHistoryHi: "15 संपन्न बैच • शून्य कास्टिंग छिद्र दोष • 100% ठोस कोर",
    },
    qualityRecords: {
      checksCompleted: 4,
      status: "PASSED_ZERO_DEFECT",
      evidenceSummary:
        "4 metallurgical inspections passed (density ultrasound, zero surface crack, lead-free brass assay).",
      evidenceSummaryHi:
        "4 धातुकर्म निरीक्षण सफल (घनत्व अल्ट्रासाउंड, दरार-मुक्त सतह, लेड-मुक्त पीतल परीक्षण)।",
      lastAuditRef: "QC_BASTAR_2026_773",
      auditHistory: [
        "16 Sep 2026: Metallurgical Density & Wall Thickness Ultrasound (Passed)",
        "08 Jul 2026: Non-Destructive Surface Porosity Inspection (Passed)",
        "19 Apr 2026: Bell Metal Lead/Arsenic Non-Toxicity Assay (Passed)",
      ],
      auditHistoryHi: [
        "16 सितंबर 2026: धातुकर्म घनत्व व दीवार मोटाई अल्ट्रासाउंड (उत्तीर्ण)",
        "08 जुलाई 2026: गैर-विनाशकारी सतह सरंध्रता निरीक्षण (उत्तीर्ण)",
        "19 अप्रैल 2026: बेल मेटल लेड/आर्सेनिक अहानिकरता परख (उत्तीर्ण)",
      ],
    },
    freshness: {
      lastUpdated: "16 Sep 2026",
      lastUpdatedHi: "16 सितंबर 2026",
      lastEvidenceRecorded: "22 Sep 2026",
      lastEvidenceRecordedHi: "22 सितंबर 2026",
    },
    traceableEvidence: [
      {
        item: "Tribal Bell Metal Alloy Assay",
        itemHi: "जनजातीय बेल मेटल मिश्र धातु परख",
        evidenceType: "Govt Testing Lab Certificate",
        evidenceTypeHi: "सरकारी परीक्षण लैब प्रमाण पत्र",
        reference: "MET_ASSAY_BST_773",
        date: "12 Sep 2026",
      },
      {
        item: "Lost-Wax Process Lineage Video",
        itemHi: "लॉस्ट-वैक्स प्रक्रिया वंशावली वीडियो",
        evidenceType: "National Heritage Documentation",
        evidenceTypeHi: "राष्ट्रीय धरोहर प्रलेखन",
        reference: "EV_DHOKRA_HIST_019",
        date: "04 Sep 2026",
      },
      {
        item: "Institutional Order #ORD_MET_99",
        itemHi: "संस्थागत आदेश #ORD_MET_99",
        evidenceType: "Commercial Dispatch Bill",
        evidenceTypeHi: "वाणिज्यिक प्रेषण बिल",
        reference: "DISP_BST_2026_099",
        date: "22 Sep 2026",
      },
    ],
  },
};

interface HunarCapabilityTwinProps {
  artisanId?: string;
  artisanName?: string;
  clusterName?: string;
  backendProfile?: HunarProfile | null;
  defaultCraftKey?: string;
}

export function HunarCapabilityTwin({
  artisanId = "ART001",
  artisanName = "Rameshwar Kumbhar",
  clusterName = "Bankura Cluster Guild",
  backendProfile,
  defaultCraftKey = "basketry",
}: HunarCapabilityTwinProps) {
  const { language } = useLanguage();

  // Active Craft in the Dropdown Selector
  const [selectedCraftKey, setSelectedCraftKey] = useState<string>(
    defaultCraftKey && CAPABILITY_DATA[defaultCraftKey] ? defaultCraftKey : "basketry"
  );

  React.useEffect(() => {
    if (defaultCraftKey && CAPABILITY_DATA[defaultCraftKey]) {
      setSelectedCraftKey(defaultCraftKey);
    }
  }, [defaultCraftKey]);

  // Dropdown / Accordion Section Toggles
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    capabilities: true,
    production: true,
    trackRecord: true,
    evidence: true,
    quality: false,
    freshness: false,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const expandAll = () => {
    setOpenSections({
      capabilities: true,
      production: true,
      trackRecord: true,
      evidence: true,
      quality: true,
      freshness: true,
    });
  };

  const collapseAll = () => {
    setOpenSections({
      capabilities: false,
      production: false,
      trackRecord: false,
      evidence: false,
      quality: false,
      freshness: false,
    });
  };

  const record = CAPABILITY_DATA[selectedCraftKey] || CAPABILITY_DATA.basketry;

  const getStatusBadge = (status: CapabilityRecord["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return {
          bg: "bg-[#EBF1ED] border-[#3F5E4D]/20 text-[#3F5E4D]",
          label: language === "hi" ? "पुष्ट (प्रमाणित)" : "CONFIRMED",
          desc: language === "hi" ? "मजबूत समर्थक प्रमाण उपलब्ध" : "Strong supporting evidence exists",
        };
      case "DEVELOPING":
        return {
          bg: "bg-blue-50 border-blue-200 text-blue-800",
          label: language === "hi" ? "प्रगतिशील (विकासशील)" : "DEVELOPING",
          desc: language === "hi" ? "आंशिक प्रमाण उपलब्ध" : "Partially demonstrated with limited evidence",
        };
      case "LIMITED_EVIDENCE":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-800",
          label: language === "hi" ? "सीमित साक्ष्य" : "LIMITED EVIDENCE",
          desc: language === "hi" ? "अतिरिक्त पुष्टि प्रतीक्षित" : "Information exists but insufficient",
        };
      case "NEEDS_VERIFICATION":
      default:
        return {
          bg: "bg-stone-100 border-stone-200 text-stone-700",
          label: language === "hi" ? "सत्यापन आवश्यक" : "NEEDS VERIFICATION",
          desc: language === "hi" ? "सत्यापन अपेक्षित" : "Requires additional evidence",
        };
    }
  };

  const getReadinessBadge = (readiness: CapabilityRecord["readiness"]) => {
    switch (readiness) {
      case "Ready":
        return {
          bg: "bg-[#EBF1ED] text-[#3F5E4D] border-[#3F5E4D]/25",
          label: language === "hi" ? "सत्यापित तत्परता (रेडी)" : "Ready",
          sub:
            language === "hi"
              ? "सामग्री, क्षमता व पूर्व आपूर्ति साक्ष्य द्वारा समर्थित"
              : "Demonstrated materials, available capacity, verified history",
        };
      case "Building Evidence":
        return {
          bg: "bg-blue-50 text-blue-800 border-blue-200",
          label: language === "hi" ? "साक्ष्य निर्माण जारी" : "Building Evidence",
          sub:
            language === "hi"
              ? "क्षमता मौजूद है परंतु पर्याप्त साक्ष्य संचित हो रहे हैं"
              : "Capability demonstrated, further order evidence accumulating",
        };
      case "Limited Readiness":
      default:
        return {
          bg: "bg-amber-50 text-amber-900 border-amber-200",
          label: language === "hi" ? "सीमित तत्परता" : "Limited Readiness",
          sub:
            language === "hi"
              ? "कुछ आवश्यक साक्ष्य या सामग्री सत्यापन अनुपलब्ध"
              : "Key evidence or production constraints pending review",
        };
    }
  };

  const statusBadge = getStatusBadge(record.status);
  const readinessBadge = getReadinessBadge(record.readiness);

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-9 border border-[#E8DFD5] shadow-xs space-y-6">
      {/* Header: Title, Principle Badge & Interactive Dropdown Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[#E8DFD5] gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#E8DFD5] text-[#C85A32]">
              <Layers className="h-4 w-4" />
            </span>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#C85A32]">
              {language === "hi" ? "हुनर जीवंत क्षमता ट्विन" : "Hunar Living Capability Twin"}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-[10px] font-semibold text-[#78716C] border border-[#E8DFD5]">
              <ShieldCheck className="h-3 w-3 text-[#3F5E4D]" />
              {language === "hi" ? "साक्ष्य-समर्थित अभिलेख" : "Evidence-Backed Record"}
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold text-[#141311]">
            {language === "hi"
              ? `${artisanName} — क्षमता प्रोफाइल`
              : `${artisanName} — Capability Profile`}
          </h2>
          <p className="text-xs text-[#78716C]">
            {language === "hi"
              ? "यह प्रोफाइल किसी कृत्रिम संख्यात्मक 'हुनर स्कोर' के स्थान पर सत्यापन योग्य वास्तविक साक्ष्य प्रस्तुत करती है।"
              : "An operational capability twin grounded in real evidence. No single fabricated 'Hunar Score' or leaderboard ranking."}
          </p>
        </div>

        {/* Dropdown Selector for Crafts & Capability Records */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-full sm:w-auto">
            <label className="block text-[10px] uppercase font-bold text-[#78716C] mb-1">
              {language === "hi" ? "शिल्प क्षमता चुनें (ड्रॉपडाउन):" : "Select Craft Capability (Dropdown):"}
            </label>
            <div className="relative">
              <select
                value={selectedCraftKey}
                onChange={(e) => setSelectedCraftKey(e.target.value)}
                className="w-full sm:w-64 appearance-none rounded-xl border border-[#C85A32]/40 bg-[#FAF8F5] px-4 py-2.5 pr-10 text-xs font-semibold text-[#1C1917] outline-none focus:border-[#C85A32] focus:bg-white shadow-xs cursor-pointer"
              >
                <option value="basketry">
                  {language === "hi" ? "बांस-बेंत शिल्प (पुष्ट साक्ष्य)" : "Basketry & Cane Weaving (Confirmed)"}
                </option>
                <option value="terracotta">
                  {language === "hi" ? "टेराकोटा व मृदभांड (पुष्ट साक्ष्य)" : "Terracotta & Pottery (Confirmed)"}
                </option>
                <option value="handloom">
                  {language === "hi" ? "हथकरघा रेशम वस्त्र (पुष्ट साक्ष्य)" : "Handloom & Tussar Silk (Confirmed)"}
                </option>
                <option value="woodcarving">
                  {language === "hi" ? "काष्ठ नक्काशी व इनले (पुष्ट साक्ष्य)" : "Wood Carving & Timber Inlay (Confirmed)"}
                </option>
                <option value="dhokra">
                  {language === "hi" ? "ढोकरा बेल मेटल शिल्प (पुष्ट साक्ष्य)" : "Dhokra Lost-Wax Bell Metal (Confirmed)"}
                </option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#C85A32]" />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto pt-4 sm:pt-4">
            <button
              type="button"
              onClick={expandAll}
              className="text-[11px] font-semibold text-[#C85A32] hover:underline"
            >
              {language === "hi" ? "सभी खोलें" : "Expand All"}
            </button>
            <span className="text-[#D6CEBE]">•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-[11px] font-semibold text-[#78716C] hover:underline"
            >
              {language === "hi" ? "सभी समेटें" : "Collapse All"}
            </button>
          </div>
        </div>
      </div>

      {/* Top Capability Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD5]">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#78716C] block">
            {language === "hi" ? "चयनित शिल्प" : "Active Capability"}
          </span>
          <p className="font-semibold text-xs text-[#1C1917] mt-0.5">
            {language === "hi" ? record.nameHi : record.name}
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-[#78716C] block">
            {language === "hi" ? "प्रमाण शक्ति" : "Evidence Strength"}
          </span>
          <div className="inline-flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.bg}`}
            >
              {statusBadge.label}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-[#78716C] block">
            {language === "hi" ? "तत्परता स्थिति" : "Fulfilment Readiness"}
          </span>
          <div className="inline-flex items-center gap-1 mt-0.5">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${readinessBadge.bg}`}
            >
              {readinessBadge.label}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-[#78716C] block">
            {language === "hi" ? "सत्यापन स्थिति" : "Profile Verification"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F5E4D] mt-0.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {language === "hi" ? "सत्यापित (स्वतंत्र ऑडिट)" : "Verified (Independent Audit)"}
          </span>
        </div>
      </div>

      {/* COLLAPSIBLE ACCORDION DROPDOWN PANELS */}
      <div className="space-y-3.5 pt-2">
        {/* ========================================================================= */}
        {/* 1. CAPABILITIES (Crafts, Materials, Techniques, Products, Customisation) */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-[#E8DFD5] bg-white overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("capabilities")}
            className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-[#FAF8F5] text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EBF1ED] text-[#3F5E4D]">
                <Box className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-semibold text-sm text-[#1C1917]">
                  {language === "hi" ? "१. सत्यापित शिल्प क्षमताएं" : "1. Verified Capabilities"}
                </h3>
                <span className="text-[11px] text-[#78716C]">
                  {language === "hi"
                    ? "शिल्प, सामग्री, तकनीकें, उत्पाद प्रारूप व अनुकूलन क्षमता"
                    : "Crafts, Materials, Techniques, Product lines & Customisation"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-[#3F5E4D] bg-[#EBF1ED] px-2.5 py-0.5 rounded-full">
                {record.materials.length} {language === "hi" ? "सामग्री" : "materials"} •{" "}
                {record.techniques.length} {language === "hi" ? "तकनीकें" : "techniques"}
              </span>
              {openSections.capabilities ? (
                <ChevronUp className="h-4 w-4 text-[#78716C]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#78716C]" />
              )}
            </div>
          </button>

          {openSections.capabilities && (
            <div className="p-4 sm:p-6 border-t border-[#F4EFEA] bg-[#FAF8F5]/40 space-y-6 animate-in fade-in">
              {/* Materials */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-2 flex items-center gap-1.5">
                  <PackageCheck className="h-3.5 w-3.5 text-[#C85A32]" />
                  <span>{language === "hi" ? "सत्यापित सामग्री व स्रोत" : "Materials Worked With & Provenance Sources"}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {record.materials.map((mat, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white border border-[#E8DFD5] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1C1917]">
                          {language === "hi" ? mat.nameHi : mat.name}
                        </span>
                        <span className="text-[10px] font-semibold text-[#3F5E4D] bg-[#EBF1ED] px-2 py-0.5 rounded-full">
                          {mat.status}
                        </span>
                      </div>
                      <div className="space-y-1 pt-1 border-t border-[#F4EFEA]">
                        <span className="text-[10px] font-semibold uppercase text-[#A8A29E] block">
                          {language === "hi" ? "साक्ष्य शृंखला:" : "Traceable Evidence:"}
                        </span>
                        {(language === "hi" ? mat.evidenceHi : mat.evidence).map((ev, ei) => (
                          <div key={ei} className="flex items-center gap-1.5 text-[11px] text-[#78716C]">
                            <FileCheck className="h-3 w-3 text-[#3F5E4D] flex-shrink-0" />
                            <span>{ev}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Techniques */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-2 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-[#C85A32]" />
                  <span>{language === "hi" ? "सत्यापित निर्माण तकनीकें" : "Techniques Demonstrated by Artisan"}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {record.techniques.map((tech, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white border border-[#E8DFD5] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1C1917]">
                          {language === "hi" ? tech.nameHi : tech.name}
                        </span>
                        <span className="text-[10px] font-semibold text-[#3F5E4D] bg-[#EBF1ED] px-2 py-0.5 rounded-full">
                          {tech.status}
                        </span>
                      </div>
                      <div className="space-y-1 pt-1 border-t border-[#F4EFEA]">
                        <span className="text-[10px] font-semibold uppercase text-[#A8A29E] block">
                          {language === "hi" ? "समर्थक साक्ष्य:" : "Supporting Evidence:"}
                        </span>
                        {(language === "hi" ? tech.evidenceHi : tech.evidence).map((ev, ei) => (
                          <div key={ei} className="flex items-center gap-1.5 text-[11px] text-[#78716C]">
                            <FileCheck className="h-3 w-3 text-[#3F5E4D] flex-shrink-0" />
                            <span>{ev}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products & Customisation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-[#E8DFD5] space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi"
                      ? `निर्मित उत्पाद श्रेणियां (${record.productsCreated.count} प्रारूप)`
                      : `Product Types Created (${record.productsCreated.count} types)`}
                  </span>
                  <ul className="space-y-1 text-[11px] text-[#1C1917]">
                    {(language === "hi" ? record.productsCreated.typesHi : record.productsCreated.types).map(
                      (p, pi) => (
                        <li key={pi} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-[#C85A32]" />
                          <span>{p}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8DFD5] space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "समर्थित अनुकूलन (Customisation)" : "Verified Supported Customisation"}
                  </span>
                  <ul className="space-y-1 text-[11px] text-[#1C1917]">
                    {(language === "hi" ? record.customisation.optionsHi : record.customisation.options).map(
                      (c, ci) => (
                        <li key={ci} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-[#3F5E4D]" />
                          <span>{c}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. PRODUCTION CAPABILITY & CAPACITY (Operational Estimates)               */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-[#E8DFD5] bg-white overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("production")}
            className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-[#FAF8F5] text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#E8DFD5] text-[#C85A32]">
                <Clock className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-semibold text-sm text-[#1C1917]">
                  {language === "hi" ? "२. उत्पादन क्षमता व समय-सीमा" : "2. Production Capability & Operational Capacity"}
                </h3>
                <span className="text-[11px] text-[#78716C]">
                  {language === "hi"
                    ? "मासिक क्षमता, सामान्य लीड समय, न्यूनतम ऑर्डर (MOQ) व उपलब्ध कोटा"
                    : "Estimated monthly capacity, lead time, MOQ, and available batch capacity"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-[#1C1917] bg-[#FAF8F5] border border-[#E8DFD5] px-2.5 py-0.5 rounded-full">
                {record.productionCapability.currentMonthlyCapacity} {language === "hi" ? "नग/माह" : "units/mo"}
              </span>
              {openSections.production ? (
                <ChevronUp className="h-4 w-4 text-[#78716C]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#78716C]" />
              )}
            </div>
          </button>

          {openSections.production && (
            <div className="p-4 sm:p-6 border-t border-[#F4EFEA] bg-[#FAF8F5]/40 space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5]">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "वर्तमान मासिक क्षमता" : "Current Capacity"}
                  </span>
                  <p className="font-display text-lg font-bold text-[#1C1917] mt-0.5">
                    {record.productionCapability.currentMonthlyCapacity}{" "}
                    <span className="text-xs font-normal text-[#78716C]">
                      {language === "hi" ? "नग/माह" : "units/mo"}
                    </span>
                  </p>
                  <span className="text-[10px] text-[#3F5E4D]">
                    {language === "hi" ? "ऑपरेशनल अनुमान" : "Operational Estimate"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5]">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "सामान्य लीड समय" : "Typical Lead Time"}
                  </span>
                  <p className="font-display text-lg font-bold text-[#1C1917] mt-0.5">
                    {language === "hi"
                      ? record.productionCapability.typicalLeadTimeHi
                      : record.productionCapability.typicalLeadTime}
                  </p>
                  <span className="text-[10px] text-[#78716C]">
                    {language === "hi" ? "आदेश से प्रेषण" : "Order to dispatch"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5]">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "कस्टम ऑर्डर" : "Custom Orders"}
                  </span>
                  <p className="font-display text-lg font-bold text-[#3F5E4D] mt-0.5">
                    {language === "hi" ? "समर्थित" : "Supported"}
                  </p>
                  <span className="text-[10px] text-[#78716C]">
                    {language === "hi" ? "माप/रंग लचीलापन" : "Size/color flexible"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5]">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "न्यूनतम ऑर्डर (MOQ)" : "Min Order Qty"}
                  </span>
                  <p className="font-display text-lg font-bold text-[#1C1917] mt-0.5">
                    {record.productionCapability.minOrderQuantity}{" "}
                    <span className="text-xs font-normal text-[#78716C]">
                      {language === "hi" ? "नग" : "units"}
                    </span>
                  </p>
                  <span className="text-[10px] text-[#78716C]">
                    {language === "hi" ? "बी2बी बैच न्यूनतम" : "B2B batch floor"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5]">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "उपलब्ध क्षमता" : "Available Capacity"}
                  </span>
                  <p className="font-display text-lg font-bold text-[#C85A32] mt-0.5">
                    {record.productionCapability.availableCapacity}{" "}
                    <span className="text-xs font-normal text-[#78716C]">
                      {language === "hi" ? "नग" : "units"}
                    </span>
                  </p>
                  <span className="text-[10px] text-[#78716C]">
                    {language === "hi" ? "तत्काल स्लॉट" : "Immediate slot"}
                  </span>
                </div>
              </div>

              {/* Design Principle Callout on Capacity */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-white border border-[#E8DFD5] text-[11px] text-[#78716C]">
                <Info className="h-4 w-4 text-[#C85A32] flex-shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-[#1C1917]">
                    {language === "hi" ? "क्षमता सिद्धांत: " : "Operational Capacity Principle: "}
                  </span>
                  {language === "hi"
                    ? record.productionCapability.capacityNoteHi
                    : record.productionCapability.capacityNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. TRACK RECORD (Fulfilled Orders, B2C, B2B, Quality Records)             */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-[#E8DFD5] bg-white overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("trackRecord")}
            className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-[#FAF8F5] text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#E8DFD5] text-[#3F5E4D]">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-semibold text-sm text-[#1C1917]">
                  {language === "hi" ? "३. ट्रैक रिकॉर्ड व आपूर्ति इतिहास" : "3. Track Record & Fulfilment History"}
                </h3>
                <span className="text-[11px] text-[#78716C]">
                  {language === "hi"
                    ? "सफल ऑर्डर, बी2सी व बी2बी अनुभव, और गुणवत्ता निरीक्षण रिकॉर्ड"
                    : "Completed orders, B2C experience, B2B contracts, and quality records"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-[#3F5E4D] bg-[#EBF1ED] px-2.5 py-0.5 rounded-full">
                {record.trackRecord.ordersFulfilled} {language === "hi" ? "ऑर्डर पूर्ण" : "Orders Fulfilled"}
              </span>
              {openSections.trackRecord ? (
                <ChevronUp className="h-4 w-4 text-[#78716C]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#78716C]" />
              )}
            </div>
          </button>

          {openSections.trackRecord && (
            <div className="p-4 sm:p-6 border-t border-[#F4EFEA] bg-[#FAF8F5]/40 space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5]">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "निर्मित उत्पाद रिकॉर्ड" : "Products Created"}
                  </span>
                  <p className="font-display text-lg font-bold text-[#1C1917] mt-0.5">
                    {record.trackRecord.totalProductsCreated}
                  </p>
                  <span className="text-[10px] text-[#78716C]">
                    {language === "hi" ? "अद्वितीय उत्पाद कैटलॉग" : "Catalogued items"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5]">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "बी2सी खुदरा ऑर्डर" : "B2C Experience"}
                  </span>
                  <p className="font-display text-lg font-bold text-[#1C1917] mt-0.5">
                    {record.trackRecord.b2cExperience}
                  </p>
                  <span className="text-[10px] text-[#3F5E4D]">
                    {language === "hi" ? "सत्यापित उपभोक्ता प्रेषण" : "Verified direct sales"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5]">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "बी2बी संस्थागत ऑर्डर" : "B2B Experience"}
                  </span>
                  <p className="font-display text-lg font-bold text-[#1C1917] mt-0.5">
                    {record.trackRecord.b2bExperience}
                  </p>
                  <span className="text-[10px] text-[#3F5E4D]">
                    {language === "hi" ? "थोक संस्थागत अनुबंध" : "Bulk batch contracts"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5]">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "गुणवत्ता (QC) प्रमाण" : "Quality Records"}
                  </span>
                  <p className="font-display text-lg font-bold text-[#1C1917] mt-0.5">
                    {record.trackRecord.qualityRecordsCount}
                  </p>
                  <span className="text-[10px] text-[#3F5E4D]">
                    {language === "hi" ? "ऑडिटेड निरीक्षण" : "Formal audit checks"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5] text-xs">
                <span className="text-[10px] uppercase font-bold text-[#78716C] block mb-1">
                  {language === "hi" ? "पूर्ति इतिहास व विवाद दर:" : "Fulfilment History & Reliability Statement:"}
                </span>
                <p className="font-semibold text-[#1C1917]">
                  {language === "hi"
                    ? record.trackRecord.fulfilmentHistoryHi
                    : record.trackRecord.fulfilmentHistory}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. TRACEABLE EVIDENCE MATRIX (Product, Order, QC, Declarations)           */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-[#E8DFD5] bg-white overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("evidence")}
            className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-[#FAF8F5] text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#E8DFD5] text-[#C85A32]">
                <FileCheck className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-semibold text-sm text-[#1C1917]">
                  {language === "hi" ? "४. ट्रेस करने योग्य साक्ष्य व सत्यापन" : "4. Traceable Evidence & Verification Matrix"}
                </h3>
                <span className="text-[11px] text-[#78716C]">
                  {language === "hi"
                    ? "प्रत्येक क्षमता सीधे उत्पाद रिकॉर्ड, पूर्ण ऑर्डर व गुणवत्ता ऑडिट से संबद्ध"
                    : "Each capability traceable to supporting evidence records"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-[#3F5E4D] bg-[#EBF1ED] px-2.5 py-0.5 rounded-full">
                {record.traceableEvidence.length} {language === "hi" ? "सत्यापित साक्ष्य" : "evidence links"}
              </span>
              {openSections.evidence ? (
                <ChevronUp className="h-4 w-4 text-[#78716C]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#78716C]" />
              )}
            </div>
          </button>

          {openSections.evidence && (
            <div className="p-4 sm:p-6 border-t border-[#F4EFEA] bg-[#FAF8F5]/40 space-y-4 animate-in fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8DFD5] text-[10px] uppercase font-bold text-[#78716C]">
                      <th className="py-2.5 px-3">{language === "hi" ? "क्षमता तत्व" : "Capability Element"}</th>
                      <th className="py-2.5 px-3">{language === "hi" ? "साक्ष्य का प्रकार" : "Evidence Source"}</th>
                      <th className="py-2.5 px-3">{language === "hi" ? "संदर्भ कोड" : "Reference ID"}</th>
                      <th className="py-2.5 px-3">{language === "hi" ? "दिनांक" : "Recorded Date"}</th>
                      <th className="py-2.5 px-3 text-right">{language === "hi" ? "सत्यापन स्थिति" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4EFEA] text-[11px]">
                    {record.traceableEvidence.map((ev, ei) => (
                      <tr key={ei} className="hover:bg-white transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[#1C1917]">
                          {language === "hi" ? ev.itemHi : ev.item}
                        </td>
                        <td className="py-2.5 px-3 text-[#78716C]">
                          {language === "hi" ? ev.evidenceTypeHi : ev.evidenceType}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-[#A8A29E]">
                          {ev.reference}
                        </td>
                        <td className="py-2.5 px-3 text-[#78716C]">{ev.date}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#3F5E4D] bg-[#EBF1ED] px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3" />
                            {language === "hi" ? "सत्यापित" : "Verified"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-[#78716C] pt-2">
                {language === "hi"
                  ? "प्रत्येक क्षमता साक्ष्य से जुड़ी है। कारीगर की पहचान सत्यापित होने का अर्थ यह नहीं है कि सभी शिल्प स्वतः सत्यापित हैं — प्रत्येक क्षमता की अपनी साक्ष्य शृंखला होती है।"
                  : "Each capability has its own individual verification. Identity verification does not automatically verify every craft or technique."}
              </p>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 5. QUALITY ASSURANCE & AUDIT HISTORY                                      */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-[#E8DFD5] bg-white overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("quality")}
            className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-[#FAF8F5] text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#E8DFD5] text-[#3F5E4D]">
                <Award className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-semibold text-sm text-[#1C1917]">
                  {language === "hi" ? "५. गुणवत्ता आश्वासन व निरीक्षण रिकॉर्ड" : "5. Quality Assurance & Audit History"}
                </h3>
                <span className="text-[11px] text-[#78716C]">
                  {language === "hi"
                    ? "भौतिक परीक्षण, शून्य-दोष स्थिति व औपचारिक क्लस्टर ऑडिट"
                    : "Completed QC checks, physical assays & institutional audit history"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-[#3F5E4D] bg-[#EBF1ED] px-2.5 py-0.5 rounded-full">
                {record.qualityRecords.checksCompleted} {language === "hi" ? "सत्यापित ऑडिट" : "Audits Passed"}
              </span>
              {openSections.quality ? (
                <ChevronUp className="h-4 w-4 text-[#78716C]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#78716C]" />
              )}
            </div>
          </button>

          {openSections.quality && (
            <div className="p-4 sm:p-6 border-t border-[#F4EFEA] bg-[#FAF8F5]/40 space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-white border border-[#E8DFD5] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1C1917]">
                    {language === "hi" ? "गुणवत्ता स्थिति:" : "Quality Status:"}{" "}
                    <span className="text-[#3F5E4D]">
                      {language === "hi" ? "शून्य-दोष पारित (Zero Defect)" : "PASSED (Zero Defects Recorded)"}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] text-[#78716C]">
                    Ref: {record.qualityRecords.lastAuditRef}
                  </span>
                </div>
                <p className="text-[11px] text-[#78716C]">
                  {language === "hi"
                    ? record.qualityRecords.evidenceSummaryHi
                    : record.qualityRecords.evidenceSummary}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#78716C] block mb-2">
                  {language === "hi" ? "हालिया ऑडिट इतिहास:" : "Recent Quality Audit History:"}
                </span>
                <div className="space-y-1.5">
                  {(language === "hi"
                    ? record.qualityRecords.auditHistoryHi
                    : record.qualityRecords.auditHistory
                  ).map((item, ii) => (
                    <div
                      key={ii}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-[#E8DFD5] text-[11px] text-[#1C1917]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#3F5E4D] flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 6. FRESHNESS & VERIFICATION TIMESTAMPS                                    */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-[#E8DFD5] bg-white overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("freshness")}
            className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-[#FAF8F5] text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#E8DFD5] text-[#78716C]">
                <Calendar className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-semibold text-sm text-[#1C1917]">
                  {language === "hi" ? "६. डेटा ताजगी व अंतिम साक्ष्य समय-मुहर" : "6. Record Freshness & Evidence Timestamps"}
                </h3>
                <span className="text-[11px] text-[#78716C]">
                  {language === "hi"
                    ? "पुरानी जानकारी को स्थायी मानने से रोकने हेतु अंतिम साक्ष्य तिथि"
                    : "Ensures capability information is actively maintained and recently audited"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-[#78716C] bg-[#FAF8F5] border border-[#E8DFD5] px-2.5 py-0.5 rounded-full">
                {language === "hi" ? "सक्रिय: " : "Audited: "}
                {language === "hi" ? record.freshness.lastEvidenceRecordedHi : record.freshness.lastEvidenceRecorded}
              </span>
              {openSections.freshness ? (
                <ChevronUp className="h-4 w-4 text-[#78716C]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#78716C]" />
              )}
            </div>
          </button>

          {openSections.freshness && (
            <div className="p-4 sm:p-6 border-t border-[#F4EFEA] bg-[#FAF8F5]/40 space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "अंतिम क्षमता अद्यतन (Last Updated)" : "Last Profile Update"}
                  </span>
                  <p className="font-display text-base font-bold text-[#1C1917]">
                    {language === "hi"
                      ? record.freshness.lastUpdatedHi
                      : record.freshness.lastUpdated}
                  </p>
                  <span className="text-[10px] text-[#78716C]">
                    {language === "hi" ? "कारीगर व क्लस्टर द्वारा सत्यापित" : "Verified by cluster guild"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD5] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    {language === "hi" ? "अंतिम साक्ष्य प्रविष्टि (Last Evidence)" : "Last Supporting Evidence Recorded"}
                  </span>
                  <p className="font-display text-base font-bold text-[#3F5E4D]">
                    {language === "hi"
                      ? record.freshness.lastEvidenceRecordedHi
                      : record.freshness.lastEvidenceRecorded}
                  </p>
                  <span className="text-[10px] text-[#78716C]">
                    {language === "hi" ? "नवीनतम बैच ऑर्डर प्रेषण" : "Most recent verified dispatch"}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#78716C]">
                {language === "hi"
                  ? "ताजगी नीति: यदि 90 दिनों तक कोई नया साक्ष्य दर्ज नहीं होता, तो तत्परता स्थिति स्वतः 'सत्यापन आवश्यक' में स्थानांतरित हो जाती है।"
                  : "Freshness Policy: If no supporting evidence is recorded for 90 days, capability readiness transitions to 'Needs Verification' to prevent stale records."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Design Principle Reminder */}
      <div className="p-4 rounded-2xl bg-[#F4EFEA]/80 border border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#78716C]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#C85A32] flex-shrink-0" />
          <p className="text-[11px] leading-relaxed">
            {language === "hi"
              ? "हुनर प्रोफाइल उत्तर देता है: यह कारीगर क्या बना सकता है? किस सामग्री व तकनीक से? कितनी मात्रा में? क्या साक्ष्य हैं? और अंतिम बार कब सत्यापित हुआ?"
              : "The Hunar Profile answers: What can this artisan reliably make? With what materials and techniques? How much can they fulfil? What evidence supports it? How recently was it verified?"}
          </p>
        </div>
        <span className="text-[10px] font-semibold text-[#1C1917] bg-white px-3 py-1 rounded-full border border-[#D6CEBE] whitespace-nowrap">
          {language === "hi" ? "कोई कृत्रिम संख्यात्मक स्कोर नहीं" : "Zero Fabricated Numerical Scores"}
        </span>
      </div>
    </div>
  );
}
