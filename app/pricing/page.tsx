import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCards from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground md:text-6xl">
              Choose your <span className="gradient-text">plan</span>
            </h1>
            <p className="mt-4 text-lg text-muted">
              Preserve today for the person you&apos;ll become tomorrow.
            </p>
          </div>
          <div className="mt-16">
            <PricingCards showAll />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
