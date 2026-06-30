export type MemberTier = "individual" | "restaurant" | "wholesale";

export type ApplicationStatus = "none" | "pending" | "approved" | "rejected";

export type ProductVisibility = "public" | "member" | "trade";

export type BusinessType =
  | "restaurant"
  | "hotel"
  | "cafe"
  | "distributor"
  | "retailer"
  | "other";

export interface BulkPack {
  label: string;
  quantity: number;
  unit: string;
}

export interface TierPricing {
  /** Discount multiplier applied to retail (e.g. 0.85 = 15% off) */
  restaurantMultiplier: number;
  wholesaleMultiplier: number;
}

export interface MemberProfile {
  id: string;
  email: string;
  name: string;
  password: string;
  tier: MemberTier;
  applicationStatus: ApplicationStatus;
  businessName?: string;
  businessType?: BusinessType;
  location?: string;
  monthlyVolume?: string;
  notes?: string;
  chefSupplyMode: boolean;
  createdAt: string;
}

export interface MembershipApplicationInput {
  tier: "restaurant" | "wholesale";
  email: string;
  name: string;
  password: string;
  businessName: string;
  businessType: BusinessType;
  location: string;
  monthlyVolume: string;
  notes?: string;
}

export interface MemberOrder {
  id: string;
  date: string;
  total: string;
  status: string;
  items: { title: string; quantity: number; unit?: string }[];
}

export type CartMode = "retail" | "chef-supply" | "trade-quote";
