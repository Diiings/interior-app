import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-[80vh]">
      <div className="flex flex-col items-center gap-3">
        {/* Ikon Berputar */}
        <Loader2 size={48} className="text-yellow-500 animate-spin" />
        
        {/* Teks Kedip-kedip */}
        <p className="text-slate-400 text-sm font-medium animate-pulse">
          Memuat Data...
        </p>
      </div>
    </div>
  );
}