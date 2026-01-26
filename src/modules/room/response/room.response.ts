export interface GetRoomResponse {
  id: number;
  name: string;
  room_size_id: number;
  price: number;
  availability: string;
  created_at: string;
  updated_at: string;
}
export interface InsertRoomResponse {
  id: number;
  name: string;
  room_size_id: number;
  price: number;
  availability: string;
  created_at: string;
  updated_at: string;
}
export interface UpdateRoomResponse {
  id: number;
  name: string;
  room_size_id: number;
  price: number;
  availability: string;
  created_at: string;
  updated_at: string;
}
export interface DeleteRoomResponse {
  isDeletedRoom: boolean;
}
