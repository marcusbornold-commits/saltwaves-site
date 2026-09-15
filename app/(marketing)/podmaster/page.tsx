import type { Metadata } from "next";
import { auth } from "@/auth";
import { getAccessForSession } from "@/lib/access";
import { getPriceIdsFromEnv } from "@/lib/pricing";
import App from "../../components/saltwaves-app";

export const metadata: Metadata = {
  title: "PodMaster — Podcast Mastering | Saltwaves Studio",
  description:
    "Upload your podcast and get broadcast-ready audio. Noise reduction, balanced EQ and consistent loudness with PodMaster.",
  alternates: { canonical: "/podmaster" },
};

export default async function PodMasterPage() {
  const session = await auth();
  const access = await getAccessForSession();

  return (
    <App
      isLoggedIn={Boolean(session?.user)}
      priceIds={getPriceIdsFromEnv()}
      access={access}
      showSuite={false}
    />
  );
}
