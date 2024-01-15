export type TUserRole = "admin" | "teacher" | "student" | "guest";

export type TUserStatus = "active" | "suspended";

export type TUserManagementType = "teacher" | "deputy" | "headmaster";

export type TUser = {
  canSeeGuests: boolean;
  email: string;
  id: string;
  login: string;
  name: string;
  password: string;
  role: TUserRole;
  skype: string;
  status: TUserStatus;
  tel: string;
  avatar?: string;
  token?: string;
  isManagement?: TUserManagementType;
  courses?: TCourse[];
};

export type TCourse = {};

export type TUpdate = 'translations' | 'siteSettings';

export type TLang = {
  en: string;
  ru: string;
  ua: string;
};

export type TTranslation = {
  id: string;
  langs: TLang[];
};

export type TSiteSettings = {
  address: {
    value: string;
  },
  logo: {
    url: string;
  },
  siteName: TLang;
};

export type TNotification = {
  heading: TLang;
  link: {
    url: string;
    text: TLang;
  },
  targetUsers: string[];
  text: TLang;
  type: 'message' | 'warning' | 'error';
  id?: string;
};

export type TContact = {
  name: TLang;
  order: number;
  phone: string;
  id?: string;
};

export type TBlock = {
  order: number;
  id: string;
};

export type TPage = {
  featured: string;
  name: TLang;
  slug: string;
  content?: TBlock[];
  id?: string;
};

export type TEmptyPage = {
  id?: string;
  content?: TBlock[];
}