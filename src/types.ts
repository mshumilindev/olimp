export type User = {
  canSeeGuests: boolean;
  email: string;
  id: string;
  login: string;
  name: string;
  password: string;
  role: "admin" | "teacher" | "student" | "guest";
  skype: string;
  status: "active" | "suspended";
  tel: string;
  token: string;
  isManagement: "teacher" | "deputy" | "headmaster";
  courses: Course[];
};

export type Course = {};
