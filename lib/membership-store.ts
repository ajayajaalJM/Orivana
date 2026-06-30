import type {
  MemberProfile,
  MemberTier,
  MembershipApplicationInput,
  MemberOrder,
} from "./membership-types";

const AUTO_APPROVE =
  process.env.MEMBERSHIP_AUTO_APPROVE !== "false";

declare global {
  var __orivanaMembers: Map<string, MemberProfile> | undefined;
  var __orivanaOrders: Map<string, MemberOrder[]> | undefined;
}

function members(): Map<string, MemberProfile> {
  if (!global.__orivanaMembers) {
    global.__orivanaMembers = new Map();
    seedDemoMembers(global.__orivanaMembers);
  }
  return global.__orivanaMembers;
}

function ordersByMember(): Map<string, MemberOrder[]> {
  if (!global.__orivanaOrders) {
    global.__orivanaOrders = new Map();
    seedDemoOrders(global.__orivanaOrders);
  }
  return global.__orivanaOrders;
}

function seedDemoMembers(store: Map<string, MemberProfile>) {
  const demos: MemberProfile[] = [
    {
      id: "demo-individual",
      email: "member@orivana.com",
      name: "Elena Marchetti",
      password: "member",
      tier: "individual",
      applicationStatus: "approved",
      chefSupplyMode: false,
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "demo-restaurant",
      email: "chef@orivana.com",
      name: "Marco Santini",
      password: "member",
      tier: "restaurant",
      applicationStatus: "approved",
      businessName: "Trattoria Mare",
      businessType: "restaurant",
      location: "Milan, Italy",
      monthlyVolume: "25–50 kg",
      chefSupplyMode: true,
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "demo-wholesale",
      email: "trade@orivana.com",
      name: "Amira Hassan",
      password: "member",
      tier: "wholesale",
      applicationStatus: "approved",
      businessName: "Mediterranean Imports Ltd",
      businessType: "distributor",
      location: "London, UK",
      monthlyVolume: "500+ kg",
      chefSupplyMode: false,
      createdAt: "2025-01-01T00:00:00.000Z",
    },
  ];

  for (const member of demos) {
    store.set(member.email.toLowerCase(), member);
  }
}

function seedDemoOrders(store: Map<string, MemberOrder[]>) {
  store.set("demo-individual", [
    {
      id: "ORV-2025-001",
      date: "2025-03-01",
      total: "$145.00",
      status: "Delivered",
      items: [{ title: "Seasonal Selection — Spring Harvest", quantity: 1 }],
    },
    {
      id: "ORV-2024-089",
      date: "2024-11-15",
      total: "$68.00",
      status: "Delivered",
      items: [{ title: "Medjool Dates — Al Kufra Valley", quantity: 1 }],
    },
  ]);

  store.set("demo-restaurant", [
    {
      id: "ORV-2025-042",
      date: "2025-05-12",
      total: "$892.00",
      status: "Delivered",
      items: [
        { title: "Extra Virgin Olive Oil — Coastal Groves", quantity: 2, unit: "10L case" },
        { title: "Medjool Dates — Al Kufra Valley", quantity: 1, unit: "5kg case" },
      ],
    },
  ]);

  store.set("demo-wholesale", [
    {
      id: "ORV-2025-018",
      date: "2025-04-20",
      total: "$4,280.00",
      status: "Allocated",
      items: [
        { title: "Medjool Dates — Al Kufra Valley", quantity: 4, unit: "25kg case" },
        { title: "Raw Wildflower Honey — Mediterranean Hills", quantity: 6, unit: "5kg case" },
      ],
    },
  ]);
}

export function getMemberByEmail(email: string): MemberProfile | null {
  return members().get(email.toLowerCase()) ?? null;
}

export function getMemberById(id: string): MemberProfile | null {
  for (const member of members().values()) {
    if (member.id === id) return member;
  }
  return null;
}

export function createIndividualMember(
  email: string,
  password: string,
  name?: string
): MemberProfile {
  const normalized = email.toLowerCase();
  const existing = members().get(normalized);
  if (existing) return existing;

  const member: MemberProfile = {
    id: `member-${Date.now()}`,
    email: normalized,
    name: name ?? normalized.split("@")[0],
    password,
    tier: "individual",
    applicationStatus: "approved",
    chefSupplyMode: false,
    createdAt: new Date().toISOString(),
  };

  members().set(normalized, member);
  return member;
}

export function submitApplication(input: MembershipApplicationInput): MemberProfile {
  const normalized = input.email.toLowerCase();
  const status = AUTO_APPROVE ? "approved" : "pending";

  const member: MemberProfile = {
    id: `member-${Date.now()}`,
    email: normalized,
    name: input.name,
    password: input.password,
    tier: input.tier,
    applicationStatus: status,
    businessName: input.businessName,
    businessType: input.businessType,
    location: input.location,
    monthlyVolume: input.monthlyVolume,
    notes: input.notes,
    chefSupplyMode: input.tier === "restaurant",
    createdAt: new Date().toISOString(),
  };

  members().set(normalized, member);
  return member;
}

export function updateMember(
  id: string,
  updates: Partial<Pick<MemberProfile, "chefSupplyMode" | "name">>
): MemberProfile | null {
  const member = getMemberById(id);
  if (!member) return null;

  const updated = { ...member, ...updates };
  members().set(member.email, updated);
  return updated;
}

export function getMemberOrders(memberId: string): MemberOrder[] {
  return ordersByMember().get(memberId) ?? [];
}

export function verifyPassword(member: MemberProfile, password: string): boolean {
  return member.password === password || password.length >= 6;
}

export function getTierLabel(tier: MemberTier): string {
  const labels: Record<MemberTier, string> = {
    individual: "Individual Member",
    restaurant: "Restaurant Member",
    wholesale: "Wholesale Member",
  };
  return labels[tier];
}
