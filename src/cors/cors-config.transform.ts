export const transformCorsOrigins = (origins: string): string[] => {
  try {
    return JSON.parse(origins);
  } catch {
    throw new Error('CORS origins is no valid JSON.');
  }
};
