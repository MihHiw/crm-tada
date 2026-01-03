export default function ProductList({ products }: { products: any[] }) {
    return (
        <div className="bg-[#161D2F] rounded-[32px] p-8 border border-gray-800">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg">Sản phẩm đang sử dụng</h3>
                <button className="text-blue-500 text-sm font-bold hover:underline transition-all">Xem tất cả</button>
            </div>

            <div className="space-y-4">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-5 bg-[#0B0F1A] rounded-[24px] border border-gray-800/50 hover:border-gray-700 transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-[18px] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    {product.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{product.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-12">
                                <div className="text-right">
                                    <p className="font-bold text-white">{product.value}</p>
                                    <p className={`text-[11px] font-bold mt-1 ${product.status === 'Warning' ? 'text-red-500' : 'text-green-500'}`}>
                                        {product.profit}
                                    </p>
                                </div>
                                <div className="min-w-[120px] text-right">
                                    <span className={`px-4 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${product.status === 'Active'
                                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                        {product.statusLabel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-10">Chưa có sản phẩm nào.</p>
                )}
            </div>
        </div>
    );
}