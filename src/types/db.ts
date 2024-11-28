import type {
  EmailStatus,
  ProjectJuriesRole,
  ProjectPropositionsStatus,
  ProjectStatus,
  ProjectType,
  StudentMajor,
  TeacherGrade,
  UserRole,
} from "../constant/enum";

type PrimaryKey = { id: number };

type TimeStamps = {
  created_at: string;
  updated_at: string;
};

type SoftDeletes = {
  deleted_at: string;
};

type ForeignKeys = {
  UserId: { user_id: number };
  StudentId: { student_id: number };
  TeacherId: { teacher_id: number };
  CompanyId: { company_id: number };
  AdminId: { Admin_id: number };
  ProjectId: { project_id: number };
  RoomId: { room_id: number };
  ValidatedBy: { validated_by: number }; // admin
  projectPropositionId: { project_proposition_id: number };
  ReceiverId: { receiver_id: number }; // user
};

export type User = {
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string;
  role: UserRole;
} & PrimaryKey &
  TimeStamps &
  SoftDeletes;
export type Users = User[];

export type Teacher = {
  recruitment_date: string;
  grade: TeacherGrade;
} & ForeignKeys["UserId"];
export type Teachers = Teacher[];

export type Student = {
  major: StudentMajor;
  average_score: number;
} & ForeignKeys["UserId"];
export type Students = Student[];

export type Company = {
  number: number;
  name: string;
} & ForeignKeys["UserId"];
export type Companies = Company[];

export type Admin = ForeignKeys["UserId"];
export type Admins = Admin[];

export type Project = {
  title: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
} & PrimaryKey &
  TimeStamps &
  SoftDeletes;
export type Projects = Project[];

export type ProjectRegistration = {
  start_date: string;
  end_date: string;
} & ForeignKeys["ProjectId"];
export type ProjectRegistrations = ProjectRegistration[];

export type ProjectNote = {
  note: number;
} & ForeignKeys["StudentId"] &
  ForeignKeys["ProjectId"];
export type ProjectNotes = ProjectNote[];

export type ProjectPresentation = {
  date: string;
} & ForeignKeys["RoomId"] &
  ForeignKeys["ProjectId"];
export type ProjectPresentations = ProjectPresentation[];

export type Room = {
  room: string;
} & PrimaryKey &
  TimeStamps &
  SoftDeletes;
export type Rooms = Room[];

export type ProjectProposition = {
  status: ProjectPropositionsStatus;
} & PrimaryKey &
  ForeignKeys["UserId"] &
  ForeignKeys["ProjectId"] &
  ForeignKeys["ValidatedBy"];
export type ProjectPropositions = ProjectProposition[];

export type ProjectPropositionFeedback = {
  feedback: string;
} & PrimaryKey &
  ForeignKeys["projectPropositionId"] &
  TimeStamps;
export type ProjectPropositionFeedbacks = ProjectPropositionFeedback[];

export type ProjectJury = {
  role: ProjectJuriesRole;
} & ForeignKeys["TeacherId"] &
  ForeignKeys["ProjectId"];
export type ProjectJuries = ProjectJury[];

// TODO: define student groups, specify project participants/developers
export type ProjectStudent = ForeignKeys["StudentId"] &
  ForeignKeys["ProjectId"];
export type ProjectStudents = ProjectStudent[];

export type Email = {
  subject: string;
  content: string;
  status: EmailStatus;
} & PrimaryKey &
  ForeignKeys["AdminId"] &
  ForeignKeys["ReceiverId"] &
  TimeStamps;
export type Emails = Email[];

export type EmailTemplate = {
  subject: string;
  content: string;
} & PrimaryKey &
  TimeStamps &
  SoftDeletes;
export type EmailTemplates = EmailTemplate[];
