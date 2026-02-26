import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Briefcase, Loader2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';

export const CreateWorkspace = ({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: (ws: any) => void }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthStore();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Create the workspace
            const { data: wsData, error: wsError } = await supabase
                .from('workspaces')
                .insert({ name })
                .select()
                .single();

            if (wsError) throw wsError;

            // 2. Link user to workspace as owner
            const { error: userError } = await supabase
                .from('users')
                .insert({
                    id: user.id,
                    workspace_id: wsData.id,
                    email: user.email!,
                    role: 'workspace_owner'
                });

            if (userError) throw userError;

            onSuccess(wsData);
        } catch (err: any) {
            setError(err.message || 'Failed to create workspace');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
            <Card className="w-full max-w-[480px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Briefcase className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold">New Workspace</h3>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                    <Input
                        label="Workspace Name"
                        placeholder="e.g. Apex Productions"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                    />

                    <div className="p-4 bg-muted/50 rounded-2xl text-xs text-muted-foreground leading-relaxed">
                        A workspace is where your team manages events, vendors, and budgets together. You can invite team members in the next step.
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button variant="outline" type="button" className="flex-1 h-12" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 h-12 font-bold" disabled={loading || !name}>
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
