const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export const getMyContingentProfile = async () => {
  const res = await fetch(`${API_URL}/contingents/my`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal memuat profil kontingen.");
  }
  return data;
};

export const uploadContingentImage = async (file: File) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/contingents/my/image`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: formData,
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal mengunggah gambar kontingen.");
  }
  return data;
};

export const deleteContingentImage = async (id: number) => {
  const res = await fetch(`${API_URL}/contingents/${id}/image`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal menghapus gambar kontingen.");
  }
  return data;
};

export const getMySelfAssessment = async () => {
  const res = await fetch(`${API_URL}/self-assessment/me`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await res.json();
  
  // Kalau status 404, artinya belum pernah self assessment
  if (res.status === 404) {
    return null;
  }
  
  if (!res.ok) {
    throw new Error(data.message || "Gagal memuat self-assessment.");
  }
  
  // self-assessment/me mengembalikan pagination atau objek. Berdasarkan contoh, kembaliannya pagination object
  // Tapi contoh API body yang diberikan memiliki field paginate, yang di root ada current_page dsb.
  // Tapi juga ada data assessment-nya di level root pada contoh (id, player_id, ...).
  return data.data ? data.data[0] || data : data;
};
