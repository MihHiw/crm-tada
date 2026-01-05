import { Home, PieChart, Plus, User as UserIcon, Wallet } from 'lucide-react';
import Link from 'next/link'; //

export default function Footer() {
    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-8 py-4 flex justify-between items-center z-50">
            <Link href="/app">
                <button className="text-blue-600 hover:scale-110 transition-transform">
                    <Home size={24} />
                </button>
            </Link>

            <button className="text-slate-400 hover:text-blue-600 transition-colors"><Wallet size={24} /></button>

            <div className="relative -top-8">
                <button className="bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-500/40 border-4 border-slate-50 text-white active:scale-90 transition-transform">
                    <Plus size={24} />
                </button>
            </div>

            <button className="text-slate-400 hover:text-blue-600 transition-colors"><PieChart size={24} /></button>

            <Link href="/app/profile">
                <button className="text-slate-400 hover:text-blue-600 transition-all active:scale-90">
                    <UserIcon size={24} />
                </button>
            </Link>
        </nav>
    );
}