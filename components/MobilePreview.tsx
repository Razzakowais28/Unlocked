"use client";

import { motion } from "framer-motion";

interface MobilePreviewProps {
  title: string;
  children: React.ReactNode;
}

export default function MobilePreview({ title, children }: MobilePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center"
    >
      <p className="mb-4 text-sm font-medium text-muted">{title}</p>
      <div className="relative w-48 overflow-hidden rounded-[2rem] border-4 border-subtle bg-[#0B1020] shadow-2xl md:w-56">
        <div className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black" />
        <div className="h-[320px] overflow-hidden p-3 pt-8">{children}</div>
      </div>
    </motion.div>
  );
}
