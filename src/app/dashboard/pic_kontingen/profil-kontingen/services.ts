const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
