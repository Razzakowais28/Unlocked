"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import GlassCard from "./GlassCard";
import GlowButton from "./GlowButton";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for your first capsule",
    features: ["1 capsule", "500 MB storage", "Basic countdown page", "1 year max lock"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$9",
    period: "/month",
    description: "For memory keepers",
    features: [
      "Unlimited capsules",
      "100 GB storage",
      "AI memory movie",
      "Premium themes",
      "Long-term capsules",
      "Family sharing",
    ],
    cta: "Go Premium",
    highlighted: true,
  },
  {
    name: "Lifetime",
    price: "$199",
    period: "one-time",
    description: "One capsule, forever",
    features: [
      "One-time capsule purchase",
      "Store for 25+ years",
      "Premium theme",
      "Large uploads",
      "Priority recovery",
    ],
    cta: "Buy Lifetime",
    highlighted: false,
  },
];

export default function PricingCards({ showAll = false }: { showAll?: boolean }) {
  const [toast, setToast] = useState<string | null>(null);
  const displayPlans = showAll ? plans : plans;

  const handleClick = () => {
    setToast("Payments coming soon!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {displayPlans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard
              className={`h-full p-8 ${plan.highlighted ? "border-[var(--primary)]/50 glow-purple" : ""}`}
            >
              {plan.highlighted && (
                <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-bright)] px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted"> {plan.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {plan.cta === "Start Free" ? (
                  <GlowButton href="/login" className="w-full">
                    {plan.cta}
                  </GlowButton>
                ) : (
                  <GlowButton onClick={handleClick} className="w-full" variant={plan.highlighted ? "primary" : "secondary"}>
                    {plan.cta}
                  </GlowButton>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {toast && (
        <div className="toast fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-xl px-6 py-3 text-sm shadow-xl backdrop-blur-xl">
          {toast}
        </div>
      )}
    </>
  );
}
