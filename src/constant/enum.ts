export const USER_ROLE = [
  "student",
  "teacher",
  "company",
  "admin",
  // "owner",
] as const;
export type UserRole = (typeof USER_ROLE)[number];

export const TEACHER_GRADE = ["maa", "mab", "mca", "mcb", "professor"] as const;
export type TeacherGrade = (typeof TEACHER_GRADE)[number];

export const STUDENT_MAJOR = ["gl", "ia", "sic", "rsd"] as const;
export type StudentMajor = (typeof STUDENT_MAJOR)[number];

export const PROJECT_TYPE = ["classical", "1275"] as const;
export type ProjectType = (typeof PROJECT_TYPE)[number];

export const PROJECT_STATUS = [
  "proposed",
  "approved",
  "assigned",
  "completed",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUS)[number];

export const PROJECT_JURIES_ROLE = [
  "supervisor",
  "examiner",
  "president",
] as const;
export type ProjectJuriesRole = (typeof PROJECT_JURIES_ROLE)[number];

export const PROJECT_PROPOSITIONS_STATUS = [
  "validated",
  "rejected",
  "pending",
] as const;
export type ProjectPropositionsStatus =
  (typeof PROJECT_PROPOSITIONS_STATUS)[number];
