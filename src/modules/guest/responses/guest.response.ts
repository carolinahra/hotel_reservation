export interface GetGuestResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export interface InsertGuestResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export interface UpdateGuestResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export interface DeleteGuestResponse {
  isDeletedGuest: boolean;
}