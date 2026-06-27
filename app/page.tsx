import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeatureGrid from "@/components/FeatureGrid";
import PreviewSection from "@/components/PreviewSection";
import PricingCards from "@/components/PricingCards";
import Footer from "@/components/Footer";
import GlowButton from "@/components/GlowButton";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeatureGrid />
      <PreviewSection />
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-5xl">Simple pricing</h2>
            <p className="mt-4 text-muted">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>
          <div className="mt-16">
            <PricingCards />
          </div>
          <div className="mt-12 text-center">
            <GlowButton href="/pricing" variant="secondary">
              View all plans
            </GlowButton>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
