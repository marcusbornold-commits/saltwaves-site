import type { Metadata } from "next";
import { auth } from "@/auth";
import { getAccessForSession } from "@/lib/access";
import { UploadZone } from "../components/saltwaves-ui";
import { Nav } from "../components/saltwaves-sections";
import styles from "./podmaster.module.css";

export const metadata: Metadata = {
  title: "PodMaster — Podcast Mastering | Saltwaves Studio",
  description: "Upload your podcast. We clean the noise, balance the sound and email your mastered episode.",
  alternates: { canonical: "/podmaster" },
};

export default async function PodMasterPage() {
  const session = await auth();
  const access = await getAccessForSession();

  return (
    <div className={styles.page}>
      <Nav isLoggedIn={Boolean(session?.user)} />
      <main className={styles.main}>
        <div className={styles.tool}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>PODCAST MASTERING</p>
            <h1>PodMaster<span>.</span></h1>
            <p className={styles.description}>Upload your episode. We clean the noise, balance the sound and email you the finished master.</p>
          </div>
          <UploadZone access={access} />
          <p className={styles.note}>Your download is available for 48 hours.</p>
        </div>
      </main>
    </div>
  );
}
