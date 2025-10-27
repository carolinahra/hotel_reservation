import { ValueObject } from "@shared/value-object";
export interface RoomProps {
  id: number;
  name: string;
  room_size_id: number;
  price: number;
  availability: string;
  created_at: string;
  updated_at: string;
}

export class Room extends ValueObject<RoomProps> {
  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get room_size_id() {
    return this.props.room_size_id;
  }

  get price() {
    return this.props.price;
  }

  get availability() {
    return this.props.availability;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  public toPrimitives() {
    return {
      id: this.props.id,
      name: this.props.name,
      room_size_id: this.props.room_size_id,
      price: this.props.price,
      availability: this.props.availability,
      created_at: this.props.created_at,
      updated_at: this.props.updated_at,
    };
  }
}
