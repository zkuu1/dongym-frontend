 export interface RegisterPayload {
  name: string
  email: string
  password: string
  address: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface UserPayload {
      id: string;
      name: string | null;
      email: string | null;
      role: string | null;
      image: string | null;
      address: string | null;
      membership: string | null;
      token: string | null;
      createdAt: Date;
}