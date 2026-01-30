export const UrlUtil = {
  getBaseUrl(): string {
    return `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
  },
};
