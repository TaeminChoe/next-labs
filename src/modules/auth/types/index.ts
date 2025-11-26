export interface AuthUser {
  email: string;
  companyName: string;
  name: string;
  phone: string;
  // role: "admin" | "user" | string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}
