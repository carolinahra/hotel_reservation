import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import {
    isValidEmail,
  isValidId,
  isValidNumber,
  isValidString,
} from "@shared/validation-functions";

export interface LoginRequest {
  email: unknown;
  password: unknown;
  sessionExtensionMinutes: unknown;
}

function validate(request: LoginRequest) {
  if (request.email && !isValidEmail(request.email)) {
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
  email: string;
  password: string;
  sessionExtensionMinutes: number;
  constructor(request: {
    email: string;
    password: string;
    sessionExtensionMinutes: number;
  }) {
    this.email = request.email;
    this.password = request.password;
    this.sessionExtensionMinutes = request.sessionExtensionMinutes;
  }

  public static fromRequest(request: LoginRequest) {
    validate(request);
    return new LoginRequestDTO({
      email: request.email == null ? null : String(request.email),
      password: request.password == null ? null : String(request.password),
      sessionExtensionMinutes:
        request.sessionExtensionMinutes == null
          ? null
          : Number(request.sessionExtensionMinutes),
    });
  }
}
