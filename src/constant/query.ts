export const QUERY = {
  AUTH: {
    KEY: ["auth"],
    STATUS: () => [...QUERY.AUTH.KEY, "status"] as const,
  },
  USER: {
    KEY: ["user"],
    ALL: () => [...QUERY.USER.KEY, "all"] as const,
  },
  PROJECT: {
    KEY: ["project"],
    ALL: () => [...QUERY.PROJECT.KEY, "all"] as const,
    ONE: (id: number) =>
      [...QUERY.PROJECT.KEY, id] as const,
  },
} as const;
