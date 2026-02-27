import React, { useEffect, useState, useRef } from 'react';
import {
    Play, Info, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../stores/useAuthStore';

import type { UserRole } from './TeamCommandCenter';

interface DispatchMessage {
    id: string;
    content: string;
    type: 'info' | 'alert' | 'ai_insight';
    user_id: string | null;
    created_at: string;
    users?: {
        name: string;
    };
}

export const DispatchFeed = ({ eventId, role = 'director' }: { eventId?: string, role?: UserRole }) => {
    const { workspace, user } = useAuthStore();
    const [messages, setMessages] = useState<DispatchMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (workspace?.id) {
            fetchMessages();
            subscribeToMessages();
        }
    }, [workspace?.id, eventId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        setLoading(true);
        let query = supabase
            .from('dispatch_messages')
            .select('*, users(name)')
            .eq('workspace_id', workspace.id);

        if (eventId) {
            query = query.eq('event_id', eventId);
        }

        const { data, error } = await query
            .order('created_at', { ascending: true })
            .limit(50);

        if (!error && data) {
            setMessages(data as any[]);
        }
        setLoading(false);
    };

    const subscribeToMessages = () => {
        const channel = supabase
            .channel('dispatch_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'dispatch_messages',
                    filter: `workspace_id=eq.${workspace.id}${eventId ? `&event_id=eq.${eventId}` : ''}`
                },
                async (payload) => {
                    // Fetch user info for the new message
                    const { data: userData } = await supabase
                        .from('users')
                        .select('name')
                        .eq('id', payload.new.user_id)
                        .single();

                    const newMessage = {
                        ...payload.new,
                        users: userData
                    } as DispatchMessage;

                    setMessages(prev => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isSending) return;

        setIsSending(true);
        const { error } = await supabase.from('dispatch_messages').insert({
            workspace_id: workspace.id,
            event_id: eventId,
            user_id: user?.id,
            content: inputValue.trim(),
            type: 'info'
        });

        if (!error) {
            setInputValue('');
        }
        setIsSending(false);
    };

    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white opacity-20" />
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a1a] text-white rounded-[2.5rem] p-10 h-full flex flex-col shadow-2xl relative overflow-hidden">
            {/* Decorative Radar effect */}
            <div className="absolute -top-20 -right-20 h-64 w-64 border border-white/5 rounded-full animate-ping opacity-20" />
            <div className="absolute -top-10 -right-10 h-44 w-44 border border-white/10 rounded-full" />

            <div
                ref={scrollRef}
                className="flex-1 space-y-10 relative z-10 overflow-y-auto pr-4 scrollbar-hide"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                        <Info className="h-10 w-10" />
                        <p className="text-xs font-black uppercase tracking-widest">No dispatch activity yet</p>
                    </div>
                )}
                {messages
                    .filter(msg => {
                        if (role === 'vendor' && msg.type === 'ai_insight') return false;
                        return true;
                    })
                    .map((item, i) => (
                        <div key={item.id || i} className="flex gap-6 group">
                            <div className="h-10 w-10 flex-shrink-0 bg-white/10 rounded-xl flex items-center justify-center font-black">
                                {item.users?.name?.[0] || 'A'}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest",
                                        item.type === 'alert' ? 'text-red-400' :
                                            item.type === 'ai_insight' ? 'text-pink-400 italic' :
                                                'text-blue-400'
                                    )}>
                                        {item.users?.name || 'AI Assistant'}
                                    </span>
                                    <span className="text-[9px] font-medium opacity-40 uppercase tracking-widest">
                                        {getTimeAgo(item.created_at)}
                                    </span>
                                </div>
                                <p className="text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity whitespace-pre-wrap">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>

            <form
                onSubmit={handleSendMessage}
                className="mt-10 bg-white/5 rounded-3xl p-2 flex gap-2 border border-white/10"
            >
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter dispatch message..."
                    className="bg-transparent border-none outline-none text-xs font-bold px-4 py-3 flex-1 placeholder:text-white/20 focus:ring-0"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim() || isSending}
                    className={cn(
                        "h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform",
                        inputValue.trim() ? "bg-primary shadow-primary/20 hover:scale-105 active:scale-95" : "bg-white/10 opacity-50 cursor-not-allowed"
                    )}
                >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Play className="h-4 w-4 fill-white text-white" />}
                </button>
            </form>
        </div>
    );
};
