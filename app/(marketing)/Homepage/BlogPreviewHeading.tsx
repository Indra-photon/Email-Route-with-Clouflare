"use client";

import { motion } from "motion/react";
import { Heading } from "@/components/Heading";

export function BlogPreviewHeading() {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
    >
      <Heading as="h2" className="text-neutral-900 leading-tight">
        Guides for teams{" "}
        <span className="text-sky-800 font-extralight">that support customers from Slack.</span>
      </Heading>
    </motion.div>
  );
}
