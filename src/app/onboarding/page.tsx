'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock save delay
        setTimeout(() => {
            router.push('/app/dashboard');
        }, 1000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Workspace Onboarding</CardTitle>
                    <CardDescription>
                        Configure your sender identity and compliance settings before starting.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Gmail Connection</Label>
                            <div className="flex items-center gap-4">
                                <Button variant="outline" type="button" className="w-full">
                                    Connect Google Account
                                </Button>
                                <div className="text-sm text-muted-foreground w-full">Pending setup...</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dailyCap">Daily Send Cap</Label>
                                <Input id="dailyCap" type="number" defaultValue="30" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Input id="timezone" defaultValue="Asia/Karachi" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unsubscribe">Unsubscribe Footer (Required)</Label>
                            <Input
                                id="unsubscribe"
                                defaultValue="If you'd prefer I don't reach out again, reply 'unsubscribe' and I won't contact you further."
                            />
                            <p className="text-xs text-muted-foreground">Will be appended to all outgoing emails.</p>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Saving..." : "Save & Continue to Dashboard"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
