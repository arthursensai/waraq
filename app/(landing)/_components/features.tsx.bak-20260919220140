"use client";

import { motion, type Variants, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BookMarked, BookOpen, NotebookPen, Users } from "lucide-react";

// ── Variants ───────────────────────────────────────────────────────────────
const sectionReveal: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const rowReveal: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      delay,
    },
  }),
};

// ── Data ───────────────────────────────────────────────────────────────────
const features = [
  {
    number: "01",
    icon: BookMarked,
    title: "Never lose your place",
    description:
      "Waraq remembers your last page across every document. Pick up exactly where you left off — whether it's a novel you started last week or a paper you opened this morning.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Read directly in your browser",
    description:
      "No downloads, no switching apps. Open any PDF and read it right inside Waraq — clean, focused, distraction-free.",
  },
  {
    number: "03",
    icon: Users,
    title: "Many authors, one document",
    description:
      "A book can have co-authors, editors, translators. Waraq lets you connect every document to as many authors as it deserves — and browse your library by the minds behind the work.",
  },
  {
    number: "04",
    icon: NotebookPen,
    title: "Notes that live with your reading",
    description:
      "Capture thoughts, quotes, and reflections as you read. Your notes stay attached to the document they came from, always in context.",
  },
];

// ── Component ──────────────────────────────────────────────────────────────
const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.3, 1]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity }}
      className="relative overflow-hidden pt-16 pb-32"
    >
      {/* Dot grid — matches hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-0 h-175 w-175 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(from var(--primary) l c h / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Vertical line accent */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute left-6 top-0 h-full w-px origin-top bg-linear-to-b from-transparent via-border to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-6">

        {/* ── Section header ─────────────────────────────── */}
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 max-w-xl"
        >
          <motion.div variants={fadeIn} className="mb-6 flex items-center gap-3">
            <div className="h-px w-6 bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Features
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl"
          >
            Built around
            <br />
            <span className="italic text-primary">how readers think.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Every feature in Waraq exists because a reader needed it.
          </motion.p>
        </motion.div>

        {/* ── Feature rows ───────────────────────────────── */}
        <div className="flex flex-col divide-y divide-border">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.number}
                variants={rowReveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                custom={i * 0.08}
                className="group grid grid-cols-1 gap-6 py-10 md:grid-cols-[80px_1fr_1fr] md:items-center md:gap-12"
              >
                {/* Number */}
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.3, duration: 0.5 }}
                  className="font-mono text-xs font-medium tracking-[0.15em] text-muted-foreground"
                >
                  {feature.number}
                </motion.span>

                {/* Icon + title */}
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.08 + 0.15,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-border bg-muted transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/5"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                  </motion.div>
                  <h3 className="font-serif text-xl font-bold text-foreground md:text-2xl">
                    {feature.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </motion.section>
  );
};

export default Features;