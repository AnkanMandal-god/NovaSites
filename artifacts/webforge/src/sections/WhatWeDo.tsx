import { motion } from "framer-motion";

export function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-24 border-t border-border bg-card/30">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2><span className="anchor-prefix">//</span> Built From Scratch. Engineered For Growth.</h2>
            <p className="text-muted-foreground text-lg mb-8">
              We do not deal in generic templates, bloated page builders, or cheap shortcuts. We hand-write your website from the first line of code to ensure it dominates your local market. Every digital asset we engineer and deploy is anchored by three non-negotiable structural pillars:
            </p>
            <ul className="space-y-6">
              {[
                { title: "Native SEO Architecture", desc: "Hardcoded straight into the foundation. Google seamlessly reads, indexes, and ranks your business above the regional competition." },
                { title: "100% Mobile Fluidity", desc: "Flawless, sub-second execution on every smartphone screen. We eliminate the lag, ensuring mobile visitors can tap your number and call you instantly." },
                { title: "Conversion-First Layouts", desc: "Distraction-free, high-velocity designs built for the sole purpose of turning raw traffic into paying inbound leads." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <strong className="text-white block text-lg mb-1">{item.title}</strong>
                    <span className="text-muted-foreground">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="relative w-full aspect-square max-w-md bg-card border border-border rounded-lg p-8 flex items-center justify-center">
              <svg width="200" height="240" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted">
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1, filter: "drop-shadow(0px 0px 10px rgba(0, 229, 255, 0.5))" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d="M100 2L190 40V120C190 180 100 238 100 238C100 238 10 180 10 120V40L100 2Z"
                  stroke="#00E5FF"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  d="M100 2V238 M10 80L190 80 M55 160L145 160"
                  stroke="#00E5FF"
                  strokeWidth="2"
                  strokeOpacity="0.5"
                />
              </svg>
            </div>
            <p className="mt-6 text-sm text-muted-foreground text-center">
              The WebForge Shield: Our signature mark of technical deployment. If a website isn't natively optimized for search engines, instantly responsive on mobile, and structurally built to capture leads, it does not leave our studio.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
