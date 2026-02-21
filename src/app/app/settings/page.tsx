'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Settings as SettingsIcon, Bell, Shield, Key } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your workspace, API keys, and notification preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Profile */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle>Profile Details</CardTitle>
                        </div>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue="Anosha Waseem" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" defaultValue="codewithanosha@gmail.com" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6 bg-muted/5">
                        <Button size="sm">Save Changes</Button>
                    </CardFooter>
                </Card>

                {/* Outreach Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <SettingsIcon className="h-5 w-5 text-primary" />
                            <CardTitle>Outreach Controls</CardTitle>
                        </div>
                        <CardDescription>Global limits and safeguards for your outreach.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Daily Sending Cap</Label>
                                <p className="text-xs text-muted-foreground">Max emails to send across all campaigns daily.</p>
                            </div>
                            <div className="w-24">
                                <Input type="number" defaultValue="50" />
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Workdays Only</Label>
                                <p className="text-xs text-muted-foreground">Only send outreach during Monday-Friday.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Thread Replies</Label>
                                <p className="text-xs text-muted-foreground">Continue sequences in the same thread as the first email.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6 bg-muted/5">
                        <Button size="sm">Update Rules</Button>
                    </CardFooter>
                </Card>

                {/* API Keys */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary" />
                            <CardTitle>API Integrations</CardTitle>
                        </div>
                        <CardDescription>Manage your connections to third-party services.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>OpenAI API Key</Label>
                            <Input type="password" value="••••••••••••••••" readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label>Google Search Console / Maps Proxy</Label>
                            <div className="flex gap-2">
                                <Input defaultValue="LP_PROXY_KEY_V1" readOnly className="flex-1" />
                                <Button variant="outline">Rotate Key</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
