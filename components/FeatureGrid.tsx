"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Film,
  Link2,
  Users,
  Bell,
  Layers,
  Palette,
  Smartphone,
} from "lucide-react";
import GlassCard from "./GlassCard";

const features = [
  { icon: Shield, title: "Private by design", description: "Locked until your chosen date. Production encryption can be added later." },
  { icon: Film, title: "AI memory movie", description: "Turn your capsule into a cinematic memory reel. Coming soon." },
  { icon: Link2, title: "Share countdown link", description: "Share a countdown. Keep the memories hidden." },
  { icon: Users, title: "Collaborate with others", description: "Build capsules together with family and friends." },
  { icon: Bell, title: "Reminders & notifications", description: "Get notified when unlock day approaches." },
  { icon: Layers, title: "Multiple capsule types", description: "Personal, family, couple, graduation, and more." },
  { icon: Palette, title: "Beautiful themes", description: "Cosmic, sunset, vintage, and premium visual themes." },
  { icon: Smartphone, title: "Mobile & web sync", description: "Create on web, open on any device when the time comes." },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">Everything you need</h2>
          <p className="mt-4 text-muted">
            Create letters, photos, videos, voice notes, goals, and surprises.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard hover className="h-full p-6">
                <div className="icon-tile h-10 w-10">
                  <feature.icon className="h-5 w-5 text-[var(--primary-bright)]" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
