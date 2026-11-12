import { Button } from "@/components/ui/button";
import { RadarChart } from "@/components/radar-chart";
import { ThemeToggle } from "@/components/theme-toggle";

const sampleTraits = {
  novelty: 0.82, intensity: 0.65, cozy: 0.35, strategy: 0.78,
  social: 0.55, creativity: 0.88, nostalgia: 0.42, adventure: 0.91,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <nav aria-label="Main navigation" className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <a href="/" className="font-semibold text-xl tracking-tight" data-testid="text-app-name">Persona</a>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" data-testid="button-login-nav"><a href="/api/login">Sign in</a></Button>
          </div>
        </nav>
      </header>
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-16 sm:py-28">
        <section className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
        <p className="text-sm text-muted-foreground mb-4">Texas A&amp;M student clubs</p>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight max-w-2xl">Find your next club.</h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mt-6">Answer six questions, browse clubs that fit your interests, and save your favorites.</p>
        <Button asChild size="lg" className="mt-8" data-testid="button-get-started"><a href="/api/login">Get started</a></Button>
        </div>
        <figure aria-label="Example Persona DNA chart" className="min-w-0" data-testid="landing-dna-chart">
          <RadarChart traits={sampleTraits} size={380} className="flex justify-center" />

        </figure>
        </section>
        <div className="mt-16 sm:mt-24 border-t border-border pt-6 grid sm:grid-cols-3 gap-7 text-sm">
          <div><h2 className="font-semibold">Your interests</h2><p className="text-muted-foreground mt-2">A short quiz to build your Persona DNA.</p></div>
          <div><h2 className="font-semibold">Club recommendations</h2><p className="text-muted-foreground mt-2">Compare organizations across campus.</p></div>
          <div><h2 className="font-semibold">Saved clubs</h2><p className="text-muted-foreground mt-2">Keep a shortlist to come back to.</p></div>
        </div>
      </main>
    </div>
  );
}
