'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, TrendingDown, Target, Zap, Mail, MousePointerClick, MessageSquare } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Deep dive into your outreach performance and conversion metrics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Success Rate" value="12.4%" trend="+2.1%" icon={Target} color="text-green-600" />
                <MetricCard title="Avg. Score" value="74/100" trend="+5" icon={Zap} color="text-yellow-600" />
                <MetricCard title="Reply Rate" value="5.8%" trend="-0.4%" icon={MessageSquare} color="text-blue-600" trendDown />
                <MetricCard title="Daily Active" value="120" trend="+12" icon={TrendingUp} color="text-purple-600" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Comparison</CardTitle>
                        <CardDescription>Top performing campaigns by reply rate.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end gap-4 px-6 pb-6">
                        <div className="flex-1 bg-primary/20 rounded-t h-[80%] flex items-center justify-center text-[10px] transform transition-all hover:scale-105">Lahore A</div>
                        <div className="flex-1 bg-primary/40 rounded-t h-[60%] flex items-center justify-center text-[10px] transform transition-all hover:scale-105">Dubai B</div>
                        <div className="flex-1 bg-primary/60 rounded-t h-[95%] flex items-center justify-center text-[10px] transform transition-all hover:scale-105">US Test</div>
                        <div className="flex-1 bg-primary/80 rounded-t h-[40%] flex items-center justify-center text-[10px] transform transition-all hover:scale-105">Implant</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Conversion Funnel</CardTitle>
                        <CardDescription>From discovery to reply.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <FunnelStep label="Discovered" count="2,450" percent="100%" color="bg-blue-500" />
                        <FunnelStep label="Qualified (Tier A/B)" count="1,840" percent="75%" color="bg-cyan-500" />
                        <FunnelStep label="Emails Sent" count="1,200" percent="49%" color="bg-indigo-500" />
                        <FunnelStep label="Opened" count="580" percent="23.6%" color="bg-purple-500" />
                        <FunnelStep label="Replied" count="42" percent="1.7%" color="bg-pink-500" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, icon: Icon, color, trendDown }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center gap-1 mt-1">
                    {trendDown ? <TrendingDown className="h-3 w-3 text-red-500" /> : <TrendingUp className="h-3 w-3 text-green-500" />}
                    <span className={`text-xs ${trendDown ? 'text-red-500' : 'text-green-500'}`}>{trend}</span>
                </div>
            </CardContent>
        </Card>
    );
}

function FunnelStep({ label, count, percent, color }: any) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
                <span>{label}</span>
                <span className="text-muted-foreground">{count} ({percent})</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: percent }} />
            </div>
        </div>
    );
}
