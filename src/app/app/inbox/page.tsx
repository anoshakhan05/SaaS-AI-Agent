'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mail, User, Send, Info, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const mockReplies = [
    { id: '1', from: 'Dr. Sarah Johnson', company: 'Bright Dental Care', subject: 'Re: Quick question about Bright Dental Care website', snippet: 'I am interested in the booking link optimization you mentioned. When can we talk?', date: '2 hours ago', unread: true },
    { id: '2', from: 'Office Manager', company: 'Smile Builderz', subject: 'Re: Missing booking link on Smile Builderz', snippet: 'Thanks for reaching out. We are currently reviewing our SEO strategy.', date: '1 day ago', unread: false },
    { id: '3', from: 'Anwar Hossain', company: 'Pearly Whites', subject: 'Re: Website redesign for Pearly Whites', snippet: 'Could you send over some examples of your previous work with dental clinics?', date: 'Feb 20', unread: false },
];

export default function InboxPage() {
    const [selectedThread, setSelectedThread] = useState<any>(mockReplies[0]);

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
                    <p className="text-muted-foreground">Manage replies from your dental clinic leads.</p>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex gap-6 overflow-hidden">
                {/* Thread List */}
                <div className="w-80 flex flex-col gap-4 shrink-0 overflow-y-auto pr-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search replies..." className="pl-9" />
                    </div>
                    <div className="space-y-2">
                        {mockReplies.map((reply) => (
                            <button
                                key={reply.id}
                                onClick={() => setSelectedThread(reply)}
                                className={`w-full text-left p-4 rounded-lg border transition-colors ${selectedThread?.id === reply.id ? 'bg-primary/5 border-primary' : 'bg-background hover:bg-muted'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-sm font-bold ${reply.unread ? 'text-primary' : ''}`}>
                                        {reply.from}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">{reply.date}</span>
                                </div>
                                <p className="text-xs font-medium truncate mb-1">{reply.company}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">{reply.snippet}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Conversation View */}
                <div className="flex-1 flex flex-col border rounded-xl bg-background overflow-hidden">
                    {selectedThread ? (
                        <>
                            <div className="p-4 border-b flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {selectedThread.from[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold">{selectedThread.from}</h3>
                                        <p className="text-xs text-muted-foreground">{selectedThread.company} • {selectedThread.subject}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">View Lead</Button>
                                    <Button variant="ghost" size="icon"><Info className="h-4 w-4" /></Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div className="flex justify-center">
                                    <Badge variant="secondary" className="text-[10px] uppercase">Original Outreach</Badge>
                                </div>
                                <div className="bg-muted/30 p-4 rounded-lg border border-dashed text-sm italic text-muted-foreground">
                                    Hi Dr. Johnson, I noticed your website is missing a primary CTA...
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 shrink-0 flex items-center justify-center text-primary font-bold text-xs">
                                        {selectedThread.from[0]}
                                    </div>
                                    <div className="max-w-[80%] space-y-2">
                                        <div className="p-4 bg-muted/20 rounded-2xl rounded-tl-none border">
                                            <p className="text-sm">{selectedThread.snippet}</p>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground pl-1">{selectedThread.date}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t bg-muted/5">
                                <div className="relative">
                                    <Textarea
                                        placeholder="Write your reply..."
                                        className="min-h-[100px] pr-12 resize-none"
                                    />
                                    <Button size="icon" className="absolute right-3 bottom-3 h-8 w-8">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                        Lead qualified as Tier A (Score: 85)
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Press Cmd + Enter to send</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <Mail className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                            <h3 className="font-bold">No message selected</h3>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Select a thread from the left to view the conversation and respond to leads.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
