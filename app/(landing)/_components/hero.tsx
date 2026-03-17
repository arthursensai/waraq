"use client";

import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import { Suspense } from "react";
import { ChevronDown } from "lucide-react";
import HeroActions from "./hero-actions";

const HeroVisual = dynamic(() => import("./hero-visual"), { ssr: false });

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      delay,
    },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
      delay,
    },
  }),
};

const Hero = () => {
  return (
    <section className="relative flex flex-col overflow-hidden">
      {/* Dot grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient glow — replace the existing one */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
      radial-gradient(ellipse 55% 60% at 78% 48%, oklch(from var(--primary) l c h / 0.18) 0%, transparent 65%),
      radial-gradient(ellipse 35% 40% at 72% 52%, oklch(from var(--primary) l c h / 0.10) 0%, transparent 55%)
    `,
        }}
      />

      {/* ── Main grid ─────────────────────────────────────── */}
      <div className="relative flex flex-1 items-center justify-center px-6 pb-16 pt-20">
        <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-8">
          {/* ── Left: Copy ──────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            {/* Eyebrow */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              custom={0.1}
              className="flex items-center gap-3"
            >
              <div className="h-px w-6 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Personal reading library
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.2}
              className="font-serif text-5xl font-bold leading-[1.06] tracking-tight text-foreground md:text-6xl lg:text-7xl"
            >
              Every page
              <br />
              <span className="italic text-primary">you&apos;ve read,</span>
              <br />
              in one place.
            </motion.h1>

            {/* Body */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.35}
              className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Upload your PDFs, track your readings, and organize your authors —
              all from a single focused library built for readers who mean it.
            </motion.p>

            {/* CTAs */}
            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.45}
              className="flex flex-wrap items-center gap-4"
            >
              <HeroActions />
            </motion.div>
          </div>

          {/* ── Right: 3D Book ──────────────────────────────── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={0.3}
            className="relative flex h-120 w-full items-center justify-center lg:h-145"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, oklch(from var(--primary) l c h / 0.15) 0%, transparent 65%)",
              }}
            />
            <HeroVisual />
          </motion.div>
        </div>
      </div>

      {/* ── Bottom divider + scroll hint ──────────────────── */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        custom={0.7}
        className="flex flex-col items-center gap-3 px-6 pb-6"
      >
        <div className="mx-auto h-px w-full max-w-5xl bg-linear-to-r from-transparent via-border to-transparent" />
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="opacity-30"
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
