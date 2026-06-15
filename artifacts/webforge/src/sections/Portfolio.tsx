import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Portfolio() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(percent);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) handleMove(e.clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="mb-4"><span className="anchor-prefix">//</span> The Portfolio.</h2>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Performance Proof: A digital infrastructure is only as valuable as the measurable results it delivers.
        </p>

        {/* Primary Showcase Slider */}
        <div 
          ref={containerRef}
          className="relative w-full h-[60vh] min-h-[400px] bg-card border border-border overflow-hidden select-none cursor-ew-resize mb-8 rounded"
          onMouseMove={onMouseMove}
          onTouchMove={onTouchMove}
          onMouseDown={(e) => handleMove(e.clientX)}
        >
          {/* Legacy Site Background (Red Tint) */}
          <div className="absolute inset-0 bg-[#221111] flex items-center justify-center overflow-hidden">
            <div className="opacity-20 text-destructive text-[10rem] font-black blur-sm select-none pointer-events-none transform -rotate-12">LEGACY</div>
            <div className="absolute bottom-8 left-8 text-destructive font-mono text-sm">
              SPEED: 4.8s<br/>CONVERSION: 1.2%
            </div>
          </div>

          {/* WebForge Site Overlay (Cyan Tint) */}
          <div 
            className="absolute top-0 left-0 bottom-0 bg-[#0A1A1A] overflow-hidden border-r border-primary shadow-[2px_0_15px_rgba(0,229,255,0.3)]"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="absolute inset-0 w-[100vw] flex items-center justify-center">
               <div className="opacity-20 text-primary text-[10rem] font-black blur-[1px] select-none pointer-events-none transform rotate-12">FORGED</div>
               <div className="absolute bottom-8 left-8 text-primary font-mono text-sm">
                 SPEED: 0.8s<br/>CONVERSION: 6.4%
               </div>
            </div>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-primary left-0 -ml-[2px] flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="bg-background border border-primary text-primary px-3 py-1 rounded-full text-xs font-mono shadow-[0_0_10px_rgba(0,229,255,0.5)] whitespace-nowrap">
              ◄ SLIDE TO COMPARE ►
            </div>
          </div>
        </div>

        {/* Expanded Archive Toggle */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="btn-ghost w-full"
        >
          {isExpanded ? "HIDE ARCHIVE" : "VIEW EXTENDED DEPLOYED ARCHIVE"}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-8"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { name: "Apex Roofing Co.", prevSpeed: "3.9s", newSpeed: "0.7s", prevConv: "1.8%", newConv: "5.2%" },
                  { name: "Cascade HVAC", prevSpeed: "5.2s", newSpeed: "0.6s", prevConv: "0.9%", newConv: "4.8%" },
                  { name: "Sentinel Law Group", prevSpeed: "4.1s", newSpeed: "0.9s", prevConv: "2.1%", newConv: "7.1%" },
                  { name: "Vanguard Logistics", prevSpeed: "6.0s", newSpeed: "0.8s", prevConv: "1.1%", newConv: "5.5%" },
                ].map((item, i) => (
                  <div key={i} className="bg-card border border-border p-6 rounded flex flex-col justify-between">
                    <h4 className="text-white font-bold text-lg mb-4">{item.name}</h4>
                    <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                      <div>
                        <div className="text-muted-foreground mb-1">PAGE SPEED</div>
                        <div className="flex items-end gap-2">
                          <span className="text-muted-foreground line-through">{item.prevSpeed}</span>
                          <span className="text-primary text-lg leading-none">► {item.newSpeed}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">CONVERSION RATE</div>
                        <div className="flex items-end gap-2">
                          <span className="text-muted-foreground line-through">{item.prevConv}</span>
                          <span className="text-primary text-lg leading-none">► {item.newConv}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
