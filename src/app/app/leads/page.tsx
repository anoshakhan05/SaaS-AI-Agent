'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Filter, MoreVertical, ExternalLink, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const mockLeads = [
    { id: '1', company: 'Smile Builderz', domain: 'smilebuilderz.local', email: 'hello@smilebuilderz.local', status: 'QUALIFIED', score: 85, leadTier: 'A' },
    { id: '2', company: 'Bright Dental Care', domain: 'brightdental.local', email: 'info@brightdental.local', status: 'CONTACTED', score: 62, leadTier: 'B' },
    { id: '3', company: 'Pearly Whites', domain: 'pearlywhites.local', email: 'contact@pearlywhites.local', status: 'REPLIED', score: 92, leadTier: 'A' },
    { id: '4', company: 'Dummy Clinic', domain: 'dummy.local', email: null, status: 'NEW', score: 45, leadTier: 'C' },
];

export default function LeadsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLead, setSelectedLead] = useState<any>(null);

    const filteredLeads = mockLeads.filter(lead =>
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                    <p className="text-muted-foreground">Manage and qualify discovered dental clinic leads.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button>Export CSV</Button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-background p-4 rounded-lg border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search leads by clinic name or domain..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Clinic Name</TableHead>
                                <TableHead>Website</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Tier</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeads.map((lead) => (
                                <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedLead(lead)}>
                                    <TableCell className="font-medium">{lead.company}</TableCell>
                                    <TableCell className="text-muted-foreground">{lead.domain}</TableCell>
                                    <TableCell>
                                        <LeadStatusBadge status={lead.status} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 bg-muted rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full ${lead.score >= 80 ? 'bg-green-500' : lead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${lead.score}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium">{lead.score}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={lead.leadTier === 'A' ? 'default' : lead.leadTier === 'B' ? 'secondary' : 'outline'}>
                                            Tier {lead.leadTier}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right whitespace-nowrap">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}>
                                                    Details
                                                </Button>
                                            </SheetTrigger>
                                            <LeadDrawer lead={lead} />
                                        </Sheet>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function LeadStatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'NEW': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
        case 'QUALIFIED': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Qualified</Badge>;
        case 'CONTACTED': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Contacted</Badge>;
        case 'REPLIED': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Replied</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

function LeadDrawer({ lead }: { lead: any }) {
    if (!lead) return null;
    return (
        <SheetContent className="sm:max-w-xl overflow-y-auto">
            <SheetHeader className="border-b pb-6">
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs uppercase tracking-wider">Lead Record</Badge>
                    <LeadStatusBadge status={lead.status} />
                </div>
                <SheetTitle className="text-2xl font-bold">{lead.company}</SheetTitle>
                <SheetDescription className="flex items-center gap-2 mt-1">
                    <ExternalLink className="h-4 w-4" />
                    <a href={`https://${lead.domain}`} target="_blank" className="hover:underline text-primary">{lead.domain}</a>
                </SheetDescription>
            </SheetHeader>

            <div className="py-6 space-y-8">
                <section>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Lead Assessment</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/40 border">
                            <p className="text-xs text-muted-foreground mb-1">AI Score</p>
                            <p className="text-2xl font-bold">{lead.score}/100</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/40 border">
                            <p className="text-xs text-muted-foreground mb-1">Priority Tier</p>
                            <p className="text-2xl font-bold">{lead.leadTier}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Personalization Hooks</h4>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-sm p-3 bg-primary/5 border border-primary/10 rounded-md">
                            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                            <span>"Notice your mobile site takes 4s to load. Most dental patients book on phones."</span>
                        </li>
                        <li className="flex gap-3 text-sm p-3 bg-primary/5 border border-primary/10 rounded-md">
                            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                            <span>"Found that you don't have a 'Book Online' button in the header. You're losing clicks."</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Outreach Activity</h4>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Discovered</p>
                                <p className="text-xs text-muted-foreground">Feb 20, 2026 via Google Places</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Email Sent (Step 1)</p>
                                <p className="text-xs text-muted-foreground">Feb 21, 2026 • Open tracked</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-6 border-t flex gap-3">
                    <Button className="flex-1">Send Custom Email</Button>
                    <Button variant="outline" className="flex-1">Move to Campaign</Button>
                </div>
            </div>
        </SheetContent>
    );
}


