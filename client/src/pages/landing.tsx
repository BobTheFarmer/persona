import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { RadarChart } from "@/components/radar-chart";
import { ArrowRight } from "lucide-react";

const sampleTraits = {
  novelty: 0.82, intensity: 0.65, cozy: 0.35, strategy: 0.78,
  social: 0.55, creativity: 0.88, nostalgia: 0.42, adventure: 0.91,
};
const steps = [
  { title: "Start with your interests", detail: "Answer six questions about the activities and settings you prefer. There are no right answers." },
  { title: "Compare campus clubs", detail: "Browse recommendations and their match explanations. Save clubs you want to look into; skip those you don’t." },
  { title: "Take a closer look", detail: "Use each organization’s details as a starting point. Confirm current meetings and membership information directly with the club." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <nav aria-label="Main navigation" className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-4">
          <a href="/" className="font-semibold text-2xl tracking-tight" data-testid="text-app-name">Persona<span className="text-primary">.</span></a>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="outline" data-testid="button-login-nav"><a href="/api/login">Sign in</a></Button>
          </div>
        </nav>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-20 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-5">Campus life · Texas A&amp;M</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight max-w-xl">Find a club you’ll want to show up for.</h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mt-6">A quieter way to explore campus. Tell Persona what you enjoy, then find student organizations with reasons to give them a try.</p>
            <Button asChild size="lg" className="mt-8" data-testid="button-get-started"><a href="/api/login">Build your profile <ArrowRight className="ml-3 h-4 w-4" /></a></Button>
            <p className="text-sm text-muted-foreground mt-3">Six questions to get started.</p>
          </div>
          <figure className="border-y border-border py-6">
            <div className="flex justify-between items-baseline gap-4"><h2 className="font-semibold">An interest profile</h2><span className="text-xs text-muted-foreground">Illustrative example</span></div>
            <RadarChart traits={sampleTraits} size={380} className="flex justify-center my-3" />
            <figcaption className="text-sm leading-relaxed text-muted-foreground border-t border-border pt-4">Eight preferences help explain a recommendation. A match score is a starting point, not a promise you’ll like a club.</figcaption>
          </figure>
        </section>

        <section className="border-t border-border" aria-labelledby="how-it-works">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16">
            <div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">Getting started</p><h2 id="how-it-works" className="font-serif text-3xl">From interests<br className="hidden md:block" /> to a shortlist.</h2></div>
            <ol className="divide-y divide-border">
              {steps.map((step, index) => <li key={step.title} className="flex gap-5 py-5 first:pt-0 last:pb-0"><span className="text-sm font-mono text-primary pt-1" aria-hidden="true">0{index + 1}</span><div><h3 className="font-semibold text-lg">{step.title}</h3><p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">{step.detail}</p></div></li>)}
            </ol>
          </div>
        </section>
      </main>
      <footer className="border-t border-border max-w-6xl mx-auto px-5 sm:px-8 py-7 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-12 text-sm">
        <span className="font-semibold shrink-0">Persona · Prototype</span>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">Historical sample catalog, not an official Texas A&amp;M directory. Club details may be out of date. Verify information with the organization before making plans.</p>
      </footer>
    </div>
  );
}
