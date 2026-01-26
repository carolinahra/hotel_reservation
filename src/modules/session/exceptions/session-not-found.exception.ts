import { Exception } from "@shared/exceptions/exception";

export class SessionNotFoundException extends Exception {
  code = 403;
  constructor(message?: string) {
    super(message || "Session Not Found");
  }
}
