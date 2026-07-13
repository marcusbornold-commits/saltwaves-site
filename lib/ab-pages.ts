export type AbTrack = {
  src: string;
  label: string;
  hint?: string;
};

export type AbPageConfig = {
  slug: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  trackA: AbTrack;
  trackB: AbTrack;
  findings: string[];
};
