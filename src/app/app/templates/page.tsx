'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Mail, Copy, Trash2, Eye } from 'lucide-react';

const initialTemplates = [
    {
        id: '1',
        name: 'Standard Dental Audit',
        type: 'SEQUENCE',
        steps: [
            { subject: 'Quick question about {{company_name}} website', body: 'Hi,\n\nI was looking at {{website_url}} and noticed...' },
            { subject: 'Following up', body: 'Just wanted to make sure you saw my last email about...' }
        ]
    },
    {
        id: '2',
        name: 'Booking Optimization Offer',
        type: 'SEQUENCE',
        steps: [
            { subject: 'Missing booking link on {{company_name}}', body: 'Hi there,\n\nI noticed your site doesn\'t have an online booking link...' }
        ]
    }
];

export default function TemplatesPage() {
    const [templates, setTemplates] = useState(initialTemplates);
    const [editingTemplate, setEditingTemplate] = useState<any>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
                    <p className="text-muted-foreground">Manage your cold email sequences and AI-assisted variables.</p>
                </div>
                <Button onClick={() => setEditingTemplate({ name: '', type: 'SEQUENCE', steps: [{ subject: '', body: '' }] })}>
                    <Plus className="mr-2 h-4 w-4" /> New Template
                </Button>
            </div>

            {!editingTemplate ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <Card key={template.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <Mail className="h-5 w-5 text-primary" />
                                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">
                                        {template.steps.length} {template.steps.length === 1 ? 'step' : 'steps'}
                                    </span>
                                </div>
                                <CardTitle className="mt-2">{template.name}</CardTitle>
                                <CardDescription>Created for dental clinic outreach.</CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto pt-4 flex gap-2 border-t">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditingTemplate(template)}>
                                    Edit
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <TemplateEditor
                    template={editingTemplate}
                    onSave={(t) => {
                        if (t.id) {
                            setTemplates(prev => prev.map(old => old.id === t.id ? t : old));
                        } else {
                            setTemplates(prev => [...prev, { ...t, id: Math.random().toString() }]);
                        }
                        setEditingTemplate(null);
                    }}
                    onCancel={() => setEditingTemplate(null)}
                />
            )}
        </div>
    );
}

function TemplateEditor({ template, onSave, onCancel }: { template: any, onSave: (t: any) => void, onCancel: () => void }) {
    const [data, setData] = useState(template);

    const addStep = () => {
        setData({ ...data, steps: [...data.steps, { subject: '', body: '' }] });
    };

    const updateStep = (index: number, field: string, value: string) => {
        const newSteps = [...data.steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setData({ ...data, steps: newSteps });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{data.id ? 'Edit Template' : 'Create Template'}</CardTitle>
                    <CardDescription>Define your email sequence and dynamic variables.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="t-name">Template Name</Label>
                        <Input
                            id="t-name"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            placeholder="e.g. Website Audit Sequence"
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Sequence Steps</h3>
                            <Button variant="outline" size="sm" onClick={addStep}>
                                <Plus className="mr-2 h-4 w-4" /> Add Step
                            </Button>
                        </div>

                        {data.steps.map((step: any, idx: number) => (
                            <div key={idx} className="p-4 border rounded-lg space-y-4 bg-muted/20 relative">
                                <span className="absolute -left-3 top-4 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    {idx + 1}
                                </span>
                                <div className="space-y-2">
                                    <Label>Subject Line</Label>
                                    <Input
                                        value={step.subject}
                                        onChange={(e) => updateStep(idx, 'subject', e.target.value)}
                                        placeholder="Subject..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Email Body</Label>
                                        <span className="text-[10px] text-muted-foreground">Available: {"{{company_name}}, {{website_url}}, {{city}}, {{personalization_hook}}"}</span>
                                    </div>
                                    <Textarea
                                        rows={6}
                                        value={step.body}
                                        onChange={(e) => updateStep(idx, 'body', e.target.value)}
                                        placeholder="Write your email here..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Eye className="mr-2 h-4 w-4" /> Preview
                        </Button>
                        <Button onClick={() => onSave(data)}>
                            <Save className="mr-2 h-4 w-4" /> Save Template
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
