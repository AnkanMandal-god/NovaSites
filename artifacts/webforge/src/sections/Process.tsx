import { motion } from "framer-motion";

export function Process() {
  return (
    <section id="process" className="py-24 border-y border-border bg-card/20">
      <div className="container mx-auto px-6">
        <div className="text-primary font-mono text-sm mb-4 uppercase">The Process</div>
        <h2 className="!normal-case mb-12"><span className="anchor-prefix">//</span> Operational overview.</h2>
        
        <div className="relative mb-16 pt-8 hidden md:block">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2" />
          <motion.div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 shadow-[0_0_10px_rgba(0,229,255,0.5)]"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 2 }}
          />
          <div className="flex justify-between relative z-10 text-primary font-mono text-sm">
            <div className="bg-background px-4 border border-primary rounded py-1">PHASE 01</div>
            <div className="bg-background px-4 border border-primary rounded py-1">PHASE 02</div>
            <div className="bg-background px-4 border border-primary rounded py-1">PHASE 03</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { phase: "PHASE_01", title: "THE BLUEPRINT", subtitle: "Strategy & Structure", desc: "We map out your business objectives, target audience, and required architecture before a single line of code is written." },
            { phase: "PHASE_02", title: "THE BUILD", subtitle: "High-Velocity Engineering", desc: "Custom clean-code implementation using modern web technologies to ensure a lightweight, secure, and blazing fast application." },
            { phase: "PHASE_03", title: "THE DEPLOYMENT", subtitle: "Live Operations", desc: "Rigorous testing, final optimization, and launch. Your lead generation asset is now live and tracking conversions." }
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border p-8 rounded-md">
              <div className="text-primary font-mono text-xs mb-2">{item.phase} // {item.title}</div>
              <h3 className="text-xl font-bold text-white mb-4">{item.subtitle}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
