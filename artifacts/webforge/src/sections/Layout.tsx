export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center text-xl font-bold tracking-widest text-white">
          <span className="text-primary mr-2 font-mono">//</span> WEBFORGE
        </a>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#what-we-do" className="hover:text-primary transition-colors">What We Do</a>
          <a href="#process" className="hover:text-primary transition-colors">The Process</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </div>
        
        <div className="hidden md:block">
          <a href="#contact" className="btn-primary py-2 px-4 text-sm">Get Started</a>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-border text-center">
      <div className="container mx-auto px-6">
        <div className="text-2xl font-bold tracking-widest text-white mb-2">
          WEBFORGE
        </div>
        <p className="text-muted-foreground text-sm mb-8">High-performance digital infrastructure for local businesses.</p>
        <div className="font-mono text-xs text-muted-foreground/50">
          // SYSTEM: WEBFORGE_CORE // {new Date().getFullYear()} // ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
}
