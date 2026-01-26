import { ValueObject } from "@shared/value-object";
export interface ReservationDetailProps {
  id: number;
  reservation_id: number;
  room_id: number;
  extra_service_id: number;
}
export class ReservationDetail extends ValueObject<ReservationDetailProps> {
  public get id() {
    return this.props.id;
  }

  public get reservation_id() {
    return this.props.reservation_id;
  }
  public get room_id() {
    return this.props.room_id;
  }
  public get extra_service_id() {
    return this.props.extra_service_id;
  }
  public toPrimitives() {
    return {
      id: this.props.id,
      reservation_id: this.props.reservation_id,
      room_id: this.props.room_id,
      extra_service_id: this.props.extra_service_id,
    };
  }
}
