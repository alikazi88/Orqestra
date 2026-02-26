import React from 'react';
import { Card } from './components/ui/Card';
import { StatCard } from './components/ui/StatCard';
import { Badge } from './components/ui/Badge';
import { Calendar, Ticket, User, MessageSquare, Flame } from 'lucide-react';

export const Dashboard = () => {
    return (
        <div className="flex flex-col gap-8">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Event"
                    value="32"
                    trend={8}
                    icon={<Calendar className="h-full w-full" />}
                />
                <StatCard
                    title="Ticket Sold"
                    value="68"
                    trend={-8}
                    icon={<Ticket className="h-full w-full" />}
                />
                <StatCard
                    title="Upcoming Events"
                    value="28"
                    trend={-8}
                    icon={<Calendar className="h-full w-full" />}
                />
                <StatCard
                    title="Total Attendees"
                    value="1,240"
                    trend={12}
                    icon={<User className="h-full w-full" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Revenue & Activities */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <Card className="h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-lg">Revenue Breakdown</h4>
                            <button className="text-sm text-muted-foreground hover:text-foreground underline">see details</button>
                        </div>
                        <div className="flex-1 flex items-end gap-3 pb-4">
                            {[60, 45, 80, 55, 90, 40, 75, 65, 85, 50, 70, 95].map((height, i) => (
                                <div key={i} className="flex-1 bg-primary/20 rounded-t-full relative group">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-full transition-all duration-500 chart-bar"
                                        style={{ height: `${height}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold">Recent Activities</h4>
                                <button className="text-sm text-muted-foreground hover:text-foreground underline">See Details</button>
                            </div>
                            <div className="flex flex-col gap-6 relative pl-6">
                                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border border-dashed border-l" />

                                <div className="relative">
                                    <div className="absolute -left-[1.65rem] h-3 w-3 rounded-full bg-primary border-4 border-white shadow-sm" />
                                    <p className="text-xs text-muted-foreground mb-1">Mon, Feb 24 | 3:12 PM</p>
                                    <p className="text-sm">John created a new event: <span className="font-bold">Music Fest</span></p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[1.65rem] h-3 w-3 rounded-full bg-accent border-4 border-white shadow-sm" />
                                    <p className="text-xs text-muted-foreground mb-1">Mon, Feb 24 | 3:45 PM</p>
                                    <p className="text-sm">5 attendees requested <span className="font-bold text-accent">refunds</span></p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[1.65rem] h-3 w-3 rounded-full bg-secondary border-4 border-white shadow-sm" />
                                    <p className="text-xs text-muted-foreground mb-1">Mon, Feb 24 | 4:18 PM</p>
                                    <p className="text-sm">12 guests left feedback in <span className="font-bold">ABC concert</span></p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[1.65rem] h-3 w-3 rounded-full bg-red-500 border-4 border-white shadow-sm" />
                                    <p className="text-xs text-muted-foreground mb-1">Mon, Feb 24 | 5:02 PM</p>
                                    <p className="text-sm flex items-center gap-1">2 events are <span className="font-bold text-red-500">over capacity</span> <Flame className="h-3 w-3 text-red-500" /></p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-bold">Upcoming Event</h4>
                                <button className="text-xs bg-muted px-2 py-1 rounded-lg">create event</button>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Card glass className="p-4 shadow-sm border-white/40">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                                            <Flame className="h-6 w-6 text-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold">Future of AI</p>
                                            <p className="text-xs text-muted-foreground">May 5 | 5:00 PM</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <Badge variant="info" className="text-[10px] bg-secondary/5 border border-secondary/10">Berlin, DE</Badge>
                                                <span className="text-xs font-bold">$75/ticket</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card glass className="p-4 shadow-sm border-white/40">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                                            <Calendar className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold">City Jazz Live</p>
                                            <p className="text-xs text-muted-foreground">May 8 | 8:00 PM</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <Badge variant="success" className="text-[10px] bg-primary/5 border border-primary/10">New York, US</Badge>
                                                <span className="text-xs font-bold">$60/ticket</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Column - Top Events & Analytics */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold">Ticket Sales Summary</h4>
                            <button className="text-xs text-muted-foreground underline">See Details</button>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold">382,495</h2>
                            <p className="text-xs text-muted-foreground">Tickets Sold</p>
                        </div>

                        <div className="flex gap-1 bg-muted p-1 rounded-xl mb-6">
                            <button className="flex-1 text-[10px] font-bold bg-white p-2 rounded-lg shadow-sm">Top event</button>
                            <button className="flex-1 text-[10px] font-bold p-2">Ticket Type</button>
                            <button className="flex-1 text-[10px] font-bold p-2">Category</button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {[
                                { name: "Summer Music Fest", loc: "New York City", sales: "2846", progress: 86, color: "bg-primary" },
                                { name: "Startup Pitch Day", loc: "San Francisco", sales: "1475", progress: 64, color: "bg-accent" },
                                { name: "Wellness Expo 2025", loc: "Germany", sales: "1294", progress: 52, color: "bg-secondary" }
                            ].map((event, i) => (
                                <div key={i} className="flex gap-3 items-center">
                                    <div className="h-10 w-10 bg-muted rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/${i + 10}/200)` }} />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold">{event.name}</p>
                                        <p className="text-[10px] text-muted-foreground mb-1">{event.loc} · {event.sales} ticket sold</p>
                                        <div className="h-1.5 w-full bg-muted rounded-full">
                                            <div className={cn("h-full rounded-full", event.color)} style={{ width: `${event.progress}%` }} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground">{event.progress}%</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="flex-1">
                        <h4 className="font-bold mb-6">Ticket Sales Overtime</h4>
                        <div className="flex-1 flex items-end gap-1.5 h-[200px]">
                            {[40, 60, 30, 80, 50, 90, 45, 70].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group h-full">
                                    <div className="absolute bottom-0 left-0 right-0 bg-primary/60 rounded-t-lg" style={{ height: `${h}%` }} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-col gap-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-foreground" /> Total Tickets Sold</span>
                                <span className="font-bold">2,480</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-secondary" /> Total Revenue</span>
                                <span className="font-bold text-lg">$12,560</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary" /> Conversion Rate</span>
                                <span className="font-bold">10.5%</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
