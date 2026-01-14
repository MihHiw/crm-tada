"use client";
import { ChevronRight, Landmark } from 'lucide-react';

export default function ProductList({ products }: { products: any[] }) {
    return (
        <div className="bg-[#161D2F] rounded-[32px] p-8 border border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg text-white">Lịch sử & Sản phẩm Tín dụng</h3>
                <button className="text-emerald-500 text-xs font-bold hover:bg-emerald-500/10 px-4 py-2 rounded-xl transition-all">
                    Xem báo cáo chi tiết
                </button>
            </div>

            <div className="space-y-4">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-5 bg-[#0B0F1A] rounded-[24px] border border-gray-800/50 hover:border-emerald-500/30 transition-all group cursor-pointer">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-[18px] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    <span className="text-emerald-500">
                                        {/* Hiển thị icon mặc định nếu data icon là text */}
                                        {typeof product.icon === 'string' && product.icon.length > 2 ? <Landmark size={24} /> : product.icon}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{product.name}</p>
                                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{product.category}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-10">
                                <div className="text-right">
                                    <p className="font-bold text-white text-sm">{product.value}</p>
                                    <p className={`text-[10px] font-bold mt-1 ${product.status === 'Warning' ? 'text-red-500' : 'text-emerald-500'
                                        }`}>
                                        {product.profit}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="min-w-[110px] text-right">
                                        <span className={`px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-tighter border ${product.status === 'Active'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {product.statusLabel}
                                        </span>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-700 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-[#0B0F1A] rounded-[24px] border border-dashed border-gray-800">
                        <Landmark size={48} className="text-gray-800 mb-4" />
                        <p className="text-gray-500 text-sm font-medium">Chưa có dữ liệu giao dịch tín dụng</p>
                    </div>
                )}
            </div>
        </div>
    );
}