export const normalizeAssessmentResponse = (response: any) => {
  if (!response) return null;
  // TelUCup API format: { status, data: { id, valid_until, ... } }
  // or { data: { id, ... } }
  // or just the object itself.
  if (response.data && response.data.data) {
    return response.data.data;
  }
  if (response.data) {
    return response.data;
  }
  return response;
};
