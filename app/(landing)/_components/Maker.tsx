"use client";

import { motion, type Variants } from "framer-motion";
import { Instagram } from "lucide-react";
import Link from "next/link";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      delay,
    },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  }),
};

const Maker = () => {
  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ backgroundColor: "oklch(from var(--muted) l c h / 0.4)" }}
    >
      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top border accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      {/* Bottom border accent */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-120 w-120 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, oklch(from var(--primary) l c h / 0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* ── Left: Identity ──────────────────────────── */}
          <div className="flex flex-col gap-8">
            {/* Eyebrow */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={0}
              className="flex items-center gap-3"
            >
              <div className="h-px w-6 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                The maker
              </span>
            </motion.div>

            {/* Name */}
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={0.1}
              className="font-serif text-5xl font-bold leading-[1.06] tracking-tight text-foreground md:text-6xl"
            >
              Built by
              <br />
              <span className="italic text-primary">Arthur.</span>
            </motion.h2>

            {/* Purpose */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={0.2}
              className="max-w-md text-base text-muted-foreground md:text-lg"
              style={{ lineHeight: "2" }}
            >
              I read to grow. Every book, paper, and article I pick up is a step
              toward understanding myself and the world better. Waraq started as
              my personal tool to keep that journey organized — and it became
              something worth sharing.
            </motion.p>

            {/* Instagram */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={0.3}
            >
              <Link
                href="https://www.instagram.com/sensai_arthur/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-sm border border-border bg-background px-6 py-3 text-sm font-semibold tracking-wide text-foreground transition-all duration-200 hover:border-primary/50 hover:text-primary"
              >
                <Instagram className="h-4 w-4 transition-colors duration-200 group-hover:text-primary" />
                @arthur
              </Link>
            </motion.div>
          </div>

          {/* ── Right: Quote card ───────────────────────── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0.2}
            className="flex flex-col gap-6"
          >
            {/* Quote block */}
            <div className="rounded-sm border border-border bg-background p-8">
              <blockquote
                className="font-serif text-2xl font-bold italic text-foreground md:text-3xl"
                style={{ lineHeight: "1.6" }}
              >
                &ldquo;I don&apos;t read to escape.
                <br />I read to arrive.&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-3">
                <div className="h-px w-6 bg-primary/50" />
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Arthur — creator of Waraq
                </span>
              </div>
            </div>

            {/* Reading tags */}
            <div className="flex flex-wrap gap-2">
              {["Self development", "Philosophy", "Psychology"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-border bg-background px-3 py-1.5 text-xs font-medium tracking-wide text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Maker;
