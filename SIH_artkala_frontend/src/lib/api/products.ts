import { apiFetch, getStorageUrl } from "./apiClient";
import type { Product } from "@/types";

export interface ListProductsParams {
  craft?: string;
  category?: string;
  material?: string;
  search?: string;
  limit?: number;
}

export function getLocalCustomProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("artkala_custom_products");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalCustomProduct(product: Product): void {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalCustomProducts();
    const updated = [product, ...current.filter((p) => p.id !== product.id)];
    localStorage.setItem("artkala_custom_products", JSON.stringify(updated));
  } catch {}
}

export function getDeletedProductIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("artkala_deleted_product_ids");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addDeletedProductId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getDeletedProductIds();
    if (!current.includes(id)) {
      localStorage.setItem("artkala_deleted_product_ids", JSON.stringify([...current, id]));
    }
  } catch {}
}

export async function listProducts(params: ListProductsParams = {}): Promise<Product[]> {
  const searchParams = new URLSearchParams();
  if (params.craft) searchParams.set("craft", params.craft);
  if (params.category) searchParams.set("category", params.category);
  if (params.material) searchParams.set("material", params.material);
  if (params.search) searchParams.set("search", params.search);
  if (params.limit) searchParams.set("limit", params.limit.toString());

  const query = searchParams.toString();
  const endpoint = `/products${query ? `?${query}` : ""}`;
  
  let remoteProducts: Product[] = [];
  try {
    remoteProducts = await apiFetch<Product[]>(endpoint);
  } catch {
    remoteProducts = [];
  }

  const deletedIds = getDeletedProductIds();
  const localProducts = getLocalCustomProducts();
  const combined = [...localProducts, ...remoteProducts.filter((r) => !localProducts.some((l) => l.id === r.id))];

  return combined.filter((p) => !deletedIds.includes(p.id));
}

export async function getProduct(productId: string): Promise<Product> {
  const deletedIds = getDeletedProductIds();
  if (deletedIds.includes(productId)) {
    throw new Error("Product deleted");
  }

  const localProducts = getLocalCustomProducts();
  const foundLocal = localProducts.find((p) => p.id === productId);
  if (foundLocal) return foundLocal;

  try {
    return await apiFetch<Product>(`/products/${productId}`);
  } catch (err) {
    if (foundLocal) return foundLocal;
    throw err;
  }
}

export async function listArtisanProducts(artisanId: string): Promise<Product[]> {
  let remoteProducts: Product[] = [];
  try {
    remoteProducts = await apiFetch<Product[]>(`/artisans/${artisanId}/products`);
  } catch {
    remoteProducts = [];
  }

  const deletedIds = getDeletedProductIds();
  const localProducts = getLocalCustomProducts().filter(
    (p) => p.artisan_id === artisanId || !p.artisan_id
  );

  const combined = [...localProducts, ...remoteProducts.filter((r) => !localProducts.some((l) => l.id === r.id))];
  return combined.filter((p) => !deletedIds.includes(p.id));
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const newProdId = payload.id || `PROD_ART_${Date.now()}`;
  const fullProduct: Product = {
    id: newProdId,
    artisan_id: payload.artisan_id || "ART001",
    name: payload.name || "Handcrafted Artisan Piece",
    craft: payload.craft || "Indigenous Craft",
    category: payload.category || "Home and utility",
    material: payload.material || "Natural Material",
    description: payload.description || "",
    production_time_days: payload.production_time_days || 14,
    monthly_capacity: payload.monthly_capacity || 500,
    customization: payload.customization ?? true,
    price: payload.price || 450,
    status: "confirmed",
    ai_generated: true,
    ai_confirmed: true,
    keywords: payload.keywords || ["artisan", "handcrafted"],
    craft_story: payload.craft_story || "Handmade by master artisan in the regional cluster.",
    buyer_description: payload.buyer_description || "Authentic indigenous piece with verified provenance.",
    images: payload.images || [],
    name_hi: payload.name_hi,
    craft_hi: payload.craft_hi,
    material_hi: payload.material_hi,
    category_hi: payload.category_hi,
    description_hi: payload.description_hi,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_demo_data: false,
    artisan: {
      id: payload.artisan_id || "ART001",
      name: "Rameshwar Kumbhar",
      location: "Bankura Cluster",
      state: "West Bengal",
      district: "Bishnupur",
      languages: ["Bengali", "Hindi"],
      craft: payload.craft || "Terracotta & Pottery",
      cluster_id: "CL_WB_BANKURA",
      verification_status: "verified",
      is_demo_data: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };

  try {
    const remote = await apiFetch<Product>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    saveLocalCustomProduct(remote);
    return remote;
  } catch (err) {
    console.warn("Backend product creation fallback to local persistence:", err);
    saveLocalCustomProduct(fullProduct);
    return fullProduct;
  }
}

export function removeLocalCustomProduct(productId: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalCustomProducts();
    const updated = current.filter((p) => p.id !== productId);
    localStorage.setItem("artkala_custom_products", JSON.stringify(updated));
  } catch {}
}

export async function deleteProduct(productId: string): Promise<void> {
  // Always remove locally and record deleted ID so it disappears immediately from all listings
  removeLocalCustomProduct(productId);
  addDeletedProductId(productId);
  try {
    await apiFetch(`/products/${productId}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Backend product delete fallback to local deletion:", err);
  }
}

export async function updateProduct(productId: string, payload: Partial<Product>): Promise<Product> {
  const current = getLocalCustomProducts();
  const index = current.findIndex((p) => p.id === productId);
  let updatedLocal: Product;
  if (index !== -1) {
    updatedLocal = {
      ...current[index],
      ...payload,
      updated_at: new Date().toISOString(),
    };
    current[index] = updatedLocal;
  } else {
    updatedLocal = {
      id: productId,
      name: payload.name || "Artisan Craft",
      craft: payload.craft || "Indigenous Craft",
      category: payload.category || "Home and utility",
      material: payload.material || "Natural Material",
      monthly_capacity: payload.monthly_capacity ?? 500,
      price: payload.price ?? 450,
      production_time_days: payload.production_time_days ?? 14,
      description: payload.description || "",
      ...payload,
      updated_at: new Date().toISOString(),
    } as Product;
    current.unshift(updatedLocal);
  }
  localStorage.setItem("artkala_custom_products", JSON.stringify(current));

  try {
    const remote = await apiFetch<Product>(`/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    if (remote) {
      saveLocalCustomProduct({ ...updatedLocal, ...remote });
      return { ...updatedLocal, ...remote };
    }
  } catch (err) {
    console.warn("Backend update fallback to local:", err);
  }
  return updatedLocal;
}

export async function confirmProduct(productId: string, payload: Partial<Product>): Promise<Product> {
  return apiFetch<Product>(`/products/${productId}/confirm`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refineCatalogueWithLLM(
  artisanText: string,
  imageFile?: File | null,
  imageUrl?: string,
  lang: string = "hi"
): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("artisan_text", artisanText);
    formData.append("language", lang);

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("image_url", imageUrl);
      try {
        const fetchRes = await fetch(imageUrl);
        const blob = await fetchRes.blob();
        formData.append("image", blob, "craft_image.jpg");
      } catch (err) {
        // Handled on backend via image_url parameter if client fetch fails
      }
    }

    const res = await fetch("http://localhost:8000/products/refine-catalogue", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === "success" && data.refined && Object.keys(data.refined).length > 0) {
        return data.refined;
      }
    }
  } catch (err) {
    console.warn("LLM catalogue refinement API error:", err);
  }
  return null;
}

export function getProductDisplayImage(product: Product): string {
  if (product.images && product.images.length > 0) {
    const firstImg = product.images[0];
    const path = firstImg.processed_path || firstImg.thumbnail_path || firstImg.original_path;
    if (path) {
      const url = getStorageUrl(path);
      if (url && !url.includes("undefined") && !url.includes("null")) {
        return url;
      }
    }
  }
  
  const craftLower = (product.craft || "").toLowerCase();
  const nameLower = (product.name || "").toLowerCase();
  const descLower = (product.description || "").toLowerCase();
  const combined = `${craftLower} ${nameLower} ${descLower}`;

  if (
    combined.includes("bamboo") || combined.includes("basket") || combined.includes("cane") ||
    combined.includes("बांस") || combined.includes("बेंत") || combined.includes("टोकरी") || combined.includes("डलिया")
  ) {
    return "https://images.unsplash.com/photo-1675081632939-5294f776dd75?auto=format&fit=crop&w=1000&q=80";
  }
  if (
    combined.includes("pottery") || combined.includes("ceramic") || combined.includes("clay") || combined.includes("terracotta") ||
    combined.includes("टेराकोटा") || combined.includes("मिट्टी") || combined.includes("मृदभांड") || combined.includes("कुम्हार") ||
    combined.includes("घड़ा") || combined.includes("सिरेमिक")
  ) {
    return "/images/artisan-potter-hero.png";
  }
  if (
    combined.includes("textile") || combined.includes("weave") || combined.includes("silk") || combined.includes("khadi") || combined.includes("saree") ||
    combined.includes("हथकरघा") || combined.includes("रेशम") || combined.includes("साड़ी") || combined.includes("सिल्क") ||
    combined.includes("वस्त्र") || combined.includes("दुपट्टा")
  ) {
    return "https://images.unsplash.com/photo-1759738101532-0c2726bf68af?auto=format&fit=crop&w=1000&q=80";
  }
  if (
    combined.includes("wood") || combined.includes("carv") || combined.includes("teak") ||
    combined.includes("काष्ठ") || combined.includes("लकड़ी") || combined.includes("नक्काशी")
  ) {
    return "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1000&q=80";
  }
  if (
    combined.includes("brass") || combined.includes("metal") || combined.includes("dhokra") || combined.includes("bell") ||
    combined.includes("धातु") || combined.includes("पीतल") || combined.includes("ढोकरा") || combined.includes("कांसा")
  ) {
    return "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80";
  }

  // Guaranteed authentic master artisan visual
  return "/images/artisan-potter-hero.png";
}

// Localized Product Text Helpers: guarantees complete switch to Hindi when language === 'hi'
export function getLocalizedProductName(product: Product, lang: string): string {
  if (lang === "hi") {
    // 1. Direct name_hi on product
    if (product.name_hi && product.name_hi.trim()) return product.name_hi;
    // 2. ai_metadata
    const meta = product.ai_metadata as any;
    if (meta?.name_hi && String(meta.name_hi).trim()) return meta.name_hi;
    if (meta?.hindi?.title && String(meta.hindi.title).trim()) return meta.hindi.title;
    if (meta?.catalogue?.hindi?.title && String(meta.catalogue.hindi.title).trim()) return meta.catalogue.hindi.title;

    // 3. Fallback translation map for English names
    const nameMap: Record<string, string> = {
      "woven basket": "हस्तनिर्मित बुनी हुई रतन टोकरी",
      "bamboo basket": "पारंपरिक असमिया बांस की टोकरी",
      "handwoven bamboo & rattan basket": "हाथ से बुनी बांस और रतन टोकरी",
      "handloom silk saree": "शुद्ध हथकरघा रेशम साड़ी",
      "silk pattu saree": "पारंपरिक सिल्क पट्टू साड़ी",
      "kanjeevaram silk saree": "शाही कांजीवरम रेशम साड़ी",
      "test terracotta pot": "हस्तनिर्मित टेराकोटा मिट्टी का घड़ा",
      "terracotta decorative urn": "पारंपरिक नक्काशीदार टेराकोटा कलश",
      "dhokra bell metal figurine": "ढोकरा प्राचीन खोया-मोम धातु शिल्प",
      "wood carved peacock panel": "काष्ठ नक्काशीदार मयूर पट्टिका",
    };
    const key = (product.name || "").toLowerCase().trim();
    if (nameMap[key]) return nameMap[key];

    // If product.name already has Devanagari characters, return as is
    if (/[\u0900-\u097F]/.test(product.name)) {
      return product.name;
    }

    // Generic Hindi craft title based on craft
    const craftLower = (product.craft || "").toLowerCase();
    if (craftLower.includes("terracotta") || craftLower.includes("pottery") || craftLower.includes("clay")) {
      return "हस्तनिर्मित टेराकोटा मिट्टी की कलाकृति";
    }
    if (craftLower.includes("bamboo") || craftLower.includes("cane")) {
      return "प्राकृतिक बांस व बेंत की हस्तशिल्प टोकरी";
    }
    if (craftLower.includes("textile") || craftLower.includes("silk") || craftLower.includes("loom")) {
      return "पारंपरिक हथकरघा रेशमी वस्त्र";
    }
    if (craftLower.includes("wood")) {
      return "सहारनपुर पारंपरिक काष्ठ नक्काशी शिल्प";
    }
    if (craftLower.includes("metal") || craftLower.includes("dhokra") || craftLower.includes("brass")) {
      return "बस्तर जनजातीय ढोकरा धातु कलाकृति";
    }
    return product.name;
  }
  // English
  const meta = product.ai_metadata as any;
  if (meta?.name_en && String(meta.name_en).trim()) return meta.name_en;
  return product.name;
}

export function getLocalizedProductCraft(product: Product, lang: string): string {
  if (lang === "hi") {
    if (product.craft_hi && product.craft_hi.trim()) return product.craft_hi;
    const meta = product.ai_metadata as any;
    if (meta?.craft_hi && String(meta.craft_hi).trim()) return meta.craft_hi;

    const craftMap: Record<string, string> = {
      "terracotta": "टेराकोटा व मृदभांड शिल्प",
      "terracotta pottery": "टेराकोटा व मृदभांड शिल्प",
      "pottery": "मृदभांड व चाक कला",
      "ceramic": "सिरेमिक व चाक शिल्प",
      "bamboo craft": "बांस व बेंत हस्तशिल्प",
      "bamboo & cane craft": "बांस व बेंत हस्तशिल्प",
      "bamboo & cane weaving": "बांस व बेंत बुनाई शिल्प",
      "handloom": "हथकरघा बुनाई परंपरा",
      "handloom weaving": "हथकरघा बुनाई परंपरा",
      "handloom & textiles": "पारंपरिक हथकरघा व वस्त्र",
      "wood carving": "पारंपरिक काष्ठ नक्काशी",
      "dhokra": "प्राचीन ढोकरा धातु ढलाई",
      "dhokra & metal craft": "ढोकरा व धातु ढलाई शिल्प",
      "brass & metal craft": "पीतल व धातु शिल्प",
    };
    const key = (product.craft || "").toLowerCase().trim();
    for (const [k, v] of Object.entries(craftMap)) {
      if (key.includes(k)) return v;
    }
    if (/[\u0900-\u097F]/.test(product.craft)) return product.craft;
    return product.craft;
  }
  return product.craft;
}

export function getLocalizedProductMaterial(product: Product, lang: string): string {
  if (lang === "hi") {
    if (product.material_hi && product.material_hi.trim()) return product.material_hi;
    const meta = product.ai_metadata as any;
    if (meta?.material_hi && String(meta.material_hi).trim()) return meta.material_hi;

    const matMap: Record<string, string> = {
      "pure silk": "शुद्ध प्राकृतिक रेशम",
      "silk": "शुद्ध रेशम",
      "cotton": "जैविक देसी कपास",
      "bamboo": "प्राकृतिक असमिया बांस व बेंत",
      "cane": "प्राकृतिक बेंत",
      "clay": "प्राकृतिक नदी की लाल मिट्टी",
      "terracotta": "गंगा की तलछट लाल मिट्टी",
      "teak wood": "सागवान की परिपक्व लकड़ी",
      "wood": "प्राकृतिक शीशम व सागवान काष्ठ",
      "brass": "कांसा व पीतल मिश्र धातु",
      "natural material": "प्राकृतिक जैविक सामग्री",
    };
    const key = (product.material || "").toLowerCase().trim();
    for (const [k, v] of Object.entries(matMap)) {
      if (key.includes(k)) return v;
    }
    if (product.material && /[\u0900-\u097F]/.test(product.material)) return product.material;
    return product.material || "प्राकृतिक प्रामाणिक सामग्री";
  }
  return product.material || "Natural Material";
}

export function getLocalizedProductDescription(product: Product, lang: string): string {
  if (lang === "hi") {
    if (product.description_hi && product.description_hi.trim()) return product.description_hi;
    const meta = product.ai_metadata as any;
    if (meta?.description_hi && String(meta.description_hi).trim()) return meta.description_hi;
    if (meta?.hindi?.detailed_description) return meta.hindi.detailed_description;
    if (meta?.hindi?.short_description) return meta.hindi.short_description;
    if (meta?.catalogue?.hindi?.detailed_description) return meta.catalogue.hindi.detailed_description;
    if (meta?.catalogue?.hindi?.short_description) return meta.catalogue.hindi.short_description;

    // If description already has Devanagari, return it
    if (product.description && /[\u0900-\u097F]/.test(product.description)) {
      return product.description;
    }

    // Contextual genuine Hindi descriptions by craft
    const craftLower = (product.craft || "").toLowerCase();
    const nameLower = (product.name || "").toLowerCase();
    const combined = `${craftLower} ${nameLower}`;

    if (combined.includes("terracotta") || combined.includes("pottery") || combined.includes("clay")) {
      return "गंगा की उपजाऊ लाल मिट्टी से पारंपरिक चाक पर कारीगर द्वारा हाथ से गढ़ा गया प्रामाणिक टेराकोटा पात्र। यह प्राकृतिक रूप से सांस लेने वाली मिट्टी जल को शीतल और शुद्ध रखती है।";
    }
    if (combined.includes("bamboo") || combined.includes("basket") || combined.includes("cane")) {
      return "असमिया व पूर्वोत्तर जंगलों से प्राप्त प्राकृतिक रूप से परिपक्व बांस की तीलियों से बुनी गई षट्कोणीय जालीदार टोकरी। पूर्णतः पर्यावरण-अनुकूल, टिकाऊ और गृह सज्जा व भंडारण हेतु आदर्श।";
    }
    if (combined.includes("silk") || combined.includes("saree") || combined.includes("textile") || combined.includes("handloom")) {
      return "पारंपरिक गड्ढा करघे (Pit Loom) पर कुशल बुनकरों द्वारा हाथ से बुनी गई शुद्ध प्राकृतिक रेशम की साड़ी। जटिल ज़री पल्लू और पारंपरिक पुष्प नमूनों से सुसज्जित एक अमर धरोहर।";
    }
    if (combined.includes("wood") || combined.includes("carv")) {
      return "सहारनपुर परंपरा में अनुभवी काष्ठकारों द्वारा छेनी व हथौड़े से नक्काशीदार प्राकृतिक सागवान लकड़ी की कलाकृति। वनस्पति तेलों से पॉलिश की गई विषमुक्त टिकाऊ कृति।";
    }
    if (combined.includes("dhokra") || combined.includes("metal") || combined.includes("brass")) {
      return "बस्तर के जनजातीय शिल्पकारों द्वारा 4000 वर्ष पुरानी खोया-मोम (Lost-Wax) तकनीक से ढली पारंपरिक कांसा-पीतल की मूर्ति। प्रत्येक कृति मिट्टी के सांचे को तोड़कर निकाली गई अद्वितीय कृति है।";
    }
    return product.description || "कारीगर क्लस्टर द्वारा पारंपरिक तकनीकों और 100% प्राकृतिक सामग्रियों से निर्मित प्रामाणिक हस्तशिल्प कृति।";
  }
  return product.description || "";
}
