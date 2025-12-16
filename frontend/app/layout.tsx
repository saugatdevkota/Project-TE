import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'TutorEveryone - Global Tutoring Marketplace',
    description: 'Find verified tutors, book free trials, and learn anything.',
}

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navbar />
                <main className="min-h-screen bg-slate-50 pt-20 pb-20">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
