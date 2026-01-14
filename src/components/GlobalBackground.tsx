"use client";


export default function GlobalBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-900 to-blue-900">
            {/* Animation Styles */}
            <style jsx global>{`
        @keyframes grid-move { 0% { transform: translateY(0); } 100% { transform: translateY(40px); } }
        @keyframes blob-bounce { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }
        .animate-grid { animation: grid-move 3s linear infinite; }
        .animate-blob-1 { animation: blob-bounce 10s infinite ease-in-out; }
        .animate-blob-2 { animation: blob-bounce 15s infinite ease-in-out reverse; }
        .animate-blob-3 { animation: blob-bounce 12s infinite ease-in-out 2s; }
      `}</style>

            {/* Blobs (Đốm sáng) */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[120px] mix-blend-screen animate-blob-1 opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-400/30 rounded-full blur-[120px] mix-blend-screen animate-blob-2 opacity-60"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px] mix-blend-screen animate-blob-3"></div>

            {/* Grid (Lưới) */}
            <div className="absolute inset-0 overflow-hidden opacity-[0.2]">
                <div
                    className="absolute -top-[40px] left-0 right-0 bottom-[-40px] animate-grid"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), 
                              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                ></div>
            </div>
        </div>
    );
}