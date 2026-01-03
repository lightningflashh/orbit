export interface UserAccount {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string | null;
  activated: boolean;
  authorities: string[];
}