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
  avatar?: string;
  token?: string;
  isManagement?: UserManagementType;
  courses?: Course[];
};

export type Course = {};

export type IUpdate = 'translations' | 'siteSettings';

export type ILang = {
  en: string;
  ru: string;
  ua: string;
};

export type ITranslation = {
  id: string;
  langs: ILang[];
};

export type ISiteSettings = {
  address: {
    value: string;
  },
  logo: {
    url: string;
  },
  siteName: ILang;
};
