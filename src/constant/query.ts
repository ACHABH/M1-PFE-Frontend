export const QUERY = {
  AUTH: {
    KEY: ["auth"],
    STATUS: () => [...QUERY.AUTH.KEY, "status"] as const,
  },
  USER: {
    KEY: ["user"],
    ALL: () => [...QUERY.USER.KEY, "all"] as const,
    ARCHIVE: () => [...QUERY.USER.KEY, "archive"] as const,
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
    ARCHIVE: () => [...QUERY.PROJECT.KEY, "archive"] as const,
    ONE: (id: number) => [...QUERY.PROJECT.KEY, id] as const,
  },
  ROOM: {
    KEY: ["room"],
    ALL: () => [...QUERY.ROOM.KEY, "all"] as const,
    ARCHIVE: () => [...QUERY.ROOM.KEY, "archive"] as const,
    ONE: (id: number) => [...QUERY.ROOM.KEY, id] as const,
  },
  GROUP: {
    KEY: ["group"],
    ALL: () => [...QUERY.GROUP.KEY, "all"] as const,
    ARCHIVE: () => [...QUERY.GROUP.KEY, "archive"] as const,
    ONE: (id: number) => [...QUERY.GROUP.KEY, id] as const,
  },
  EMAIL: {
    KEY: ["email"],
    ALL: () => [...QUERY.EMAIL.KEY, "all"] as const,
    ONE: (id: number) => [...QUERY.EMAIL.KEY, id] as const,
    TEMPLATE: {
      KEY: ["template"],
      ALL: () => [...QUERY.EMAIL.TEMPLATE.KEY, "all"] as const,
      ARCHIVE: () => [...QUERY.EMAIL.TEMPLATE.KEY, "archive"] as const,
      ONE: (id: number) => [...QUERY.EMAIL.TEMPLATE.KEY, id] as const,
    },
  },
} as const;
