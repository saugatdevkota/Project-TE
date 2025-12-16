export default function Footer() {
    return (
        <footer className="bg-slate-900 py-12 text-slate-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white font-bold text-xl mb-4">TutorEverywhere</h3>
                        <p className="text-sm">The world's leading platform for finding verified tutors.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">For Students</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">Find a Tutor</a></li>
                            <li><a href="#" className="hover:text-white">How it Works</a></li>
                            <li><a href="#" className="hover:text-white">Online Classes</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">For Tutors</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">Become a Tutor</a></li>
                            <li><a href="#" className="hover:text-white">Success Stories</a></li>
                            <li><a href="#" className="hover:text-white">Resources</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">Help Center</a></li>
                            <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
                    &copy; 2024 TutorEverywhere. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
