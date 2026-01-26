export interface GetReservationDetailResponse {
  id: number;
  reservation_id: number;
  room_id: number;
  extra_service_id: number;
}
export interface InsertReservationDetailResponse {
  id: number;
  reservation_id: number;
  room_id: number;
  extra_service_id: number;
}
export interface UpdateReservationDetailResponse {
  id: number;
  reservation_id: number;
  room_id: number;
  extra_service_id: number;
}
export interface DeleteReservationDetailResponse {
  isDeletedReservationDetail: boolean;
}
