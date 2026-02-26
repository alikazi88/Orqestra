import React, { useState } from 'react';
import { AuthLayout } from '../../components/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (authError) throw authError;

            // Verification email sent, UI will handle success state
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join 2,000+ event professionals using Orqestra."
        >
            <form onSubmit={handleSignUp} className="space-y-5">
                <Input
                    label="Full Name"
                    type="text"
                    placeholder="Ali Muhammad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User className="h-5 w-5" />}
                    required
                />
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="h-5 w-5" />}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="h-5 w-5" />}
                    required
                />

                <div className="p-4 bg-muted/50 rounded-2xl text-xs text-muted-foreground leading-relaxed">
                    By signing up, you agree to Orqestra's <span className="text-foreground underline font-semibold">Terms of Service</span> and <span className="text-foreground underline font-semibold">Privacy Policy</span>.
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold gap-2"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                        <>
                            Get Started
                            <ArrowRight className="h-5 w-5" />
                        </>
                    )}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Already have an account?{' '}
                    <button type="button" className="font-bold text-foreground hover:text-primary transition-colors">
                        Sign In
                    </button>
                </p>
            </form>
        </AuthLayout>
    );
};
