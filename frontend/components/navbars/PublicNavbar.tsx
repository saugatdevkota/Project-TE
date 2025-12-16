import Link from "next/link";

export default function PublicNavbar() {
    return (
        <div className="hidden md:flex items-center gap-8">
            <Link href="/tutors" className="text-slate-600 hover:text-primary font-medium transition">Find a Tutor</Link>
            <div className="h-4 w-px bg-slate-200"></div>
            <Link href="/register?role=tutor" className="relative overflow-hidden px-6 py-2 rounded-full border border-primary text-primary group font-medium hover:border-transparent">
                <span className="relative z-10 group-hover:text-white transition">Become a Tutor</span>
                <span className="absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></span>
            </Link>
            <Link href="/login" className="text-slate-600 hover:text-primary font-medium transition">Log in</Link>
        </div>
    );
}
