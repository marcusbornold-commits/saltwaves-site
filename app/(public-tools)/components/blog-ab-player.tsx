"use client";

import ABPlayer from "./ABPlayer";

type BlogABPlayerProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export default function BlogABPlayer({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
}: BlogABPlayerProps) {
  return (
    <ABPlayer
      embedded
      config={{
        slug: "blog-embed",
        title: "",
        trackA: { src: beforeSrc, label: beforeLabel },
        trackB: { src: afterSrc, label: afterLabel },
        findings: [],
      }}
    />
  );
}
