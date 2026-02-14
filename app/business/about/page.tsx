import Link from 'next/link'
import { ArrowRight, Target, Users2, Lightbulb } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="bg-black text-white">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        About Vouncer
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed">
                        We're building the infrastructure that powers the future of nightlife.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-24 border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-start gap-6 mb-8">
                        <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Target className="w-6 h-6 text-sky-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
                            <p className="text-xl text-zinc-400 leading-relaxed">
                                To digitize nightlife securely and transparently, empowering venues with the tools they need to operate efficiently while delivering exceptional experiences to their guests.
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 md:p-12">
                        <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                            The nightlife industry has been operating with outdated technology for too long. Paper tickets, cash transactions, and manual capacity tracking create friction, enable fraud, and limit growth.
                        </p>
                        <p className="text-lg text-zinc-300 leading-relaxed">
                            We believe venue owners deserve better. Vouncer provides enterprise-grade infrastructure that's simple to use, secure by default, and built specifically for the unique challenges of nightlife operations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Who We Are */}
            <section className="py-24 border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-start gap-6 mb-8">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Users2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Are</h2>
                            <p className="text-xl text-zinc-400 leading-relaxed">
                                A team of nightlife operators and technology experts who understand both sides of the equation.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-3">Nightlife Experience</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                We've worked in venues, managed events, and experienced firsthand the operational challenges that keep owners up at night.
                            </p>
                        </div>

                        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-3">Technical Expertise</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Our engineering team has built systems for millions of users at scale, bringing enterprise reliability to nightlife.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-start gap-6 mb-8">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="border-l-2 border-sky-500 pl-6">
                            <h3 className="text-xl font-bold mb-2">Security First</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Every line of code is written with security in mind. Your data and your customers' data are sacred.
                            </p>
                        </div>

                        <div className="border-l-2 border-emerald-500 pl-6">
                            <h3 className="text-xl font-bold mb-2">Radical Transparency</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                No hidden fees, no surprises. You always know exactly what you're paying for and why.
                            </p>
                        </div>

                        <div className="border-l-2 border-purple-500 pl-6">
                            <h3 className="text-xl font-bold mb-2">Obsessive Support</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                When you have an event, we're on call. Real humans, real-time support, every time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 border-t border-white/10">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Let's build the future together
                    </h2>
                    <p className="text-xl text-zinc-400 mb-8">
                        See how Vouncer can transform your venue operations.
                    </p>
                    <Link
                        href="/business/demo"
                        className="inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-zinc-200 transition-all text-lg"
                    >
                        Book a Demo
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
