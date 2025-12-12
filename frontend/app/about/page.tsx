export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h1>
                <p className="text-xl text-slate-600">
                    We are building the world's most trusted learning network. By connecting students with verified experts, we make quality education accessible to everyone, everywhere.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="bg-slate-200 rounded-2xl h-80"></div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Why TutorEveryone?</h2>
                    <p className="text-slate-600 mb-6">
                        Traditional tutoring is often expensive, geographically limited, and hard to verify. We solve this with:
                    </p>
                    <ul className="space-y-4 text-slate-700">
                        <li className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">✓</span>
                            Global reach with local relevance
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">✓</span>
                            AI-driven matching and pricing
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold">✓</span>
                            Secure, escrow-backed payments
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
