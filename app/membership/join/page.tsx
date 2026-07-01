"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { H1, Excerpt, Body, Caption } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/sections/Footer";
import { brand } from "@/lib/brand";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerAccountEnabled, setCustomerAccountEnabled] = useState(false);
  const tierCopy = brand.tiers.individual;

  useEffect(() => {
    fetch("/api/shopify/status")
      .then((res) => res.json())
      .then((data) => setCustomerAccountEnabled(Boolean(data.customerAccount)))
      .catch(() => setCustomerAccountEnabled(false));
  }, []);

  const handleShopifyJoin = () => {
    window.location.href = "/api/customer/account/auth?returnTo=/membership";
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    await fetch("/api/membership/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, tier: "individual" }),
    });

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/membership");
    router.refresh();
  };

  return (
    <>
      <Section className="page-top">
        <Container>
          <div className="membership-glow relative mx-auto max-w-md px-4 py-8">
            <div className="relative z-10">
              <Caption className="mb-6 block text-center">{brand.harvestCircle}</Caption>
              <H1 className="!text-[var(--text-h2)] mb-4 text-center">{tierCopy.tagline}</H1>
              <Excerpt className="mb-8 text-center">{tierCopy.description}</Excerpt>

              <ul className="mb-10 space-y-3">
                {tierCopy.access.map((benefit) => (
                  <li
                    key={benefit}
                    className="text-xs font-light tracking-[0.12em] uppercase text-[var(--color-muted)]"
                  >
                    {benefit}
                  </li>
                ))}
              </ul>

              {customerAccountEnabled ? (
                <div className="space-y-8">
                  <Body className="text-center text-sm text-[var(--color-muted)]">
                    Create your account through Shopify&apos;s secure sign-in. New members can register
                    during the flow.
                  </Body>
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full"
                    onClick={handleShopifyJoin}
                  >
                    {brand.harvestCircleJoin}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-10">
                  <div>
                    <label className="mb-3 block text-xs tracking-[0.14em] uppercase text-[var(--color-muted)] sm:tracking-[0.2em]">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="input-luxury"
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-xs tracking-[0.14em] uppercase text-[var(--color-muted)] sm:tracking-[0.2em]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input-luxury"
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-xs tracking-[0.14em] uppercase text-[var(--color-muted)] sm:tracking-[0.2em]">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="input-luxury"
                    />
                  </div>

                  {error && <p className="text-sm font-light text-red-400/80">{error}</p>}

                  <Button type="submit" variant="primary" disabled={loading} className="w-full">
                    {loading ? "Joining..." : brand.harvestCircleJoin}
                  </Button>
                </form>
              )}

              <Body className="mt-12 text-center text-sm">
                <Link
                  href="/membership"
                  className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  ← Back to tier selection
                </Link>
                {" · "}
                <Link
                  href="/membership/login"
                  className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  {brand.innerCircleLogin}
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
