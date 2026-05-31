export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  
  // Try to parse axios or standard API error response
  if (error !== null && typeof error === "object") {
    const apiError = error as { message?: string; response?: { data?: { message?: string } } };
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
    if (apiError.message) {
      return apiError.message;
    }
  }

  return fallback;
}

export function getErrorStatus(error: unknown): number | undefined {
  if (error !== null && typeof error === "object") {
    const apiError = error as { status?: number; response?: { status?: number } };
    return apiError.status || apiError.response?.status;
  }
  return undefined;
}
