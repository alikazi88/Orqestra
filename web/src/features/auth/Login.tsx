import React, { useState } from 'react';
import { AuthLayout } from '../../components/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Redirect or update store will happen via Auth listener in App.tsx
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your details to manage your event workspace."
        >
            <form onSubmit={handleLogin} className="space-y-5">
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="h-5 w-5" />}
                    required
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary ring-offset-background transition-all" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground">Remember me</span>
                    </label>
                    <button type="button" className="text-sm font-semibold text-primary hover:underline">
                        Forgot password?
                    </button>
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
                </Button>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground font-semibold">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button" className="h-12 gap-2">
                        <img src="https://www.google.com/favicon.ico" className="h-4 w-4" alt="Google" />
                        Google
                    </Button>
                    <Button variant="outline" type="button" className="h-12 gap-2">
                        <img src="https://www.apple.com/favicon.ico" className="h-4 w-4" alt="Apple" />
                        Apple
                    </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Don't have an account?{' '}
                    <button type="button" className="font-bold text-foreground hover:text-primary transition-colors">
                        Create an account
                    </button>
                </p>
            </form>
        </AuthLayout>
    );
};
