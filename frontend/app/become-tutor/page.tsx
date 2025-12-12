import Link from 'next/link';

export default function BecomeTutorPage() {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">Share Your Knowledge, Earn Money</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                Join specialized tutors worldwide who are earning significant income by teaching what they love.
            </p>

            <Link
                href="/signup?role=tutor"
                className="inline-block bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
                Start Your Application
            </Link>
        </div>
    );
}
