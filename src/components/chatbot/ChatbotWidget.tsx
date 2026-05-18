"use client";

import { useState } from "react";
import {
  CalendarDays,
  CircleHelp,
  Clock,
  FileText,
  Info,
  MessageCircle,
  Send,
  Settings,
  Stethoscope,
  Ticket,
  User,
  X,
} from "lucide-react";

const menuItems = [
  { title: "Penjelasan hasil", icon: Info },
  { title: "Bantuan Form", icon: FileText },
  { title: "Jadwal & Aturan", icon: CalendarDays },
  { title: "Pendaftaran", icon: Ticket },
  { title: "Dukungan Teknis", icon: Settings },
  { title: "Konsultasi Medis", icon: Stethoscope },
  { title: "FAQ", icon: CircleHelp },
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    // Sementara masih demo. Nanti bisa disambungkan ke backend/AI.
    setMessage("");
  };

  return (
    <>
      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Tutup chatbot overlay"
            className="fixed inset-0 z-[998] cursor-default bg-white/65 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />

          <section className="fixed bottom-5 right-5 z-[999] flex h-[430px] w-[300px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white font-sans shadow-2xl">
            {/* Header */}
            <div className="bg-[#B41F2A] text-white">
              <div className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/25 text-white">
                    <MessageCircle size={18} strokeWidth={2.4} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-extrabold tracking-tight">
                      Smart Assistant
                    </h2>
                    <p className="mt-0.5 truncate text-[11px] font-medium text-red-100">
                      Tel-U Cup Dashboard Support
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="shrink-0 rounded-full p-1 text-white transition hover:bg-white/10"
                  aria-label="Tutup chatbot"
                >
                  <X size={18} strokeWidth={2.4} />
                </button>
              </div>

              <div className="mx-4 mb-3 flex items-center justify-between gap-2 rounded-lg bg-[#9E1721] px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <User size={13} strokeWidth={2.4} className="shrink-0" />
                  <span className="truncate text-xs font-extrabold">
                    Budi Santoso
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="rounded-full bg-[#B41F2A] px-2 py-0.5 text-[9px] font-extrabold text-white">
                    RISIKO TINGGI
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-100">
                    <Clock size={11} strokeWidth={2.4} />
                    14:24
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-white px-4 py-4">
              <div className="mb-4 flex items-start gap-2.5">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-700" />

                <div className="border-l-3 border-[#B41F2A] pl-3">
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                    <p className="text-[12px] font-medium leading-5 text-gray-800">
                      Selamat datang di Dashboard Tel-U Cup. Saya siap membantu
                      Anda. Silakan pilih layanan atau ajukan pertanyaan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pl-7">
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-[#B41F2A] hover:bg-red-50"
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Icon
                          size={15}
                          strokeWidth={2.3}
                          className="shrink-0 text-[#B41F2A]"
                        />

                        <span className="truncate text-[12px] font-extrabold text-gray-800">
                          {item.title}
                        </span>
                      </span>

                      <span className="shrink-0 text-base text-gray-300">
                        ›
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex min-w-0 flex-1 items-center rounded-full border border-gray-200 bg-white px-3.5 py-2.5 shadow-sm">
                  <input
                    type="text"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ketik pesan..."
                    className="min-w-0 flex-1 bg-transparent text-xs text-gray-800 outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="ml-2 shrink-0 text-[#D34A55] transition hover:text-[#B41F2A]"
                    aria-label="Kirim pesan"
                  >
                    <Send size={16} strokeWidth={2.3} />
                  </button>
                </div>

                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:border-[#B41F2A] hover:text-[#B41F2A]"
                  aria-label="Bantuan"
                >
                  <CircleHelp size={18} strokeWidth={2.3} />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[997] flex h-12 w-12 items-center justify-center rounded-full bg-[#B41F2A] text-white shadow-xl transition hover:bg-[#981A24]"
        aria-label="Buka chatbot"
      >
        <MessageCircle size={22} strokeWidth={2.5} />
      </button>
    </>
  );
}