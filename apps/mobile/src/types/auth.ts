export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
