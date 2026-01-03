import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import {
  isValidId,
  isValidNumber,
  isValidString,
} from "@shared/validation-functions";

export interface LoginRequest {
  guestID: unknown;
  password: unknown;
  sessionExtensionMinutes: unknown;
}

function validate(request: LoginRequest) {
  if (request.guestID && !isValidId(request.guestID)) {
    throw new InvalidRequestException();
  }
  if (request.password && !isValidString(request.password)) {
    throw new InvalidRequestException();
  }
  if (
    request.sessionExtensionMinutes &&
    !isValidNumber(request.sessionExtensionMinutes)
  ) {
    throw new InvalidRequestException();
  }
}
export class LoginRequestDTO {
  guestID: number;
  password: string;
  sessionExtensionMinutes: number;
  constructor(request: {
    guestID: number;
    password: string;
    sessionExtensionMinutes: number;
  }) {
    this.guestID = request.guestID;
    this.password = request.password;
    this.sessionExtensionMinutes = request.sessionExtensionMinutes;
  }

  public static fromRequest(request: LoginRequest) {
    validate(request);
    return new LoginRequestDTO({
      guestID: request.guestID == null ? null : Number(request.guestID),
      password: request.password == null ? null : String(request.password),
      sessionExtensionMinutes:
        request.sessionExtensionMinutes == null
          ? null
          : Number(request.sessionExtensionMinutes),
    });
  }
}
