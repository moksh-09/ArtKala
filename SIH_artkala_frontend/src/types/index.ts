export interface ProductImage {
  id: string;
  original_path: string;
  processed_path: string | null;
  thumbnail_path: string | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  quality_status: string;
  processing_metadata?: {
    background_removed?: boolean;
    quality_before?: Record<string, number>;
    quality_after?: Record<string, number>;
    operations?: string[];
    processing_time_ms?: number;
    original_url?: string;
    processed_url?: string;
    thumbnail_url?: string;
  } | null;
}

export interface Product {
  id: string;
  artisan_id: string;
  name: string;
  name_hi?: string | null;
  craft: string;
  craft_hi?: string | null;
  category: string | null;
  category_hi?: string | null;
  material: string | null;
  material_hi?: string | null;
  description: string | null;
  description_hi?: string | null;
  dimensions?: Record<string, unknown> | null;
  production_time_days: number | null;
  monthly_capacity: number | null;
  customization: boolean | null;
  price: number | null;
  status: string;
  ai_generated: boolean;
  ai_confirmed: boolean;
  keywords: string[];
  craft_story: string | null;
  buyer_description: string | null;
  ai_metadata?: Record<string, unknown> | null;
  images: ProductImage[];
  image_data?: string | null;
  created_at: string;
  updated_at: string;
  is_demo_data?: boolean;
  // UI-augmented field when artisan details are fetched/joined:
  artisan?: Artisan;
}

export interface Artisan {
  id: string;
  name: string;
  location: string | null;
  state: string | null;
  district: string | null;
  languages: string[];
  craft: string;
  cluster_id: string | null;
  verification_status: string;
  is_demo_data: boolean;
  created_at: string;
  updated_at: string;
}

export interface Capability {
  id: string;
  attribute: string;
  value: unknown;
  source: string;
  verification_status: string;
  confidence: number;
  observed_at: string;
  evidence_ref: string | null;
}

export interface HunarProfile {
  artisan_id: string;
  capabilities: Capability[];
  evidence_strength: "HIGH" | "MEDIUM" | "BUILDING" | string;
  summary: {
    craft: string;
    completed_orders: number;
    quality_pass_rate: number | null;
    evidence_strength: string;
  };
}

export interface BuyerRequirement {
  id: string;
  buyer_name: string;
  raw_text: string | null;
  product: string;
  craft: string | null;
  quantity: number;
  max_price: number | null;
  deadline_days: number | null;
  customization: boolean | null;
  branding: boolean | null;
  quality_threshold: number | null;
  location: string | null;
  is_demo_data: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MatchResult {
  id: string;
  requirement_id: string;
  artisan_id: string;
  matched: boolean;
  hard_constraints: Record<string, unknown>;
  score: number;
  reasons: string[];
  rejection_reasons: string[];
  graph_evidence?: Record<string, unknown>[] | null;
}

export interface MatchingResponse {
  requirement_id: string;
  matches: MatchResult[];
  eligible_count: number;
}

export interface OrderItem {
  id: string;
  artisan_id: string;
  quantity: number;
}

export interface OrderEvent {
  id: string;
  from_state: string | null;
  to_state: string;
  note: string | null;
  actor: string;
  created_at: string;
}

export interface Order {
  id: string;
  requirement_id: string | null;
  buyer_name: string;
  total_quantity: number;
  state: "MATCHED" | "ACCEPTED" | "RESERVED" | "PRODUCTION" | "QC" | "DISPATCHED" | "DELIVERED" | "COMPLETED" | "FAILED" | "CANCELLED" | "REJECTED" | string;
  items: OrderItem[];
  events: OrderEvent[];
  created_at: string;
  updated_at: string;
}

export interface QualityCheck {
  id: string;
  order_id: string;
  artisan_id: string;
  result: "PASS" | "FAIL" | "PENDING";
  observations: string | null;
  specification_compliance: number | null;
  checker: string;
  evidence_path: string | null;
  created_at: string;
}

export interface PricingEstimate {
  cost_floor: number;
  cost_plus_target: number;
  comparable_range: [number, number] | number[] | null;
  recommended_range: [number, number] | number[] | null;
  confidence: number;
  factors: string[];
  market_data: Record<string, unknown>;
  calculation: Record<string, unknown>;
  status: string;
  image_analysis?: Record<string, unknown> | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
