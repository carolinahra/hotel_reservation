import { ValueObject } from "@shared/value-object";

export interface SessionProps {
  id: number;
  guest_id: number;
  token: string;
  session_extension_minutes: number;
  created_at: string;
  updated_at: string;
}

export class Session extends ValueObject<SessionProps> {
  get id() {
    return this.props.id;
  }

  get guest_id() {
    return this.props.guest_id;
  }

  get token() {
    return this.props.token;
  }

  get session_extension_minutes() {
    return this.props.session_extension_minutes;
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
      guest_id: this.props.id,
      token: this.props.token,
      session_extension_minutes: this.props.session_extension_minutes,
      created_at: this.props.created_at,
      updated_at: this.props.updated_at,
    };
  }
}
