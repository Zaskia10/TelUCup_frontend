import { Suspense } from "react";
import VerifikasiContent from "./VerifikasiContent";

export default function VerifikasiPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#b6252a]" />
            <p className="text-sm font-medium">Memuat halaman verifikasi...</p>
          </div>
        </div>
      }
    >
      <VerifikasiContent />
    </Suspense>
  );
}