export interface ReservationTuple {
  id: number;
  guest_id: number;
  external_reference: string;
  total_price: number;
  payment_status: string;
  check_in_at: string;
  check_out_at: string;
  created_at: string;
  updated_at: string;
}

export interface ReservationTable {
  Reservation: ReservationTuple;
}
