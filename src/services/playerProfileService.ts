import { apiClient, API_BASE_URL } from "@/lib/apiClient";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface PlayerProfile {
  id: number;
  user_id: number;
  name: string;
  nim_nip: string | null;
  contingent_id: number | null;
  photo_path: string | null;
  employee_status: string | null;
  work_location: string | null;
  risk_lvl: string | null;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    is_kacamata: boolean;
  };
  contingent?: {
    id: number;
    name: string;
  } | null;
}

export interface UpdateProfilePayload {
  nim_nip?: string;
  is_kacamata?: boolean;
  employee_status?: string | null;
  work_location?: string | null;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  is_kacamata: boolean;
  player?: PlayerProfile;
}

// ─── API Calls ──────────────────────────────────────────────────────────────────

/**
 * Get current user WITH player relation.
 *
 * NOTE: The backend `GET /api/user` might not include `player` by default.
 * This function fetches the user first, then fetches player data via
 * `GET /api/players/{id}` if `player` is not included.
 *
 * ⚠️ Tell your backend friend to update `GET /api/user` to include:
 *     return $request->user()->load('player');
 * Then this workaround can be simplified.
 */
export const getMyUser = async (): Promise<UserData> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch user
  const userRes = await fetch(
    `${API_BASE_URL}/user`,
    {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!userRes.ok) {
    throw new Error("Gagal memuat data user.");
  }

  const userData: UserData = await userRes.json();

  // If player relation is already loaded, return as-is
  if (userData.player) {
    return userData;
  }

  // Otherwise, try to get player data from the updateProfile response
  // by calling PATCH with no changes (this returns the player object)
  try {
    const profileRes = await fetch(
      `${API_BASE_URL}/player/profile`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}),
      }
    );

    if (profileRes.ok) {
      const profileData = await profileRes.json();
      if (profileData.data?.player) {
        userData.player = profileData.data.player;
        userData.is_kacamata = profileData.data.is_kacamata ?? userData.is_kacamata;
      }
    }
  } catch {
    // Player profile might not exist yet — that's OK for onboarding
  }

  return userData;
};

/** Update player profile fields */
export const updateProfile = async (data: UpdateProfilePayload) => {
  return apiClient.patch("/player/profile", data);
};

/** Upload face photo — uses multipart/form-data, bypasses apiClient JSON headers */
export const enrollFace = async (photo: File) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const formData = new FormData();
  formData.append("photo", photo);

  const res = await fetch(`${API_BASE_URL}/players/enroll-face`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Gagal mengunggah foto wajah.");
  }

  return res.json();
};
