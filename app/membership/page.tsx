import type { Metadata } from "next";
import { getSession, getMemberOrders } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MembershipLanding } from "@/components/membership/MembershipLanding";
import { InnerCircleDashboard } from "@/components/membership/InnerCircleDashboard";
import { Footer } from "@/components/sections/Footer";
import { brand } from "@/lib/brand";
import { getProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: brand.harvestCircle,
  description: brand.harvestCircleDescription,
};

export default async function MembershipPage() {
  const session = await getSession();

  if (!session) {
    return (
      <>
        <MembershipLanding />
        <Footer />
      </>
    );
  }

  const [orders, products] = await Promise.all([
    getMemberOrders(session.user?.id),
    getProducts(20),
  ]);

  return (
    <>
      <Section className="page-top">
        <Container wide>
          <InnerCircleDashboard session={session} orders={orders} products={products} />
        </Container>
      </Section>
      <Footer />
    </>
  );
}
