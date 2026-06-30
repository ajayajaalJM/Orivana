"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { H1, Body, Caption } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { brand } from "@/lib/brand";
import { Footer } from "@/components/sections/Footer";

export default function MemberLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Try password: member");
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
          <div className="mx-auto max-w-md">
            <Caption className="mb-6 block text-center">{brand.harvestCircle}</Caption>
            <H1 className="!text-[var(--text-h2)] mb-12 text-center">{brand.innerCircleLogin}</H1>

            <Body className="mb-8 text-center text-sm text-[var(--color-muted)]">
              Demo accounts: member@orivana.com · chef@orivana.com · trade@orivana.com (password: member)
            </Body>

            <form onSubmit={handleSubmit} className="space-y-10">
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
                  className="input-luxury"
                />
              </div>

              {error && (
                <p className="text-sm font-light text-red-400/80">{error}</p>
              )}

              <Button type="submit" variant="primary" disabled={loading} className="w-full">
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <Body className="mt-8 text-center text-sm">
              Not yet a member?{" "}
              <Link href="/membership" className="text-[var(--color-sea)] hover:underline">
                {brand.harvestCircleJoin}
              </Link>
            </Body>
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}
