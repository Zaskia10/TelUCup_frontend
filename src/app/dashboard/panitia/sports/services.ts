const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = (isFormData: boolean = false) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: any = {
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
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

// --- Sports Endpoints ---

export const getSports = async () => {
  const res = await fetch(`${API_BASE_URL}/sports`, {
    method: "GET",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const getSportDetail = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/sports/${id}`, {
    method: "GET",
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const createSport = async (payload: FormData) => {
  const res = await fetch(`${API_BASE_URL}/sports`, {
    method: "POST",
    headers: getHeaders(true),
    body: payload
  });
  return handleResponse(res);
};

export const updateSport = async (id: number, payload: FormData) => {
  // Use POST with _method=PUT to support multipart/form-data update in Laravel
  payload.append("_method", "PUT");
  const res = await fetch(`${API_BASE_URL}/sports/${id}`, {
    method: "POST",
    headers: getHeaders(true),
    body: payload
  });
  return handleResponse(res);
};

export const deleteSport = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/sports/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  return handleResponse(res);
};
