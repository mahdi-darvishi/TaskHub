import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Layout,
  Play,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";

// --- Shadcn UI Components ---
// import { Header } from "@/components/layout/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // فرض بر این است که Avatar دارید (اگر ندارید حذف کنید)
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";

import Header from "@/components/landing/header";
import HeroSection from "@/components/landing/hero-section";
import FeaturesSection from "@/components/landing/features-section";
import HowItWorks from "@/components/landing/how-it-works";
import TestimoialsSection from "@/components/landing/testimoials-section";
import CtaSection from "@/components/landing/cta-section";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className=" bg-background font-sans text-foreground    ">
      <Header />
      <main className="flex-1 bg-background w-screen  ">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <TestimoialsSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
