import { redirect } from "next/navigation";
import { resolveCollectionHandle } from "@/lib/shopify";

interface Props {
  params: Promise<{ handle: string }>;
}

export default async function LegacyShopCollectionPage({ params }: Props) {
  const { handle } = await params;
  redirect(`/collections/${resolveCollectionHandle(handle)}`);
}
