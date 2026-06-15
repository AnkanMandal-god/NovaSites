import { motion } from "framer-motion";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <h2><span className="anchor-prefix">//</span> Elite engineering. Traditional agency prices liquidated.</h2>
        
        <div className="grid md:grid-cols-2 gap-0 border border-border rounded-lg overflow-hidden mt-12 max-w-5xl mx-auto">
          {/* Legacy Agency */}
          <div className="bg-card p-10 border-r border-border relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />
            <h3 className="text-2xl font-bold text-white mb-2">Traditional Agency Model</h3>
            <p className="text-muted-foreground mb-8">WordPress / Wix / Elementor</p>
            
            <ul className="space-y-4 mb-10 text-muted-foreground">
              <li className="flex items-center"><span className="text-destructive mr-2">✕</span> 4.5+ second load times</li>
              <li className="flex items-center"><span className="text-destructive mr-2">✕</span> Monthly maintenance retainers</li>
              <li className="flex items-center"><span className="text-destructive mr-2">✕</span> 4-8 week bloated timelines</li>
              <li className="flex items-center"><span className="text-destructive mr-2">✕</span> You rent, they own the code</li>
            </ul>
            
            <div className="pt-8 border-t border-border">
              <div className="text-sm text-muted-foreground mb-1">Standard Industry Pricing</div>
              <div className="text-3xl font-bold text-white line-through opacity-50">$2,500 – $7,500+</div>
            </div>
          </div>

          {/* WebForge */}
          <div className="bg-card p-10 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            <h3 className="text-2xl font-bold text-white mb-2">Custom Hand-Coded Engine</h3>
            <p className="text-primary mb-8 font-mono text-sm">WEBFORGE // ARCHITECTURE</p>
            
            <ul className="space-y-4 mb-10 text-white">
              <li className="flex items-center"><span className="text-primary mr-2">✓</span> Sub-second load times</li>
              <li className="flex items-center"><span className="text-primary mr-2">✓</span> Zero maintenance required</li>
              <li className="flex items-center"><span className="text-primary mr-2">✓</span> 5-10 day rapid deployment</li>
              <li className="flex items-center"><span className="text-primary mr-2">✓</span> 100% asset ownership</li>
            </ul>
            
            <div className="pt-8 border-t border-border">
              <div className="text-sm text-primary font-mono mb-1">One-Time Deployment Fee</div>
              <div className="text-4xl font-black text-white">$800 – $2,200</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
