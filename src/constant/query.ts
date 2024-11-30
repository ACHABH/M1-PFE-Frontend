export const QUERY = {
  AUTH: {
    KEY: ["auth"],
    STATUS: () => [...QUERY.AUTH.KEY, "status"] as const,
  },
  USER: {
    KEY: ["user"],
  },
} as const;
