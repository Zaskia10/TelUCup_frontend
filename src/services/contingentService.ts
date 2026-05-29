const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getMyContingent = async () => {
  const response = await fetch(`${API_URL}/contingents/my`, {
    headers: getHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal mengambil data kontingen");
  return resData;
};

export const getMyContingentPlayers = async () => {
  const response = await fetch(`${API_URL}/contingents/my/players`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Gagal mengambil daftar pemain kontingen");
  return response.json();
};

export const removeContingentPlayer = async (playerId: number) => {
  const response = await fetch(`${API_URL}/contingents/my/players/${playerId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Gagal menghapus pemain dari kontingen");
  return resData;
};

// Add player involves two steps: create player account, then assign to contingent
export const addContingentPlayer = async (data: { name: string; nim_nip: string; email: string; employee_status: string }) => {
  // Step 1: Create Player Account
  const createPlayerRes = await fetch(`${API_URL}/players`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: "rahasia123", // Default password as per requirement
      nim_nip: data.nim_nip,
      employee_status: data.employee_status
    }),
  });
  
  const createPlayerResData = await createPlayerRes.json();
  if (!createPlayerRes.ok) {
    throw new Error(createPlayerResData.message || "Gagal membuat akun pemain");
  }

  const newPlayerId = createPlayerResData.player?.id;
  if (!newPlayerId) {
    throw new Error("Gagal mendapatkan ID pemain yang baru dibuat");
  }

  // Step 2: Assign player to contingent
  const assignRes = await fetch(`${API_URL}/contingents/my/players`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      player_id: newPlayerId
    }),
  });

  const assignResData = await assignRes.json();
  if (!assignRes.ok) {
    throw new Error(assignResData.message || "Gagal menambahkan pemain ke kontingen");
  }

  return assignResData;
};
