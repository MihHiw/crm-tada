"use client";
import { useAuth } from '@/hooks/auth/useAuth';
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0f1a] text-white font-sans">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute inset-0 z-0 opacity-[0.15]">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(#475569 0.5px, transparent 0.5px)',
                    backgroundSize: '24px 24px'
                }}></div>
            </div>

            {/* Tăng max-w từ 420px lên 500px để form to hơn */}
            <div className="relative z-10 w-full max-w-[500px] px-6 py-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="relative w-24 h-24 mb-4 transition-transform hover:scale-110 duration-300">
                        <Image
                            src="/img/logo.png"
                            alt="Tada Logo"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                            priority
                        />
                    </div>
                </div>

                {/* Tăng padding (p-12) và bo góc mạnh hơn */}
                <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-[48px] p-10 md:p-12 shadow-2xl">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold mb-3 text-white">Chào mừng trở lại</h2>
                        <div className="flex flex-col gap-1 mb-4">
                            <code className="text-blue-400 text-sm font-mono bg-blue-500/10 py-1 px-2 rounded-lg inline-block self-center">
                                admin@tada.com || user@tada.com
                            </code>
                        </div>
                        <p className="text-slate-400 text-base">Vui lòng nhập thông tin xác thực.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center animate-in fade-in zoom-in duration-300">
                            {error}
                        </div>
                    )}

                    <form className="space-y-7" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full bg-[#1f2937]/50 border border-white/5 p-4.5 py-4 pl-14 rounded-2xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-base text-white placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#1f2937]/50 border border-white/5 p-4.5 py-4 pl-14 pr-14 rounded-2xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-base text-white placeholder:text-slate-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-4.5 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    XÁC THỰC...
                                </span>
                            ) : (
                                <>ĐĂNG NHẬP <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <span className="relative bg-[#1a2231] px-4 text-xs text-slate-500 uppercase tracking-widest block w-fit mx-auto">Hoặc</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="flex items-center justify-center gap-3 py-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-all text-sm font-medium text-slate-300 active:scale-95">
                            <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} height={20} alt="Google" />
                            Google
                        </button>
                        <button type="button" className="flex items-center justify-center gap-3 py-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-all text-sm font-medium text-slate-300 active:scale-95">
                            <Image src="https://www.svgrepo.com/show/512317/github-142.svg" width={20} height={20} className="invert opacity-80" alt="Github" />
                            GitHub
                        </button>
                    </div>
                </div>

                <p className="text-center mt-10 text-slate-500 text-sm">
                    Chưa có tài khoản?{' '}
                    <Link
                        href="/register"
                        className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors"
                    >
                        Tạo tài khoản mới
                    </Link>
                </p>
            </div>
        </div>
    );
}