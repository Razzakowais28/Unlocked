"use client";

import { motion } from "framer-motion";
import { Lock, Image as ImageIcon } from "lucide-react";
import GlowButton from "./GlowButton";
import ThemeToggle from "./ThemeToggle";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-primary-soft blur-[120px]" />
        <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--accent-pink)_12%,transparent)] blur-[100px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            A message meant for the{" "}
            <span className="gradient-text">future</span>.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted">
            Create a time capsule filled with your memories, locked away until the day you choose.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <GlowButton href="/login">Create your capsule</GlowButton>
            <GlowButton href="/#how-it-works" variant="secondary">
              Watch demo
            </GlowButton>
            <ThemeToggle variant="pill" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -left-4 top-8 z-10 h-20 w-16 rotate-[-12deg] overflow-hidden rounded-xl border border-subtle bg-gradient-to-br from-pink-500/30 to-purple-600/30 shadow-lg backdrop-blur-sm md:-left-8 md:h-28 md:w-20"
          >
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-6 w-6 text-foreground/60" />
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            className="absolute -right-2 top-16 z-10 h-16 w-14 rotate-[8deg] overflow-hidden rounded-xl border border-subtle bg-gradient-to-br from-blue-400/30 to-violet-600/30 shadow-lg backdrop-blur-sm md:-right-6 md:h-24 md:w-18"
          >
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-5 w-5 text-foreground/60" />
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-12 -left-2 z-10 h-14 w-12 rotate-[5deg] overflow-hidden rounded-lg border border-subtle bg-gradient-to-br from-amber-400/30 to-orange-600/30 shadow-lg backdrop-blur-sm md:bottom-16"
          >
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-4 w-4 text-foreground/60" />
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-primary-soft blur-3xl animate-pulse-glow" />
            <div className="relative flex h-64 w-64 items-center justify-center rounded-3xl border border-subtle glass-card shadow-2xl md:h-80 md:w-80">
              <div className="absolute inset-4 rounded-2xl border border-subtle bg-gradient-to-br from-[var(--glass-bg)] to-transparent" />
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-bright)] shadow-lg shadow-purple-500/50"
              >
                <Lock className="h-12 w-12 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-4 px-4 md:grid-cols-4 md:px-6"
      >
        {["Lock it", "Wait", "Unlock", "Relive"].map((step, i) => (
          <div
            key={step}
            className="glass-card flex flex-col items-center rounded-xl px-4 py-4 text-center"
          >
            <span className="text-xs font-medium text-primary">0{i + 1}</span>
            <span className="mt-1 text-sm font-semibold text-foreground">{step}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
