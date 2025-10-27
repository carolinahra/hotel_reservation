import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import {
  isValidName,
  isValidPhone,
  isValidEmail,
  isValidId,
} from "@shared/validation-functions";
export interface UpdateGuestRequest {
  id: unknown;
  phone?: unknown;
  name?: unknown;
  email?: unknown;
}

function validate(request: UpdateGuestRequest): void {
  if (request.id && !isValidId(request.id)) {
    throw new InvalidRequestException();
  }
  if (request.phone && !isValidPhone(request.phone)) {
    throw new InvalidRequestException();
  }
  if (request.name && !isValidName(request.name)) {
    throw new InvalidRequestException();
  }
  if (request.email && !isValidEmail(request.email)) {
    throw new InvalidRequestException();
  }
}

export class UpdateGuestRequestDTO {
  id: number;
  phone?: string;
  name?: string;
  email?: string;

  constructor(updateGuestRequest: {
    id: number;
    phone?: string;
    name?: string;
    email?: string;
  }) {
    this.id = updateGuestRequest.id;
    this.phone = updateGuestRequest.phone;
    this.name = updateGuestRequest.name;
    this.email = updateGuestRequest.email;
  }

  public static fromRequest(
    request: UpdateGuestRequest
  ): UpdateGuestRequestDTO {
    validate(request);
    return new UpdateGuestRequestDTO({
      id: request.id == null ? null : Number(request.id),
      phone: request.phone == null ? null : String(request.phone),
      name: request.name == null ? null : String(request.name),
      email: request.email == null ? null : String(request.email),
    });
  }
}
