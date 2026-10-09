"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Showroom3DSection from "@/components/3d/Showroom3DSection";
import BrandApproach from "@/components/BrandApproach";
import BedroomConfigurator, { ConfigState } from "@/components/BedroomConfigurator";
import CollectionGrid from "@/components/CollectionGrid";
import EnquiryForm from "@/components/EnquiryForm";
import ShowroomContact from "@/components/ShowroomContact";
import Footer from "@/components/Footer";
import DemoBanner from "@/components/DemoBanner";

export default function Home() {
  const [config, setConfig] = useState<ConfigState | null>(null);

  const handleConfigComplete = (completedConfig: ConfigState) => {
    setConfig(completedConfig);
  };

  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#242421] relative selection:bg-[#42372F] selection:text-[#F6F3EE]">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Cinematic Hero Section */}
      <HeroSection />

      {/* Interactive 3D WebGL Showroom Section */}
      <Showroom3DSection />

      {/* Philosophy & Craftsmanship Section */}
      <section id="explore">
        <BrandApproach />
      </section>

      {/* Interactive 6-Step Bedroom Configurator */}
      <BedroomConfigurator onComplete={handleConfigComplete} />

      {/* Architectural Collections & Detail Views */}
      <CollectionGrid />

      {/* Working Demo Enquiry Form */}
      <EnquiryForm config={config} />

      {/* Verified Singapore Showroom & Contact */}
      <ShowroomContact />

      {/* Footer & Disclosure */}
      <Footer />

      {/* Client Demo Floating Banner */}
      <DemoBanner />
    </main>
  );
}
