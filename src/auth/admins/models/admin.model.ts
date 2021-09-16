import { Admin } from '../schemas/admin.schema';

export interface AuthenticationResult {
  user: Admin | false;
  error?: Error;
}

export interface AuthenticationMethod {
  (username: string, passord: string): Promise<AuthenticationResult>;
}

export interface AdminModel {
  register(user: { username: string }, password: string): Promise<Admin>;
  authenticate(): AuthenticationMethod;
}
