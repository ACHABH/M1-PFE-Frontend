export const request: typeof window.fetch = (path, init = {}) => {
  return fetch(`http://127.0.0.1:8000${path}`, {
    ...init,
    headers: {
      ...init?.headers,
    },
    credentials: "include",
  });
};
