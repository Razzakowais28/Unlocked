"use client";

import { motion } from "framer-motion";
import { PenLine, Lock, Unlock } from "lucide-react";
import GlassCard from "./GlassCard";

const steps = [
  {
    number: "01",
    icon: PenLine,
    title: "Create",
    description: "Add letters, photos, videos, voice notes, goals, and surprises to your capsule.",
  },
  {
    number: "02",
    icon: Lock,
    title: "Lock",
    description: "Choose a future unlock date. Your memories stay hidden until that moment arrives.",
  },
  {
    number: "03",
    icon: Unlock,
    title: "Unlock",
    description: "Open it when the future arrives. Relive every memory in a beautiful experience.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">How it works</h2>
          <p className="mt-4 text-muted">
            Lock away your memories until the moment that matters.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard hover className="h-full p-8">
                <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                  {step.number}
                </span>
                <div className="icon-tile mt-6 h-12 w-12">
                  <step.icon className="h-6 w-6 text-[var(--primary-bright)]" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
