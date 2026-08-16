"use client";

import React from "react";
import { HeroSection } from "./hero-section";
import { VisualCenterpiece } from "./visual-centerpiece";
import { FeatureGrid } from "./feature-grid";
import { PhilosophySection } from "./philosophy-section";
import { CtaSection } from "./cta-section";
import { FooterSection } from "./footer-section";

export function LandingPage() {
  return (
    <div className="w-full space-y-12 sm:space-y-16">
      <HeroSection />
      <VisualCenterpiece />
      <FeatureGrid />
      <PhilosophySection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
