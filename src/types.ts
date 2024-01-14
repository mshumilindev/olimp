export type UserRole = "admin" | "teacher" | "student" | "guest";

export type UserStatus = "active" | "suspended";

export type UserManagementType = "teacher" | "deputy" | "headmaster";

export type User = {
  canSeeGuests: boolean;
  email: string;
  id: string;
  login: string;
  name: string;
  password: string;
  role: UserRole;
  skype: string;
  status: UserStatus;
  tel: string;
  token?: string;
  isManagement?: UserManagementType;
  courses?: Course[];
};

export type Course = {};
