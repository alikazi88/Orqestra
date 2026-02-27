import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Palette,
    Image as ImageIcon,
    Link as LinkIcon,
    ExternalLink,
    Check,
    Save,
    Globe,
    AlertCircle,
    Copy,
    Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BrandingConfig {
    hero_image_url: string;
    accent_color: string;
    slug: string;
    theme: string;
}

interface EventBrandingBuilderProps {
    eventId: string;
    initialBranding?: any;
    initialSlug?: string;
}

export const EventBrandingBuilder = ({ eventId, initialBranding, initialSlug }: EventBrandingBuilderProps) => {
    const [config, setConfig] = useState<BrandingConfig>({
        hero_image_url: initialBranding?.hero_image_url || '',
        accent_color: initialBranding?.accent_color || '#7C3AED',
        slug: initialSlug || '',
        theme: initialBranding?.theme || 'modern'
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            const { error } = await (supabase.from('events') as any)
                .update({
                    branding: {
                        hero_image_url: config.hero_image_url,
                        accent_color: config.accent_color,
                        theme: config.theme
                    },
                    slug: config.slug
                })
                .eq('id', eventId);

            if (error) throw error;
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err) {
            console.error('Error saving branding:', err);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const publicUrl = `${window.location.origin}/e/${config.slug}`;

    const copyUrl = () => {
        navigator.clipboard.writeText(publicUrl);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Editor Sidebar */}
            <div className="lg:col-span-5 space-y-6">
                <Card className="p-8 space-y-8 bg-white/50 border-border/40">
                    <div>
                        <h3 className="text-lg font-black tracking-tight mb-2 flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" /> Visual Identity
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Customize the look and feel of your event</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                <LinkIcon className="h-3 w-3" /> Event URL Slug
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">/e/</span>
                                    <input
                                        className="w-full h-12 bg-white border-2 border-border/40 rounded-xl pl-10 pr-4 font-bold outline-none focus:border-primary/40 transition-all"
                                        placeholder="summer-gala-2026"
                                        value={config.slug}
                                        onChange={(e) => setConfig({ ...config, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                <ImageIcon className="h-3 w-3" /> Hero Image URL
                            </label>
                            <input
                                className="w-full h-12 bg-white border-2 border-border/40 rounded-xl px-4 font-bold outline-none focus:border-primary/40 transition-all text-sm"
                                placeholder="https://images.unsplash.com/..."
                                value={config.hero_image_url}
                                onChange={(e) => setConfig({ ...config, hero_image_url: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                <Palette className="h-3 w-3" /> Accent Color
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    className="h-12 w-12 rounded-xl border-2 border-border/40 p-1 cursor-pointer bg-white"
                                    value={config.accent_color}
                                    onChange={(e) => setConfig({ ...config, accent_color: e.target.value })}
                                />
                                <input
                                    className="flex-1 h-12 bg-white border-2 border-border/40 rounded-xl px-4 font-black outline-none focus:border-primary/40 transition-all uppercase text-sm"
                                    value={config.accent_color}
                                    onChange={(e) => setConfig({ ...config, accent_color: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (saveStatus === 'success' ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />)}
                        {saveStatus === 'success' ? 'Branding Saved' : (isSaving ? 'Updating...' : 'Apply Branding')}
                    </Button>
                </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Live Preview Link
                    </h3>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl h-9 text-[10px] uppercase font-black tracking-widest" onClick={copyUrl}>
                            <Copy className="h-3.5 w-3.5 mr-2" /> Copy link
                        </Button>
                        <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="rounded-xl h-9 text-[10px] uppercase font-black tracking-widest">
                                <ExternalLink className="h-3.5 w-3.5 mr-2" /> Visit Page
                            </Button>
                        </a>
                    </div>
                </div>

                <Card className="overflow-hidden bg-slate-100 border-border/40 aspect-video relative group">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* Mock Landing Page Preview */}
                        <div className="w-[90%] h-[90%] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border/20">
                            <div
                                className="h-32 w-full bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${config.hero_image_url || 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1080'})` }}
                            >
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute bottom-4 left-6">
                                    <div className="h-4 w-24 rounded-full mb-2" style={{ backgroundColor: config.accent_color }} />
                                    <div className="h-6 w-48 bg-white/20 rounded-lg" />
                                </div>
                            </div>
                            <div className="flex-1 p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-20 rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
                                        <div className="h-3 w-20 bg-slate-200 rounded" />
                                        <div className="h-4 w-full bg-slate-100 rounded" />
                                    </div>
                                    <div className="h-20 rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
                                        <div className="h-3 w-20 bg-slate-200 rounded" />
                                        <div className="h-4 w-full bg-slate-100 rounded" />
                                    </div>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded" />
                                <div className="h-3 w-2/3 bg-slate-100 rounded" />
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center p-8">
                            <ExternalLink className="h-10 w-10 text-white mx-auto mb-4 opacity-50" />
                            <p className="text-white font-black uppercase tracking-widest text-sm">Interactive Preview</p>
                            <p className="text-white/60 text-xs font-medium mt-1 uppercase tracking-widest">Page updates in real-time as you type</p>
                        </div>
                    </div>
                </Card>

                {!config.slug && (
                    <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 animate-pulse">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-xs font-black uppercase tracking-widest">You must set a unique URL slug before you can share your page.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
