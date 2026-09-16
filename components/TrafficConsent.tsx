"use client";

import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import styles from "./TrafficConsent.module.css";

const choiceKey = "saltwaves_traffic_analytics_choice";
const beaconToken = "9fa410937dee4ddc8c6a0f7e2bb47c9d"; // Public Cloudflare site token.
type Choice = "unknown" | "allowed" | "declined";

function readChoice(): Choice {
  try {
    const value = window.localStorage.getItem(choiceKey);
    return value === "allowed" || value === "declined" ? value : "unknown";
  } catch {
    return "unknown";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("saltwaves-traffic-choice", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("saltwaves-traffic-choice", onChange);
  };
}

function useChoice(): Choice | null {
  return useSyncExternalStore(subscribe, readChoice, () => null);
}

function isPublicPage(path: string): boolean {
  return path === "/" || [
    "/podmaster", "/pricing", "/faq", "/services", "/tjanster",
    "/founding", "/promptermaster", "/blog", "/privacy", "/terms",
    "/adobe-podcast-alternative", "/auphonic-alternative",
    "/podcast-audio-cleanup", "/podcast-mastering", "/podcast-mastering-api",
  ].some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function setChoice(next: Exclude<Choice, "unknown">) {
  try {
    const previous = readChoice();
    window.localStorage.setItem(choiceKey, next);
    if (next === "allowed" || previous === "allowed") {
      // A reload reliably starts or stops the beacon for the current page.
      window.location.reload();
    } else {
      window.dispatchEvent(new Event("saltwaves-traffic-choice"));
    }
  } catch {
    // If the choice cannot be stored, measurement stays off.
  }
}

export default function TrafficConsent() {
  const choice = useChoice();
  const pathname = usePathname();

  useEffect(() => {
    if (choice !== "allowed" || !isPublicPage(pathname)) return;
    if (document.querySelector("script[data-cf-beacon]")) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    // Only measure full public page loads. Private app routes and SPA transitions
    // are not sent to Cloudflare.
    script.dataset.cfBeacon = JSON.stringify({ token: beaconToken, spa: false });
    document.body.appendChild(script);
  }, [choice, pathname]);

  return choice === "unknown" && isPublicPage(pathname) ? (
    <aside className={styles.banner} aria-label="Optional visitor analytics">
      <p>May we measure visits to our public pages and where visitors came from? Cloudflare Web Analytics runs only if you agree. <a href="/privacy">Privacy policy</a></p>
      <div className={styles.actions}>
        <button type="button" onClick={() => setChoice("declined")}>No thanks</button>
        <button type="button" onClick={() => setChoice("allowed")}>Allow analytics</button>
      </div>
    </aside>
  ) : null;
}

export function TrafficPrivacyChoice() {
  const choice = useChoice();
  return (
    <div className={styles.preferences}>
      <p>Your choice: {choice === "allowed" ? "analytics allowed" : choice === "declined" ? "analytics declined" : "no choice saved"}.</p>
      <button type="button" onClick={() => setChoice("declined")}>Decline analytics</button>
      <button type="button" onClick={() => setChoice("allowed")}>Allow analytics</button>
    </div>
  );
}
