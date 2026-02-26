import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
    Mail,
    Trash2,
    Plus,
    Loader2,
    PartyPopper
} from 'lucide-react';

interface TeamInviteProps {
    onComplete: (data: any) => void;
    onBack: () => void;
}

export const TeamInvite = ({ onComplete, onBack }: TeamInviteProps) => {
    const [emails, setEmails] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);

    const addEmail = () => setEmails([...emails, '']);
    const updateEmail = (index: number, val: string) => {
        const newEmails = [...emails];
        newEmails[index] = val;
        setEmails(newEmails);
    };
    const removeEmail = (index: number) => setEmails(emails.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Real implementation would send actual invites via Edge Function
        setTimeout(() => {
            onComplete({ invitedEmails: emails.filter(e => e.trim()) });
            setLoading(false);
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {emails.map((email, index) => (
                    <div key={index} className="flex gap-3 group animate-in slide-in-from-left-2 duration-200">
                        <Input
                            type="email"
                            placeholder="team@example.com"
                            value={email}
                            onChange={(e) => updateEmail(index, e.target.value)}
                            icon={<Mail className="h-5 w-5" />}
                            className="flex-1"
                        />
                        {emails.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeEmail(index)}
                                className="h-12 w-12 rounded-2xl bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center shrink-0"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addEmail}
                className="flex items-center gap-2 text-sm font-bold text-primary hover:underline ml-1"
            >
                <Plus className="h-4 w-4" />
                Add another team member
            </button>

            <div className="p-6 bg-primary rounded-[32px] text-white flex items-center gap-6 shadow-xl shadow-primary/20">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <PartyPopper className="h-6 w-6" />
                </div>
                <div>
                    <p className="font-bold">You're almost there!</p>
                    <p className="text-white/80 text-sm">Once you finish, we'll setup your command center and invite your team.</p>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="outline" type="button" className="flex-1 h-14" onClick={onBack}>
                    Back
                </Button>
                <Button type="submit" className="flex-2 h-14 font-bold" disabled={loading}>
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Complete Setup & Launch'}
                </Button>
            </div>
        </form>
    );
};
