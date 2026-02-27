import { useState } from 'react';
import {
    Calendar, Plus, ChevronLeft, ChevronRight,
    Instagram, Camera, MessageSquare,
    Check, Clock, Trash2
} from 'lucide-react';
import { cn } from '../../utils/cn';

type PostPhase = 'pre' | 'during' | 'post';
type PostStatus = 'draft' | 'scheduled' | 'published';

interface SocialPost {
    id: string;
    phase: PostPhase;
    date: string;
    platform: string;
    caption: string;
    status: PostStatus;
    type: string;
}

const PHASE_CONFIG = {
    pre: { label: 'Pre-Event', color: 'bg-accent-blue/10 text-accent-blue', accent: 'accent-blue' },
    during: { label: 'Event Day', color: 'bg-accent-pink/10 text-accent-pink', accent: 'accent-pink' },
    post: { label: 'Post-Event', color: 'bg-accent-green/10 text-accent-green', accent: 'accent-green' },
};

const STATUS_ICONS: Record<PostStatus, any> = {
    draft: Clock,
    scheduled: Calendar,
    published: Check,
};

const CONTENT_TYPES = [
    'Teaser', 'Announcement', 'Behind-the-scenes',
    'Countdown', 'Live Story', 'Photo Dump',
    'Recap Reel', 'Thank You', 'Highlights'
];

let nextId = 100;

export const SocialMediaCalendar = () => {
    const [posts, setPosts] = useState<SocialPost[]>([
        { id: '1', phase: 'pre', date: 'D-14', platform: 'Instagram', caption: 'Save the date! ✨ Something magical is coming...', status: 'published', type: 'Teaser' },
        { id: '2', phase: 'pre', date: 'D-7', platform: 'Instagram', caption: 'One week to go! Here\'s a sneak peek at the venue 🏛️', status: 'scheduled', type: 'Behind-the-scenes' },
        { id: '3', phase: 'pre', date: 'D-3', platform: 'Instagram', caption: '3 days! The decor is shaping up beautifully 🌿', status: 'draft', type: 'Countdown' },
        { id: '4', phase: 'during', date: 'D-Day', platform: 'Instagram Story', caption: 'We\'re LIVE! Follow along for real-time updates 📸', status: 'draft', type: 'Live Story' },
        { id: '5', phase: 'during', date: 'D-Day', platform: 'Instagram', caption: 'The moment everyone\'s been waiting for...', status: 'draft', type: 'Announcement' },
        { id: '6', phase: 'post', date: 'D+1', platform: 'Instagram', caption: 'What. A. Night. 🔥 Photo dump incoming!', status: 'draft', type: 'Photo Dump' },
        { id: '7', phase: 'post', date: 'D+3', platform: 'Instagram Reel', caption: '✨ The official event recap is here! Thank you to everyone...', status: 'draft', type: 'Recap Reel' },
        { id: '8', phase: 'post', date: 'D+7', platform: 'Instagram', caption: 'Thank you to our incredible sponsors and vendors 🙏', status: 'draft', type: 'Thank You' },
    ]);

    const [activePhase, setActivePhase] = useState<PostPhase | 'all'>('all');

    const addPost = (phase: PostPhase) => {
        const newPost: SocialPost = {
            id: String(nextId++),
            phase,
            date: phase === 'pre' ? 'D-1' : phase === 'during' ? 'D-Day' : 'D+1',
            platform: 'Instagram',
            caption: '',
            status: 'draft',
            type: 'Announcement',
        };
        setPosts(prev => [...prev, newPost]);
    };

    const deletePost = (id: string) => {
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const updatePost = (id: string, field: keyof SocialPost, value: string) => {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const filteredPosts = activePhase === 'all' ? posts : posts.filter(p => p.phase === activePhase);
    const phases: PostPhase[] = ['pre', 'during', 'post'];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                        <Instagram className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic">Social Calendar</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Pre · During · Post Event Content</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="intelly-card p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-1">Total Posts</span>
                    <span className="text-2xl font-black tracking-tighter italic">{posts.length}</span>
                </div>
                <div className="intelly-card p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-1">Published</span>
                    <span className="text-2xl font-black tracking-tighter italic text-accent-green">{posts.filter(p => p.status === 'published').length}</span>
                </div>
                <div className="intelly-card p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-1">Scheduled</span>
                    <span className="text-2xl font-black tracking-tighter italic text-accent-blue">{posts.filter(p => p.status === 'scheduled').length}</span>
                </div>
                <div className="intelly-card p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-1">Drafts</span>
                    <span className="text-2xl font-black tracking-tighter italic text-muted-foreground">{posts.filter(p => p.status === 'draft').length}</span>
                </div>
            </div>

            {/* Phase Filter + Timeline */}
            <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border/5 w-fit">
                <button
                    onClick={() => setActivePhase('all')}
                    className={cn(
                        "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        activePhase === 'all' ? "bg-white shadow-sm text-[#1a1a1a]" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    All ({posts.length})
                </button>
                {phases.map(ph => (
                    <button
                        key={ph}
                        onClick={() => setActivePhase(ph)}
                        className={cn(
                            "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            activePhase === ph ? `bg-${PHASE_CONFIG[ph].accent}/20 text-${PHASE_CONFIG[ph].accent} shadow-sm` : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {activePhase === ph ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3 opacity-0" />}
                        {PHASE_CONFIG[ph].label} ({posts.filter(p => p.phase === ph).length})
                    </button>
                ))}
            </div>

            {/* Timeline View */}
            {phases.filter(ph => activePhase === 'all' || activePhase === ph).map(phase => {
                const phasePosts = filteredPosts.filter(p => p.phase === phase);
                if (phasePosts.length === 0 && activePhase !== 'all' && activePhase !== phase) return null;
                const cfg = PHASE_CONFIG[phase];

                return (
                    <div key={phase} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn("h-3 w-3 rounded-full", cfg.color.replace('/10', ''))} />
                                <h3 className="text-sm font-black uppercase tracking-widest">{cfg.label}</h3>
                            </div>
                            <button
                                onClick={() => addPost(phase)}
                                className="h-8 px-4 bg-[#1a1a1a] text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform"
                            >
                                <Plus className="h-2.5 w-2.5" /> Add
                            </button>
                        </div>

                        {phasePosts.map(post => {
                            const StatusIcon = STATUS_ICONS[post.status];
                            return (
                                <div key={post.id} className="intelly-card p-5 flex items-start gap-5 group">
                                    {/* Date */}
                                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black", cfg.color)}>
                                        {post.date}
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={post.type}
                                                onChange={(e) => updatePost(post.id, 'type', e.target.value)}
                                                className="text-[9px] font-black uppercase tracking-widest bg-muted/50 rounded-lg px-2 py-1 border-0 focus:ring-1 focus:ring-primary/20"
                                            >
                                                {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                            <span className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
                                                {post.platform === 'Instagram Story' ? <Camera className="h-2.5 w-2.5" /> : <Instagram className="h-2.5 w-2.5" />}
                                                {post.platform}
                                            </span>
                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1",
                                                post.status === 'published' ? "bg-accent-green/10 text-accent-green" :
                                                    post.status === 'scheduled' ? "bg-accent-blue/10 text-accent-blue" :
                                                        "bg-muted text-muted-foreground"
                                            )}>
                                                <StatusIcon className="h-2 w-2" /> {post.status}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <MessageSquare className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
                                            <input
                                                value={post.caption}
                                                onChange={(e) => updatePost(post.id, 'caption', e.target.value)}
                                                placeholder="Write your caption..."
                                                className="text-xs font-medium w-full bg-transparent focus:outline-none focus:bg-muted/30 rounded px-1 py-0.5 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            );
                        })}

                        {phasePosts.length === 0 && (
                            <div className="intelly-card p-8 text-center opacity-40">
                                <p className="text-[10px] font-black uppercase tracking-widest">No {cfg.label.toLowerCase()} posts yet</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
