import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

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
        <p className="text-sm text-muted-foreground mb-4">Texas A&amp;M student clubs</p>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight max-w-2xl">Find your next club.</h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mt-6">Answer six questions, browse clubs that fit your interests, and save your favorites.</p>
        <Button asChild size="lg" className="mt-8" data-testid="button-get-started"><a href="/api/login">Get started</a></Button>
        <div className="mt-16 sm:mt-24 border-t border-border pt-6 grid sm:grid-cols-3 gap-7 text-sm">
          <div><h2 className="font-semibold">Your interests</h2><p className="text-muted-foreground mt-2">A short quiz to start your profile.</p></div>
          <div><h2 className="font-semibold">Club recommendations</h2><p className="text-muted-foreground mt-2">Compare organizations across campus.</p></div>
          <div><h2 className="font-semibold">Saved clubs</h2><p className="text-muted-foreground mt-2">Keep a shortlist to come back to.</p></div>
        </div>
      </main>
      <footer className="border-t border-border"><div className="max-w-5xl mx-auto px-6 py-5 text-xs text-muted-foreground leading-relaxed">Student prototype. Club information may be outdated; confirm details with the organization. Not affiliated with Texas A&amp;M.</div></footer>
    </div>
  );
}
