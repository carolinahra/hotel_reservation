import { ValueObject } from "@shared/value-object";

export interface SessionProps {
  id: number;
  guest_id: number;
  token: string;
  session_extension_minutes: number;
  created_at: string;
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
}
