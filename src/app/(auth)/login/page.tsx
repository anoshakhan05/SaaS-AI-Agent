'use client';

import { useState } from 'react';
import { PlaneTakeoff, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('codewithanosha@gmail.com');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await fetch('/api/auth/request-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            // Always show success (don't reveal if email is allowed)
            setSent(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <PlaneTakeoff className="h-8 w-8 text-indigo-400" />
                    <span className="text-2xl font-bold text-white">LeadPilot</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                    {sent ? (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle className="h-12 w-12 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Check your email</h2>
                            <p className="text-slate-400 text-sm">
                                We sent a magic link to <span className="text-white font-medium">{email}</span>.
                                Click it to sign in — it expires in {process.env.NEXT_PUBLIC_MAGICLINK_MINUTES ?? '15'} minutes.
                            </p>
                            <p className="text-slate-500 text-xs">
                                No email? Check your spam folder, or{' '}
                                <button
                                    onClick={() => setSent(false)}
                                    className="text-indigo-400 underline hover:text-indigo-300"
                                >
                                    try again
                                </button>.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-white">Sign in</h1>
                                <p className="text-slate-400 text-sm mt-1">
                                    Enter your admin email to receive a magic link.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-400">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium rounded-lg transition"
                                >
                                    {loading ? 'Sending link…' : (
                                        <>Send magic link <ArrowRight className="h-4 w-4" /></>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    LeadPilot · Admin access only
                </p>
            </div>
        </div>
    );
}
