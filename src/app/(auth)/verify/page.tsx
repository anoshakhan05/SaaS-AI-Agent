'use client';

import { useSearchParams } from 'next/navigation';
import { PlaneTakeoff, Loader2, AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

const errorMessages: Record<string, string> = {
    missing_token: 'No login token found in the link.',
    invalid: 'This link is invalid or has already been used.',
    used: 'This link has already been used. Please request a new one.',
    expired: 'This link has expired. Please request a new one.',
    not_allowed: 'This email address is not authorized.',
};

function VerifyContent() {
    const params = useSearchParams();
    const error = params.get('error');

    if (error) {
        return (
            <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
                <h2 className="text-xl font-semibold text-white">Link invalid</h2>
                <p className="text-slate-400 text-sm">{errorMessages[error] ?? 'An unknown error occurred.'}</p>
                <a
                    href="/login"
                    className="inline-block mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition"
                >
                    Back to login
                </a>
            </div>
        );
    }

    return (
        <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 text-indigo-400 mx-auto animate-spin" />
            <h2 className="text-xl font-semibold text-white">Verifying…</h2>
            <p className="text-slate-400 text-sm">
                Hang tight while we verify your magic link and sign you in.
            </p>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <PlaneTakeoff className="h-8 w-8 text-indigo-400" />
                    <span className="text-2xl font-bold text-white">LeadPilot</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                    <Suspense fallback={
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 text-indigo-400 mx-auto animate-spin" />
                        </div>
                    }>
                        <VerifyContent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
