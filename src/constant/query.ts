export const QUERY = {
  AUTH: {
    KEY: ["auth"],
    STATUS: () => [...QUERY.AUTH.KEY, "status"] as const,
  },
  USER: {
    KEY: ["user"],
    ALL: () => [...QUERY.USER.KEY, "all"] as const,
  },
  TEACHER: {
    KEY: ["teacher"],
    ALL: () => [...QUERY.TEACHER.KEY, "all"] as const,
  },
  COMPANY: {
    KEY: ["company"],
    ALL: () => [...QUERY.COMPANY.KEY, "all"] as const,
  },
  STUDENT: {
    KEY: ["student"],
    ALL: () => [...QUERY.STUDENT.KEY, "all"] as const,
  },
  ADMIN: {
    KEY: ["admin"],
    ALL: () => [...QUERY.ADMIN.KEY, "all"] as const,
  },
  PROJECT: {
    KEY: ["project"],
    ALL: () => [...QUERY.PROJECT.KEY, "all"] as const,
    ONE: (id: number) => [...QUERY.PROJECT.KEY, id] as const,
  },
} as const;
