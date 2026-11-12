import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="text-3xl font-semibold tracking-tight">About Persona</h1>
      <p className="mt-5 text-muted-foreground leading-relaxed">A campus club finder made by Andy, Colin, Devon, and Garv.</p>
      <section className="mt-8 border-t border-border pt-6" data-testid="section-persona-dna">
        <h2 className="font-semibold">Recommendations</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">Your quiz answers help rank clubs by shared interests. Scores are suggestions, not a personality assessment or a guarantee of fit.</p>
      </section>
      <section className="mt-8 border-t border-border pt-6" data-testid="section-technicals">
        <h2 className="font-semibold">Prototype limitations</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">Club information may be outdated. Confirm meetings and membership details with the organization. Friend connections are unavailable, and event listings depend on available data.</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">Persona is not affiliated with Texas A&amp;M. Accounts are not university-verified.</p>
      </section>
    </div>
  );
}
