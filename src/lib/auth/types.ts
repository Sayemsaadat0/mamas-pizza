export type User = {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
};

export type LoginResponse = {
  status: boolean;
  message: string;
  user: User;
  token: string;
  token_type: string; // e.g., "Bearer"
};