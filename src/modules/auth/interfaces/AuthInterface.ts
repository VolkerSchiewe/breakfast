import { User } from "../services/user";

export interface AuthInterface {
  user?: User;
  error?: string;
  isLoading: boolean;

  login: (name: string, password: string) => void;

  logout: () => void;
}
