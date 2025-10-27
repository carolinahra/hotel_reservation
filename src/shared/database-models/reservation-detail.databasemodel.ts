interface ReservationDetailTuple {
  id: number;
  reservation_id: number;
  room_id: number;
  extra_service_id: number;
}

export interface ReservationDetailTable {
  Reservation_Detail: ReservationDetailTuple;
}
