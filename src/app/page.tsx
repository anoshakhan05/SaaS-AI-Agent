import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlaneTakeoff, ShieldCheck, Mail, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center font-bold text-xl" href="/">
          <PlaneTakeoff className="h-6 w-6 text-primary mr-2" />
          <span>LeadPilot</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/app/dashboard">
            Dashboard
          </Link>
          <Button asChild>
            <Link href="/app/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/40 text-center flex flex-col items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  AI-Powered Leads & Cold Email for Dental Clinics
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl p-4">
                  Automatically discover, score, and enroll dental clinics into highly personalized cold email campaigns. Designed exclusively for agencies serving dentists.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" asChild>
                  <Link href="/app/dashboard">
                    Start Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 border-t flex flex-col items-center justify-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">Built for Consistency & Compliance</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Automated Discovery</h3>
                <p className="text-muted-foreground">Find clinics via Google Places, Yelp, or CSV import directly into your workspace.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Sequences</h3>
                <p className="text-muted-foreground">AI scores leads based on their website gaps and drafts personalized multi-step emails.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">100% Compliant</h3>
                <p className="text-muted-foreground">Built-in suppression lists, daily sending caps, and required unsubscribe footers.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2026 LeadPilot by Anosha Waseem. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
