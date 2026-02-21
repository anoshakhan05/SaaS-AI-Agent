import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-3xl py-12 px-4 md:px-6">
            <Button variant="ghost" asChild className="mb-6 -ml-4">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose prose-sm md:prose-base dark:prose-invert">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2>1. Information We Collect</h2>
                <p>We may collect personal information such as your name, email address, and other details when you register for a LeadPilot account.</p>
                <h2>2. How We Use Your Information</h2>
                <p>We use the data collected to provide our services, maintain our application, and improve our outreach tools.</p>
                <h2>3. Third-Party Integrations</h2>
                <p>Our platform integrates with Gmail API and OpenAI API. Your data may be processed by these sub-processors to provide functionality like email sending and lead scoring.</p>
                <h2>4. Data Retention</h2>
                <p>You can request to delete your workspace at any time, which will remove all related campaign and lead data.</p>
            </div>
        </div>
    );
}
