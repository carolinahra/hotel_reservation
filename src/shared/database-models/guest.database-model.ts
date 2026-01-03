export interface GuestTuple {
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface GuestTable {
  Guest: GuestTuple;
}
