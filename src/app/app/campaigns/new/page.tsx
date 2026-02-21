'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewCampaignPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock save
        setTimeout(() => {
            router.push('/app/campaigns');
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/app/campaigns">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">New Campaign</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Details</CardTitle>
                        <CardDescription>Configure the basic information for your new campaign.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Campaign Name</Label>
                            <Input id="name" placeholder="e.g. Islamabad Dentists Week 1" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="source">Lead Source</Label>
                            <Select defaultValue="google">
                                <SelectTrigger>
                                    <Value placeholder="Select a source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="google">Google Places API</SelectItem>
                                    <SelectItem value="yelp">Yelp Fusion API</SelectItem>
                                    <SelectItem value="csv">CSV Import</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="query">Search Query</Label>
                            <Input id="query" placeholder="e.g. Dentists in Islamabad" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Internal Description (Optional)</Label>
                            <Textarea id="description" placeholder="Notes about this campaign..." />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-6">
                        <Button variant="outline" asChild>
                            <Link href="/app/campaigns">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={loading}>
                            <Save className="mr-2 h-4 w-4" /> {loading ? 'Creating...' : 'Create Campaign'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}

function Value({ placeholder }: { placeholder: string }) {
    return <SelectValue placeholder={placeholder} />;
}
