export const getValidatedUrl = (userId: string | undefined, url: string | undefined) =>
  url?.includes("http") ? url : `${process.env.EXPO_PUBLIC_URL}/upload/${userId}${url}`;

export const getValidatedUrlPublic = (url: string) => (url?.includes("http") ? url : `${process.env.EXPO_PUBLIC_URL}/upload/${url}`);

export const getValidatedUrlProtected = (url: string) => (url?.includes("http") ? url : `${process.env.EXPO_PUBLIC_URL}/upload/${url}`);
