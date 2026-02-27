import { useState } from 'react';
import {
    Upload, Link2, Copy, Check,
    Image, Video, FileText, Users,
    ExternalLink, Camera, Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface UploadLink {
    id: string;
    label: string;
    type: 'vendor' | 'guest';
    slug: string;
    active: boolean;
    uploads: number;
}

let nextLinkId = 1;

export const ContentCollectionHub = () => {
    const [links, setLinks] = useState<UploadLink[]>([
        { id: '1', label: 'Photographer Delivery', type: 'vendor', slug: 'photo-delivery-abc123', active: true, uploads: 142 },
        { id: '2', label: 'Videographer Delivery', type: 'vendor', slug: 'video-delivery-def456', active: true, uploads: 28 },
        { id: '3', label: 'Guest Photo Upload', type: 'guest', slug: 'guest-photos-ghi789', active: true, uploads: 367 },
        { id: '4', label: 'Décor Team Assets', type: 'vendor', slug: 'decor-assets-jkl012', active: false, uploads: 55 },
    ]);

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const createLink = (type: 'vendor' | 'guest') => {
        const id = String(nextLinkId++);
        const slug = `${type}-upload-${Math.random().toString(36).slice(2, 8)}`;
        setLinks(prev => [...prev, {
            id,
            label: type === 'vendor' ? 'New Vendor Upload' : 'Guest Upload Link',
            type,
            slug,
            active: true,
            uploads: 0,
        }]);
    };

    const copyLink = (slug: string, id: string) => {
        navigator.clipboard.writeText(`https://orqestra.app/upload/${slug}`);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleActive = (id: string) => {
        setLinks(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
    };

    const updateLabel = (id: string, label: string) => {
        setLinks(prev => prev.map(l => l.id === id ? { ...l, label } : l));
    };

    const totalUploads = links.reduce((s, l) => s + l.uploads, 0);
    const vendorLinks = links.filter(l => l.type === 'vendor');
    const guestLinks = links.filter(l => l.type === 'guest');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-accent-blue to-primary rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                        <Upload className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic">Content Hub</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Collect media from vendors & guests</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard icon={Upload} label="Total Uploads" value={totalUploads} />
                <StatCard icon={Image} label="Photos" value={Math.floor(totalUploads * 0.7)} />
                <StatCard icon={Video} label="Videos" value={Math.floor(totalUploads * 0.2)} />
                <StatCard icon={FileText} label="Documents" value={Math.floor(totalUploads * 0.1)} />
            </div>

            {/* Vendor Links */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Camera className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Vendor Upload Links</h3>
                    </div>
                    <button
                        onClick={() => createLink('vendor')}
                        className="h-8 px-4 bg-[#1a1a1a] text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform"
                    >
                        <Link2 className="h-2.5 w-2.5" /> Create Link
                    </button>
                </div>

                {vendorLinks.map(link => (
                    <LinkCard key={link.id} link={link} copiedId={copiedId} onCopy={copyLink} onToggle={toggleActive} onUpdateLabel={updateLabel} />
                ))}
            </div>

            {/* Guest Links */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Guest Upload Links</h3>
                    </div>
                    <button
                        onClick={() => createLink('guest')}
                        className="h-8 px-4 bg-[#1a1a1a] text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform"
                    >
                        <Link2 className="h-2.5 w-2.5" /> Create Link
                    </button>
                </div>

                {guestLinks.map(link => (
                    <LinkCard key={link.id} link={link} copiedId={copiedId} onCopy={copyLink} onToggle={toggleActive} onUpdateLabel={updateLabel} />
                ))}

                {guestLinks.length === 0 && (
                    <div className="intelly-card p-8 text-center opacity-40">
                        <Users className="h-8 w-8 mx-auto mb-3 opacity-30" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Create a shareable link for guests to upload photos</p>
                    </div>
                )}
            </div>

            {/* How it works */}
            <div className="intelly-card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest">How It Works</h3>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { step: '1', title: 'Create a Link', desc: 'Generate a unique upload link for each vendor or guest group' },
                        { step: '2', title: 'Share It', desc: 'Copy the link and share via WhatsApp, email, or embed in your event page' },
                        { step: '3', title: 'Collect Media', desc: 'All uploads land here, organized by source — ready for your social calendar' },
                    ].map(s => (
                        <div key={s.step} className="text-center">
                            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center mx-auto mb-3">{s.step}</div>
                            <h4 className="text-xs font-black uppercase tracking-tight mb-1">{s.title}</h4>
                            <p className="text-[10px] font-medium text-muted-foreground">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* Sub-components */

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number }) => (
    <div className="intelly-card p-5">
        <div className="flex items-center gap-2 mb-1">
            <Icon className="h-3.5 w-3.5 text-primary opacity-50" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{label}</span>
        </div>
        <span className="text-2xl font-black tracking-tighter italic">{value.toLocaleString()}</span>
    </div>
);

const LinkCard = ({ link, copiedId, onCopy, onToggle, onUpdateLabel }: {
    link: UploadLink;
    copiedId: string | null;
    onCopy: (slug: string, id: string) => void;
    onToggle: (id: string) => void;
    onUpdateLabel: (id: string, label: string) => void;
}) => (
    <div className={cn("intelly-card p-5 flex items-center gap-5 transition-opacity", !link.active && "opacity-50")}>
        <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0",
            link.type === 'vendor' ? "bg-accent-blue/10" : "bg-accent-green/10"
        )}>
            {link.type === 'vendor' ? <Camera className="h-4 w-4 text-accent-blue" /> : <Users className="h-4 w-4 text-accent-green" />}
        </div>

        <div className="flex-1 min-w-0">
            <input
                value={link.label}
                onChange={(e) => onUpdateLabel(link.id, e.target.value)}
                className="text-sm font-black tracking-tight bg-transparent focus:outline-none focus:bg-muted/30 rounded px-1 w-full"
            />
            <div className="flex items-center gap-2 mt-1">
                <code className="text-[9px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">orqestra.app/upload/{link.slug}</code>
                <span className="text-[9px] font-bold text-muted-foreground">{link.uploads} uploads</span>
            </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
            <button
                onClick={() => onCopy(link.slug, link.id)}
                className="h-8 w-8 rounded-lg flex items-center justify-center border border-border/10 hover:bg-muted/50 transition-colors"
                title="Copy link"
            >
                {copiedId === link.id ? <Check className="h-3 w-3 text-accent-green" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
            </button>
            <button
                className="h-8 w-8 rounded-lg flex items-center justify-center border border-border/10 hover:bg-muted/50 transition-colors"
                title="Open link"
            >
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </button>
            <button
                onClick={() => onToggle(link.id)}
                className={cn(
                    "h-6 w-10 rounded-full transition-colors relative",
                    link.active ? "bg-accent-green" : "bg-muted"
                )}
            >
                <div className={cn(
                    "h-4 w-4 rounded-full bg-white shadow-sm absolute top-1 transition-all",
                    link.active ? "left-5" : "left-1"
                )} />
            </button>
        </div>
    </div>
);
