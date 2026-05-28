const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error("Sesi telah berakhir. Silakan login kembali.");
  }
  if (res.status === 403) {
    throw new Error("Anda tidak memiliki akses untuk aksi ini.");
  }
  
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 422) {
      return Promise.reject({ status: 422, message: data.message, errors: data.errors });
    }
    throw new Error(data.message || "Terjadi kesalahan server. Coba lagi nanti.");
  }

  return data;
};

// --- Bracket & Matches Endpoints ---

export const getSports = async () => {
  const res = await fetch(`${API_BASE_URL}/sports`, {
    method: "GET",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const getBracket = async (sportId: number, categoryId?: number | null) => {
  const query = new URLSearchParams({ sport_id: sportId.toString() });
  if (categoryId) {
    query.append("sport_category_id", categoryId.toString());
  }
  const res = await fetch(`${API_BASE_URL}/bracket?${query.toString()}`, {
    method: "GET",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const generateBracket = async (payload: { sport_id: number; sport_category_id?: number | null }) => {
  const res = await fetch(`${API_BASE_URL}/bracket/generate`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

export const resetBracket = async (sportId: number, categoryId?: number | null) => {
  const query = new URLSearchParams({ sport_id: sportId.toString() });
  if (categoryId) {
    query.append("sport_category_id", categoryId.toString());
  }
  const res = await fetch(`${API_BASE_URL}/bracket/reset?${query.toString()}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const updateMatchScore = async (id: number | string, payload: { score_a: number; score_b: number; winner_registration_id?: number | null; notes?: string }) => {
  const res = await fetch(`${API_BASE_URL}/matches/${id}/score`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

export const updateMatchSchedule = async (id: number | string, payload: { match_date?: string | null; match_time?: string | null; location?: string | null; referee_name?: string | null; notes?: string | null }) => {
  const res = await fetch(`${API_BASE_URL}/matches/${id}/schedule`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

export const setMatchTeams = async (id: number | string, payload: { registration_a_id?: number | null; registration_b_id?: number | null }) => {
  const res = await fetch(`${API_BASE_URL}/matches/${id}/teams`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

export const swapMatchTeams = async (id: number | string) => {
  const res = await fetch(`${API_BASE_URL}/matches/${id}/swap`, {
    method: "PATCH",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const setMatchStatus = async (id: number | string, payload: { status: "scheduled" | "live" | "finished" }) => {
  const res = await fetch(`${API_BASE_URL}/matches/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

export const getRegistrations = async (sportId: number, categoryId?: number | null) => {
  const query = new URLSearchParams({ sport_id: sportId.toString(), status: 'verified' });
  if (categoryId) {
    query.append("sport_category_id", categoryId.toString());
  }
  const res = await fetch(`${API_BASE_URL}/registrations?${query.toString()}`, {
    method: "GET",
    headers: getHeaders()
  });
  return handleResponse(res);
};
