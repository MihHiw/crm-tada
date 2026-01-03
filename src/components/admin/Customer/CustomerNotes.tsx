export default function CustomerNotes() {
    return (
        <div className="bg-[#161D2F] rounded-[32px] p-6 border border-gray-800 space-y-4">
            <h3 className="font-bold text-white text-sm">Ghi chú mới</h3>
            <div className="relative">
                <textarea
                    placeholder="Nhập ghi chú nhanh..."
                    className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl p-4 text-sm text-white h-24 focus:outline-none focus:border-blue-500 resize-none"
                />
                <button className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all">
                    Lưu
                </button>
            </div>
        </div>
    );
}