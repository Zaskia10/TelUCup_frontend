"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Clock,
  Download,
  Filter,
  Search,
  Stethoscope,
  UserCheck,
  Users,
  X,
} from "lucide-react";

type RiskStatus = "HIGH" | "MEDIUM" | "LOW" | "N/A";
type EligibilityStatus = "CLEARED" | "PENDING" | "DENY";

type Player = {
  no: number;
  name: string;
  id: string;
  faculty: string;
  category: string;
  assessmentDate: string;
  risk: RiskStatus;
  presence: boolean;
  eligibility: EligibilityStatus;
  photo: string;
};

type ActivityLog = {
  time: string;
  actor: string;
  text: string;
  active?: boolean;
};

const initialPlayers: Player[] = [
  {
    no: 1,
    name: "Ahmad Zulkarnain",
    id: "1301204055",
    faculty: "Fakultas Informatika",
    category: "Bulutangkis Ganda Putra",
    assessmentDate: "12 Okt 2023",
    risk: "HIGH",
    presence: true,
    eligibility: "PENDING",
    photo: "AZ",
  },
  {
    no: 2,
    name: "Siti Rahmawati",
    id: "1402213042",
    faculty: "Fakultas Ekonomi Bisnis",
    category: "Futsal Putri",
    assessmentDate: "12 Okt 2023",
    risk: "LOW",
    presence: false,
    eligibility: "PENDING",
    photo: "SR",
  },
  {
    no: 3,
    name: "Budi Santoso",
    id: "1103190021",
    faculty: "Fakultas Teknik Elektro",
    category: "Basket Putra",
    assessmentDate: "11 Okt 2023",
    risk: "MEDIUM",
    presence: true,
    eligibility: "PENDING",
    photo: "BS",
  },
  {
    no: 4,
    name: "Dewi Lestari",
    id: "1201184210",
    faculty: "Fakultas Industri Kreatif",
    category: "Tenis Meja",
    assessmentDate: "13 Okt 2023",
    risk: "N/A",
    presence: false,
    eligibility: "PENDING",
    photo: "DL",
  },
  {
    no: 5,
    name: "Rian Hidayat",
    id: "1302201099",
    faculty: "Fakultas Informatika",
    category: "E-Sport - Mobile Legends",
    assessmentDate: "12 Okt 2023",
    risk: "LOW",
    presence: true,
    eligibility: "CLEARED",
    photo: "RH",
  },
];

const initialLogs: ActivityLog[] = [
  {
    time: "09:15",
    actor: "Admin Lapangan 1",
    text: "Presensi dicatat: Ahmad Zulkarnain",
    active: true,
  },
  {
    time: "09:10",
    actor: "Panitia Medis",
    text: "Medical Review diminta: Budi Santoso",
  },
  {
    time: "08:55",
    actor: "Dr. Sarah",
    text: "Status 'Cleared' diberikan: Rian Hidayat",
  },
  {
    time: "08:40",
    actor: "Super Admin",
    text: "Export Laporan CSV - Batch 1",
  },
  {
    time: "08:15",
    actor: "System",
    text: "Pemain Baru Terdaftar: Dewi Lestari",
  },
];

export default function VerifikasiLapanganPage() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [showAllLogs, setShowAllLogs] = useState(false);

  const faculties = useMemo(() => {
    return ["ALL", ...Array.from(new Set(players.map((player) => player.faculty)))];
  }, [players]);

  const categories = useMemo(() => {
    return ["ALL", ...Array.from(new Set(players.map((player) => player.category)))];
  }, [players]);

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        player.name.toLowerCase().includes(query) ||
        player.id.toLowerCase().includes(query) ||
        player.faculty.toLowerCase().includes(query) ||
        player.category.toLowerCase().includes(query);

      const matchesFaculty =
        facultyFilter === "ALL" || player.faculty === facultyFilter;

      const matchesCategory =
        categoryFilter === "ALL" || player.category === categoryFilter;

      const matchesRisk = riskFilter === "ALL" || player.risk === riskFilter;
      const matchesHighRisk = !highRiskOnly || player.risk === "HIGH";

      return (
        matchesSearch &&
        matchesFaculty &&
        matchesCategory &&
        matchesRisk &&
        matchesHighRisk
      );
    });
  }, [players, searchQuery, facultyFilter, categoryFilter, riskFilter, highRiskOnly]);

  const filteredPlayerIds = filteredPlayers.map((player) => player.id);
  const selectedVisibleCount = filteredPlayerIds.filter((id) =>
    selectedPlayerIds.includes(id)
  ).length;

  const isAllVisibleSelected =
    filteredPlayers.length > 0 && selectedVisibleCount === filteredPlayers.length;

  const selectedPlayers = players.filter((player) =>
    selectedPlayerIds.includes(player.id)
  );

  const totalRegistered = 1248;
  const totalPresent = players.filter((player) => player.presence).length;
  const highRiskCount = players.filter((player) => player.risk === "HIGH").length;
  const pendingCount = players.filter(
    (player) => player.eligibility === "PENDING"
  ).length;

  const addLog = (text: string, actor = "Admin Lapangan") => {
    const now = new Date();

    const time = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setLogs((prevLogs) => [
      {
        time,
        actor,
        text,
        active: true,
      },
      ...prevLogs.map((log) => ({
        ...log,
        active: false,
      })),
    ]);
  };

  const toggleSelectOne = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const toggleSelectAllVisible = () => {
    setSelectedPlayerIds((prev) => {
      if (isAllVisibleSelected) {
        return prev.filter((id) => !filteredPlayerIds.includes(id));
      }

      return Array.from(new Set([...prev, ...filteredPlayerIds]));
    });
  };

  const clearSelectedPlayers = () => {
    setSelectedPlayerIds([]);
  };

  const togglePresence = (playerId: string) => {
    const selectedPlayer = players.find((player) => player.id === playerId);

    if (!selectedPlayer) return;

    const nextPresence = !selectedPlayer.presence;

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId
          ? {
              ...player,
              presence: nextPresence,
            }
          : player
      )
    );

    addLog(
      `${nextPresence ? "Presensi dicatat" : "Presensi dibatalkan"}: ${
        selectedPlayer.name
      }`
    );
  };

  const updateEligibility = (
    playerId: string,
    eligibility: EligibilityStatus
  ) => {
    const selectedPlayer = players.find((player) => player.id === playerId);

    if (!selectedPlayer) return;
    if (selectedPlayer.eligibility === eligibility) return;

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId
          ? {
              ...player,
              eligibility,
            }
          : player
      )
    );

    addLog(
      `Status '${formatEligibility(eligibility)}' diberikan: ${selectedPlayer.name}`
    );
  };

  const bulkUpdateEligibility = (eligibility: EligibilityStatus) => {
    if (selectedPlayerIds.length === 0) return;

    const selectedCount = selectedPlayerIds.length;

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        selectedPlayerIds.includes(player.id)
          ? {
              ...player,
              eligibility,
            }
          : player
      )
    );

    addLog(
      `Bulk action: ${selectedCount} pemain diubah ke status '${formatEligibility(
        eligibility
      )}'`
    );

    clearSelectedPlayers();
  };

  const requestMedicalCheckUp = () => {
    if (selectedPlayerIds.length === 0) return;

    const selectedCount = selectedPlayerIds.length;

    const highRiskSelected = selectedPlayers.filter(
      (player) => player.risk === "HIGH"
    ).length;

    addLog(
      `Medical check-up diminta untuk ${selectedCount} pemain${
        highRiskSelected > 0 ? ` (${highRiskSelected} high risk)` : ""
      }`,
      "Panitia Medis"
    );

    clearSelectedPlayers();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFacultyFilter("ALL");
    setCategoryFilter("ALL");
    setRiskFilter("ALL");
    setHighRiskOnly(false);
  };

  const handleExportData = () => {
    addLog("Export data verifikasi dilakukan");
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <header className="mb-7">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
            Verifikasi Lapangan
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Kelola presensi, status risiko, dan kelayakan pemain dari sisi
            verifikator lapangan.
          </p>
        </header>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Users size={20} />}
              label="Total Terdaftar"
              value={totalRegistered.toLocaleString("id-ID")}
              tone="gray"
            />

            <StatCard
              icon={<UserCheck size={20} />}
              label="Total Hadir"
              value={totalPresent.toString()}
              tone="red"
            />

            <StatCard
              icon={<AlertTriangle size={20} />}
              label="High Risk Case"
              value={highRiskCount.toString()}
              tone="red"
            />

            <StatCard
              icon={<Clock size={20} />}
              label="Pending Review"
              value={pendingCount.toString()}
              tone="gray"
            />
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <label className="inline-flex items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-[#B41F2A]">
              Tampilkan Hanya High Risk
              <input
                type="checkbox"
                checked={highRiskOnly}
                onChange={(event) => setHighRiskOnly(event.target.checked)}
                className="h-4 w-4 accent-[#B41F2A]"
              />
            </label>

            <button
              type="button"
              onClick={handleExportData}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <Download size={16} />
              Export Data
            </button>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
          <section className="min-w-0">
            <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_150px_auto]">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-2.5">
                  <Search size={17} className="text-gray-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Cari nama, ID pemain, fakultas, atau lomba..."
                    className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </div>

                <select
                  value={facultyFilter}
                  onChange={(event) => setFacultyFilter(event.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-[#B41F2A]"
                >
                  {faculties.map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty === "ALL" ? "Semua Tim" : faculty}
                    </option>
                  ))}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-[#B41F2A]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "ALL" ? "Semua Cabang" : category}
                    </option>
                  ))}
                </select>

                <select
                  value={riskFilter}
                  onChange={(event) => setRiskFilter(event.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-[#B41F2A]"
                >
                  <option value="ALL">Semua Risiko</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                  <option value="N/A">N/A</option>
                </select>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  <Filter size={15} />
                  Reset
                </button>
              </div>
            </div>

            {selectedPlayerIds.length > 0 && (
              <div className="mb-4 flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-extrabold text-[#B41F2A]">
                    {selectedPlayerIds.length} pemain dipilih
                  </p>
                  <p className="mt-0.5 text-xs text-red-700/70">
                    Gunakan aksi massal untuk memperbarui kelayakan atau meminta
                    pemeriksaan medis.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => bulkUpdateEligibility("CLEARED")}
                    className="rounded-lg border border-green-200 bg-white px-3 py-2 text-xs font-extrabold text-green-700 hover:bg-green-50"
                  >
                    Set Cleared
                  </button>

                  <button
                    type="button"
                    onClick={() => bulkUpdateEligibility("PENDING")}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-gray-50"
                  >
                    Set Pending
                  </button>

                  <button
                    type="button"
                    onClick={() => bulkUpdateEligibility("DENY")}
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-extrabold text-[#B41F2A] hover:bg-red-50"
                  >
                    Set Deny
                  </button>

                  <button
                    type="button"
                    onClick={requestMedicalCheckUp}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#B41F2A] px-3 py-2 text-xs font-extrabold text-white hover:bg-[#981A24]"
                  >
                    <Stethoscope size={14} />
                    Medical Check-up
                  </button>

                  <button
                    type="button"
                    onClick={clearSelectedPlayers}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-extrabold text-gray-500 hover:bg-gray-50"
                  >
                    <X size={14} />
                    Batal Pilih
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-extrabold uppercase tracking-wide text-gray-500">
                      <th className="w-10 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isAllVisibleSelected}
                          onChange={toggleSelectAllVisible}
                          className="h-4 w-4 accent-[#B41F2A]"
                        />
                      </th>
                      <th className="px-3 py-3">No.</th>
                      <th className="px-3 py-3">Pemain & ID</th>
                      <th className="px-3 py-3">Tim / Fakultas</th>
                      <th className="px-3 py-3">Kategori</th>
                      <th className="px-3 py-3">Self-Assess</th>
                      <th className="px-3 py-3">Risiko</th>
                      <th className="px-3 py-3">Presensi</th>
                      <th className="px-3 py-3">Kelayakan</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPlayers.length > 0 ? (
                      filteredPlayers.map((player) => (
                        <tr
                          key={player.id}
                          className={`border-b border-gray-100 text-sm last:border-b-0 hover:bg-gray-50/50 ${
                            selectedPlayerIds.includes(player.id)
                              ? "bg-red-50/30"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedPlayerIds.includes(player.id)}
                              onChange={() => toggleSelectOne(player.id)}
                              className="h-4 w-4 accent-[#B41F2A]"
                            />
                          </td>

                          <td className="px-3 py-4 font-bold text-gray-500">
                            {player.no}
                          </td>

                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-extrabold text-gray-700">
                                {player.photo}
                              </div>

                              <div>
                                <p className="font-extrabold leading-5 text-gray-900">
                                  {player.name}
                                </p>
                                <p className="mt-0.5 text-xs font-semibold text-gray-400">
                                  {player.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-4">
                            <p className="max-w-[135px] font-bold leading-5 text-gray-700">
                              {player.faculty}
                            </p>
                          </td>

                          <td className="px-3 py-4">
                            <p className="max-w-[130px] text-[11px] font-extrabold uppercase leading-5 text-gray-500">
                              {player.category}
                            </p>
                          </td>

                          <td className="px-3 py-4 text-xs font-semibold text-gray-500">
                            {player.assessmentDate}
                          </td>

                          <td className="px-3 py-4">
                            <RiskBadge risk={player.risk} />
                          </td>

                          <td className="px-3 py-4">
                            <Toggle
                              active={player.presence}
                              onClick={() => togglePresence(player.id)}
                            />
                          </td>

                          <td className="px-3 py-4">
                            <EligibilityGroup
                              value={player.eligibility}
                              onChange={(value) =>
                                updateEligibility(player.id, value)
                              }
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-5 py-10 text-center text-sm font-semibold text-gray-400"
                        >
                          Data tidak ditemukan. Coba ubah kata kunci atau
                          filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 px-5 py-4 text-xs italic text-gray-500">
                Menampilkan <b>{filteredPlayers.length}</b> dari{" "}
                <b>{players.length}</b> data contoh. Total terdaftar sistem:{" "}
                <b>{totalRegistered.toLocaleString("id-ID")}</b>. Terakhir
                diperbarui: Senin, 6 April 2026 - 10:26 WIB
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-extrabold text-gray-900">
                <Clock size={17} className="text-[#B41F2A]" />
                Log Aktivitas Terbaru
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {(showAllLogs ? logs : logs.slice(0, 5)).map((log, index) => (
                <div key={`${log.time}-${index}`} className="flex gap-3 px-5 py-4">
                  <div
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      log.active ? "bg-[#B41F2A]" : "bg-gray-200"
                    }`}
                  />

                  <div>
                    <p className="text-[11px] font-bold text-gray-400">
                      {log.time} · {log.actor}
                    </p>
                    <p className="mt-1 text-xs font-bold leading-5 text-gray-800">
                      {log.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 px-5 py-4 text-center">
              <button
                type="button"
                onClick={() => setShowAllLogs((prev) => !prev)}
                className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-700 hover:text-[#B41F2A]"
              >
                {showAllLogs ? "Tutup Log" : "Lihat Log Lengkap"}
                <span>{showAllLogs ? "↑" : "→"}</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "red" | "gray";
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            tone === "red"
              ? "bg-red-50 text-[#B41F2A]"
              : "bg-gray-50 text-gray-600"
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className="mt-0.5 text-xl font-extrabold text-gray-950">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: RiskStatus }) {
  const className =
    risk === "HIGH"
      ? "bg-[#B41F2A] text-white"
      : risk === "MEDIUM"
      ? "bg-yellow-100 text-yellow-800"
      : risk === "LOW"
      ? "bg-green-100 text-green-700"
      : "bg-gray-200 text-gray-600";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold ${className}`}
    >
      {risk}
    </span>
  );
}

function Toggle({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition ${
        active ? "bg-[#B41F2A]" : "bg-gray-200"
      }`}
      aria-label="Toggle presensi"
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
          active ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function EligibilityGroup({
  value,
  onChange,
}: {
  value: EligibilityStatus;
  onChange: (value: EligibilityStatus) => void;
}) {
  const options: EligibilityStatus[] = ["CLEARED", "PENDING", "DENY"];

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-1">
      {options.map((option) => {
        const isActive = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-md px-2.5 py-1.5 text-[10px] font-extrabold uppercase transition ${
              isActive
                ? option === "CLEARED"
                  ? "bg-green-100 text-green-700 shadow-sm"
                  : option === "DENY"
                  ? "bg-red-100 text-[#B41F2A] shadow-sm"
                  : "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:bg-white"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function formatEligibility(value: EligibilityStatus) {
  if (value === "CLEARED") return "Cleared";
  if (value === "DENY") return "Deny";
  return "Pending";
}