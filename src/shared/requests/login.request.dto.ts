import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import { isValidEmail, isValidPassword } from "@shared/validation-functions";

export interface LoginRequest {
  email: unknown;
  password: unknown;
}

function validate(request: LoginRequest) {
  if (request.email && !isValidEmail(request.email)) {
    throw new InvalidRequestException();
  }
  if (request.password && !isValidPassword(request.password)) {
    throw new InvalidRequestException();
  }
}
export class LoginRequestDTO {
  email: string;
  password: string;
  constructor(request: { email: string; password: string }) {
    this.email = request.email;
    this.password = request.password;
  }

  public static fromRequest(request: LoginRequest) {
    validate(request);
    return new LoginRequestDTO({
      email: request.email == null ? null : String(request.email),
      password: request.password == null ? null : String(request.password),
    });
  }
}
