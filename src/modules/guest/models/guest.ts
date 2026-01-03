import { ValueObject } from "@shared/value-object";

export interface GuestProps {
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
}

export class Guest extends ValueObject<GuestProps> {
  static fromPrimitives() {
    //return new Guest({...});
  }
  get name() {
    return this.props.name;
  }

  get id() {
    return this.props.id;
  }

  get phone() {
    return this.props.phone;
  }
  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }
  public toPrimitives() {
    return {
      id: this.props.id,
      name: this.props.name,
      phone: this.props.phone,
      email: this.props.email,
    };
  }
}
