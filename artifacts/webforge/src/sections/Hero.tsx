import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      
      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-8">
            Your Business Deserves More Leads. We Build the Website That Actually Delivers Them.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl leading-relaxed">
            If you don't have a fast, mobile-friendly website, you're invisible to local leads. We build sites that rank higher and convert more visitors into calls and build you the online brand your business deserves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#contact" className="btn-primary">
              Get Your Website
            </a>
            <a href="#what-we-do" className="btn-ghost">
              See the Difference <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
