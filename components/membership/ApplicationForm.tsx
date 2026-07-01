"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { H1, Excerpt, Body, Caption } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/sections/Footer";
import { brand } from "@/lib/brand";
import type { BusinessType } from "@/lib/membership-types";

interface ApplicationFormProps {
  tier: "restaurant" | "wholesale";
}

const businessTypes: { value: BusinessType; label: string }[] = [
  { value: "restaurant", label: "Restaurant" },
  { value: "hotel", label: "Hotel" },
  { value: "cafe", label: "Café" },
  { value: "distributor", label: "Distributor" },
  { value: "retailer", label: "Retailer" },
  { value: "other", label: "Other" },
];

export function ApplicationForm({ tier }: ApplicationFormProps) {
  const router = useRouter();
  const tierCopy = brand.tiers[tier];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    businessType: tier === "restaurant" ? "restaurant" : "distributor",
    location: "",
    monthlyVolume: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/membership/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier, ...form }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Application failed. Please try again.");
      setLoading(false);
      return;
    }

    if (data.status === "pending") {
      router.push("/membership/pending");
      return;
    }

    if (data.shopify) {
      window.location.href = "/api/customer/account/auth?returnTo=/membership";
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      router.push("/membership/login");
      return;
    }

    router.push("/membership");
    router.refresh();
  };

  return (
    <>
      <Section className="page-top">
        <Container>
          <div className="membership-glow relative mx-auto max-w-lg px-4 py-8">
            <div className="relative z-10">
              <Caption className="mb-4 block text-center">{brand.harvestCircle}</Caption>
              <H1 className="!text-[var(--text-h2)] mb-4 text-center">{tierCopy.tagline}</H1>
              <Excerpt className="mb-10 text-center">{tierCopy.description}</Excerpt>

              <form onSubmit={handleSubmit} className="space-y-8">
                <Field label="Contact Name" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="input-luxury"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="input-luxury"
                  />
                </Field>
                <Field label="Password" required>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
                    className="input-luxury"
                  />
                </Field>
                <Field label="Business Name" required>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    required
                    className="input-luxury"
                  />
                </Field>
                <Field label="Business Type" required>
                  <select
                    value={form.businessType}
                    onChange={(e) =>
                      setForm({ ...form, businessType: e.target.value as BusinessType })
                    }
                    className="input-luxury"
                  >
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Location" required>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                    placeholder="City, Country"
                    className="input-luxury"
                  />
                </Field>
                <Field label="Estimated Monthly Volume" required>
                  <input
                    type="text"
                    value={form.monthlyVolume}
                    onChange={(e) => setForm({ ...form, monthlyVolume: e.target.value })}
                    required
                    placeholder="e.g. 25–50 kg"
                    className="input-luxury"
                  />
                </Field>
                <Field label="Notes">
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="input-luxury resize-none"
                  />
                </Field>

                {error && <p className="text-sm font-light text-red-400/80">{error}</p>}

                <Button type="submit" variant="primary" disabled={loading} className="w-full">
                  {loading ? "Submitting..." : `${tierCopy.cta} for ${tierCopy.name} Access`}
                </Button>
              </form>

              <Body className="mt-10 text-center text-sm">
                <Link
                  href="/membership"
                  className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  ← Back to tier selection
                </Link>
              </Body>
            </div>
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-3 block text-xs tracking-[0.14em] uppercase text-[var(--color-muted)] sm:tracking-[0.2em]">
        {label}
        {required && " *"}
      </label>
      {children}
    </div>
  );
}
