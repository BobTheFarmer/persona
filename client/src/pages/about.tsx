import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-12 space-y-10">
      <header>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"><ArrowLeft className="h-4 w-4" /> Back to profile</Link>
        <p className="text-xs uppercase tracking-[0.16em] text-primary mb-3">About the project</p>
        <h1 className="font-serif text-4xl">A starting point for campus life.</h1>
        <p className="text-muted-foreground leading-relaxed mt-5">Persona is a student-built prototype for exploring campus organizations through your interests. It helps narrow a long list of clubs into a few worth investigating.</p>
      </header>
      <section className="border-t border-border pt-6 space-y-3" data-testid="section-persona-dna">
        <h2 className="font-semibold text-xl">What your profile means</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">The introductory quiz turns your preferences into eight trait scores, shown on your profile’s radar chart. These scores help compare your interests with the club catalog. They are not a psychological assessment or a measure of who you are.</p>
        <p className="text-sm text-muted-foreground leading-relaxed">Use match explanations alongside a club’s description. A high score is a suggestion to look closer, not a guarantee of compatibility.</p>
      </section>
      <section className="border-t border-border pt-6 space-y-3" data-testid="section-technicals">
        <h2 className="font-semibold text-xl">What works in this prototype</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">Create an account, complete your profile, browse trait-based club recommendations, and save or skip clubs. The catalog is historical sample data, so always confirm current details with the organization.</p>
        <p className="text-sm text-muted-foreground leading-relaxed">Friend connections are not yet available. Event listings depend on available data. This site is not an official Texas A&amp;M service, and accounts are not university-verified.</p>
      </section>
      <section className="border-t border-border pt-6 space-y-3" data-testid="section-whats-next">
        <h2 className="font-semibold text-xl">Made by students</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">Andy, Colin, Devon, and Garv.</p>
      </section>
    </div>
  );
}
