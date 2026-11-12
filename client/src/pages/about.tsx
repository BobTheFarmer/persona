import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="text-3xl font-semibold tracking-tight">About Persona</h1>
      <p className="mt-5 text-muted-foreground leading-relaxed">A campus club finder made by Andy, Colin, Devon, and Garv.</p>
      <section className="mt-8 border-t border-border pt-6" data-testid="section-persona-dna">
        <h2 className="font-semibold">Your Persona DNA</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">Your quiz answers form the DNA chart on your profile and help rank clubs by shared interests.</p>
      </section>
      <section className="mt-8 border-t border-border pt-6" data-testid="section-technicals">
        <h2 className="font-semibold">A few things to know</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">The club list needs updating, so check meeting times with the club. Friends aren’t available yet.</p>
      </section>
    </div>
  );
}
