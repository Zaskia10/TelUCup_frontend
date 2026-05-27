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
      // Return raw errors object for field validation handling
      return Promise.reject({ status: 422, message: data.message, errors: data.errors });
    }
    throw new Error(data.message || "Terjadi kesalahan server. Coba lagi nanti.");
  }

  return data;
};

// --- Contingent Endpoints ---

export const getContingents = async () => {
  const res = await fetch(`${API_BASE_URL}/contingents`, {
    method: "GET",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const getContingentDetail = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/contingents/${id}`, {
    method: "GET",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const createContingent = async (payload: { name: string }) => {
  const res = await fetch(`${API_BASE_URL}/contingents`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

export const updateContingent = async (id: number, payload: { name: string }) => {
  const res = await fetch(`${API_BASE_URL}/contingents/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

export const deleteContingent = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/contingents/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const assignPic = async (contingentId: number, payload: { user_id: number }) => {
  const res = await fetch(`${API_BASE_URL}/contingents/${contingentId}/assign-pic`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

// --- User / Player Endpoints ---

export const getPlayers = async () => {
  const res = await fetch(`${API_BASE_URL}/players`, {
    method: "GET",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const getPicKontingen = async () => {
  const res = await fetch(`${API_BASE_URL}/pic-kontingen`, {
    method: "GET",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const createPlayer = async (payload: any) => {
  const res = await fetch(`${API_BASE_URL}/players`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

export const promoteToPic = async (userId: number) => {
  // Although not directly needed to assign to contingent, the PRD mentioned it.
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/promote-to-pic`, {
    method: "PUT",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const assignPlayerToContingent = async (playerId: number, payload: { contingent_id: number }) => {
  const res = await fetch(`${API_BASE_URL}/players/${playerId}/assign-contingent`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};
