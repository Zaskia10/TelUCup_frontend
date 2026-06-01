export const getDraftKey = (): string => {
  if (typeof window === "undefined") return "telucup_self_assessment_draft";

  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.id) {
        return `telucup_self_assessment_draft_${user.id}`;
      }
    }
  } catch {
    // Ignore parse error
  }
  
  return "telucup_self_assessment_draft";
};
