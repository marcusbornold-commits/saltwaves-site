import type { Metadata } from "next";
import styles from "../legal.module.css";
import { TrafficPrivacyChoice } from "@/components/TrafficConsent";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy — Saltwaves",
  description:
    "How Saltwaves handles your personal data: what we collect, how long we keep it, and your rights under GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className={styles.page}>
      <h1>Privacy Policy</h1>
      <p className={styles.updated}>Last updated: 16 September 2026</p>

      <h2>Controller</h2>
      <p>
        Marcus Bornold, sole proprietorship trading as Saltwaves Studio,
        Oskarsparken 6, 702 12 Örebro, Sweden. Contact:{" "}
        <a href="mailto:hello@saltwaves.studio">hello@saltwaves.studio</a>
      </p>

      <h2>What we collect</h2>
      <p>
        We process your email address, uploaded audio, file and job details, and
        delivery status to provide the mastering service. If you create an account,
        we also process your account and sign-in details and subscription status.
        Service providers may process technical connection and security logs.
      </p>

      <h2>Free tier</h2>
      <p>
        You can upload without creating an account. Your email address and job
        details are stored temporarily in our Supabase job queue to process and
        deliver your file. Free audio uploads go directly to our own hardware.
      </p>

      <h2>Retention</h2>
      <p>
        Download links expire 48 hours after processing completes. Working copies
        are removed when processing finishes. Original uploads, original-audio
        previews and mastered files are removed by scheduled cleanup. Link expiry
        and physical deletion are separate: cleanup runs periodically and may be
        delayed while a failed cleanup is retried. Paid cloud inputs are cleaned
        up separately after their job finishes, fails or expires. Download and
        keep your own copy; the service is not an audio archive.
      </p>

      <h2>Where processing happens</h2>
      <p>
        Audio processing runs on our own hardware within the EU. Creator,
        Studio and Founding uploads use private Supabase Storage in Frankfurt
        as temporary input storage before our hardware retrieves the file for
        processing. Completed, cancelled and expired cloud inputs are removed
        by automatic cleanup. Mastered files are served from our own hardware.
      </p>

      <h2>Paid accounts</h2>
      <p>
        Account details are stored to provide the service. Stripe handles checkout,
        billing and payment records under its own privacy terms and applicable
        data-protection roles. Stripe may process data outside the EU. Its privacy
        policy describes the safeguards used for international transfers.
      </p>

      <h2>Sign-in and email providers</h2>
      <p>
        Google processes sign-in information when you choose Google sign-in.
        Supabase stores account and job information. Resend handles sign-in and
        delivery emails. If you submit an updates or spec-sheet form, your email
        is passed to MailerLite for that requested communication. Payment and
        account records have retention requirements separate from audio files.
      </p>
      <h2>Browser tools and previous analytics</h2>
      <p>
        Loudness Inspector processes audio in your browser. Its optional analytics
        collection is paused. Earlier versions recorded tool events, audio-level
        measurements, duration, selected targets and referrer information in
        Supabase, and used a 30-day first-party cookie to attribute later usage.
        Pausing collection does not itself delete previously stored events.
        Contact us about access or deletion of personal data.
      </p>
      <h2>Your rights under GDPR</h2>
      <p>
        Access, rectification, erasure, data portability, restriction and
        objection. Send requests to{" "}
        <a href="mailto:hello@saltwaves.studio">hello@saltwaves.studio</a>. You
        also have the right to lodge a complaint with the Swedish Authority for
        Privacy Protection (IMY).
      </p>

      <h2>Cookies</h2>
      <p>
        Sign-in uses cookies needed to operate your account. Loudness Inspector
        no longer sets its optional first-touch analytics cookie or sends new
        measurement events. Its updated code removes the old marker when invoked.
        Optional Cloudflare Web Analytics measures visits and referral sources on
        public pages only if you choose to allow it. It does not measure account,
        upload or audio pages. Cloudflare receives page path, referrer, device and
        performance information; URL query strings are not used. Your choice is
        saved in this browser and can be changed below. Earlier visits cannot
        be measured retroactively.
      </p>
      <TrafficPrivacyChoice />

      <h2>Data Processing Agreement</h2>
      <p>
        A Data Processing Agreement under GDPR Article 28 is available to
        business customers on request.
      </p>
    </article>
  );
}
