import Link from 'next/link'

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg"></div>
                        <span className="text-xl font-bold text-slate-900">TutorEveryone</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/tutors" className="text-slate-600 hover:text-primary">Find Tutors</Link>
                        <Link href="/pricing" className="text-slate-600 hover:text-primary">Pricing</Link>
                        <Link href="/about" className="text-slate-600 hover:text-primary">About</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-slate-600 hover:text-primary font-medium">Log in</Link>
                        <Link href="/signup" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                        Master any subject with <span className="text-primary">Expert Tutors</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        Connect with verified tutors worldwide. Get free trials, AI-suggested pricing, and secure payments.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link href="/tutors" className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl">
                            Find a Tutor
                        </Link>
                        <Link href="/become-tutor" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-all">
                            Become a Tutor
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Tutors</h3>
                            <p className="text-slate-600">Every tutor passes a strict verification process including ID and qualification checks.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Fair AI Pricing</h3>
                            <p className="text-slate-600">Our AI analyzes market rates to suggest fair prices for both students and tutors.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Escrow</h3>
                            <p className="text-slate-600">Payments are held in escrow and only released when you are satisfied with the session.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
