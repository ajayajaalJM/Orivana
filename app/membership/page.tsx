import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MembershipLanding } from "@/components/membership/MembershipLanding";
import { InnerCircleDashboard } from "@/components/membership/InnerCircleDashboard";
import { Footer } from "@/components/sections/Footer";
import { brand } from "@/lib/brand";
import { createPageMetadata } from "@/lib/metadata";
import { getInnerCircleSessionOrPending } from "@/lib/membership-session";
import { getProducts } from "@/lib/shopify";
import { getCustomerAccountOrders } from "@/lib/shopify/customer-account/customer";
import { mapCustomerAccountOrdersToMemberOrders } from "@/lib/shopify/customer-account/order-mapper";
import { getMemberOrders } from "@/lib/auth";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";

export const metadata: Metadata = createPageMetadata({
  title: brand.harvestCircle,
  description: brand.harvestCircleDescription,
  path: "/membership",
});

export default async function MembershipPage() {
  const { session, pending } = await getInnerCircleSessionOrPending();

  if (pending) {
    redirect("/membership/pending");
  }

  if (!session) {
    return (
      <>
        <MembershipLanding />
        <Footer />
      </>
    );
  }

  const products = await getProducts(20);

  let orders = isCustomerAccountConfigured()
    ? mapCustomerAccountOrdersToMemberOrders(await getCustomerAccountOrders())
    : [];

  if (!orders.length && session.source === "nextauth") {
    orders = await getMemberOrders(session.user.id);
  }

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
