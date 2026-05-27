import { useState, useEffect } from "react";
import { getContingentDetail } from "../services";
import { X, Users, Mail, Loader2, ShieldAlert } from "lucide-react";

interface ContingentDetailDrawerProps {
  contingentId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContingentDetailDrawer({ contingentId, isOpen, onClose }: ContingentDetailDrawerProps) {
  const [detail, setDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && contingentId) {
      fetchDetail();
    } else {
      setDetail(null);
      setError("");
    }
  }, [isOpen, contingentId]);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await getContingentDetail(contingentId!);
      setDetail(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat detail kontingen.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Detail Kontingen</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm">Memuat detail...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex gap-2 items-start">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          ) : detail ? (
            <div className="space-y-8">
              {/* Info Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{detail.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                    <Users size={14} /> {detail.players?.length || 0} Anggota
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded font-medium ${detail.pic ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {detail.pic ? "PIC Aktif" : "Belum ada PIC"}
                  </span>
                </div>
              </div>

              {/* PIC Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Informasi PIC</h4>
                {detail.pic ? (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      {detail.pic.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{detail.pic.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mail size={12} /> {detail.pic.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Belum ada PIC untuk kontingen ini. Tugaskan satu pengguna agar koordinasi tim lebih jelas.</p>
                )}
              </div>

              {/* Members List */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Daftar Anggota / Player</h4>
                {!detail.players || detail.players.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                    <Users size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Belum ada anggota yang terdaftar.</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {detail.players.map((player: any) => (
                      <li key={player.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-gray-400">
                          {player.photo_path ? (
                            <img src={player.photo_path} alt={player.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserAvatar name={player.name} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{player.name}</p>
                          <p className="text-xs text-gray-500 truncate">{player.nim_nip ? `NIM/NIP: ${player.nim_nip}` : "No NIM/NIP"}</p>
                        </div>
                        <div className="shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                            player.verification_status === 'verified' ? 'bg-green-100 text-green-700' : 
                            player.verification_status === 'rejected' ? 'bg-red-100 text-red-700' : 
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {player.verification_status || 'Pending'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function UserAvatar({ name }: { name: string }) {
  return <span className="font-bold text-sm text-gray-600">{name.charAt(0).toUpperCase()}</span>;
}
