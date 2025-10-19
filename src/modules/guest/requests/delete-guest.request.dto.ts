import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import {
  isValidEmail,
  isValidPhone,
} from "@shared/validation-functions";
export interface DeleteGuestRequest {
  phone?: unknown;
  email?: unknown;
}

function validate(request: DeleteGuestRequest): void {
  if (request.phone && !isValidPhone(request.phone)) {
    throw new InvalidRequestException();
  }
    if (request.email && !isValidEmail(request.email)) {
    throw new InvalidRequestException();
  }
}

export class DeleteGuestRequestDTO {
  phone?: string;
  email?: string;

  constructor(deleteGuestRequest: {
    phone?: string;
    email?: string;

  }) {
    this.phone = deleteGuestRequest.phone;
    this.email = deleteGuestRequest.email;
  }

  public static fromRequest(
    request: DeleteGuestRequest
  ): DeleteGuestRequestDTO {
    validate(request);
    return new DeleteGuestRequestDTO({
      phone: request.phone == null ? null : String(request.phone),
      email: request.email == null ? null: String(request.email)
    });
  }
}
