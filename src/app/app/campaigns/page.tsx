'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, MoreHorizontal, Play, Pause, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const mockCampaigns = [
    { id: '1', name: 'Lahore Dentist Outreach', status: 'ACTIVE', leads: 45, sent: 120, replies: 8, createdAt: '2026-02-15' },
    { id: '2', name: 'Dubai Implant Clinics', status: 'PAUSED', leads: 82, sent: 340, replies: 15, createdAt: '2026-02-10' },
    { id: '3', name: 'US Orthodontics Test', status: 'DRAFT', leads: 12, sent: 0, replies: 0, createdAt: '2026-02-20' },
];

export default function CampaignsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
                    <p className="text-muted-foreground">Manage your outreach campaigns and monitor performance.</p>
                </div>
                <Button asChild>
                    <Link href="/app/campaigns/new">
                        <Plus className="mr-2 h-4 w-4" /> New Campaign
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Campaigns</CardTitle>
                    <CardDescription>A list of all campaigns in your workspace.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Leads</TableHead>
                                <TableHead>Sent</TableHead>
                                <TableHead>Replies</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockCampaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/app/campaigns/${campaign.id}`} className="hover:underline">
                                            {campaign.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {campaign.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{campaign.leads}</TableCell>
                                    <TableCell>{campaign.sent}</TableCell>
                                    <TableCell>{campaign.replies}</TableCell>
                                    <TableCell>{campaign.createdAt}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/app/campaigns/${campaign.id}`}>View Details</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {campaign.status === 'ACTIVE' ? (
                                                    <DropdownMenuItem className="text-yellow-600">
                                                        <Pause className="mr-2 h-4 w-4" /> Pause
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem className="text-green-600">
                                                        <Play className="mr-2 h-4 w-4" /> Start
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
