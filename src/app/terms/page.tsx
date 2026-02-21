import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
    return (
        <div className="container mx-auto max-w-3xl py-12 px-4 md:px-6">
            <Button variant="ghost" asChild className="mb-6 -ml-4">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose prose-sm md:prose-base dark:prose-invert">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing and using LeadPilot, you agree to these Terms of Service.</p>
                <h2>2. Acceptable Use</h2>
                <p>You agree to use this platform in compliance with all relevant anti-spam regulations (CAN-SPAM, GDPR, etc). You must not send emails to users who are on your suppression list.</p>
                <h2>3. Account Responsibilities</h2>
                <p>You are responsible for maintaining the security of your account credentials and integrations.</p>
                <h2>4. Limitation of Liability</h2>
                <p>LeadPilot is provided "as is". We are not responsible for any damages resulting from missing or rejected emails.</p>
            </div>
        </div>
    );
}
