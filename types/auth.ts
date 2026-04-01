export type UserRole = "admin" | "affiliate";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username?: string | null;
  phone?: string | null;
  affiliateId?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  redirectTo: string;
}

export interface AccountProfile {
  name: string;
  email: string;
  username: string;
  phone: string;
  role: UserRole;
  affiliateId?: string | null;
}
