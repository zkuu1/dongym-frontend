export interface Absensi {
  id: string | number;
  name?: string;
  date: string | Date;
  status: string;
  createdAt?: string | Date;
  isMember?: boolean;
}

export interface Customer {
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

export interface Product {
    id: string;
    name: string;
    description: string;
    image: string | null;
    price?: number;
    stock: number;
    categoryId: string
    createdAt: string

}

export interface Stat {
  title: string;
  value: string | number;
  target?: string | Date;
  change?: string;
  changeColor?: string;
}

export interface graphicStat {
   id: string;
  name: string;
  createdAt: string | Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string
}