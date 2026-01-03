import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import {
  isValidId,
  isValidName,
  isValidLimit,
  isValidOffset,
  isValidPhone,
  isValidString,
} from "@shared/validation-functions";
export interface GetGuestRequest {
  id?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  limit?: unknown;
  offset?: unknown;
}

function validate(request: GetGuestRequest): void {
  if (request.id && !isValidId(request.id)) {
    throw new InvalidRequestException();
  }
  if (request.phone && !isValidPhone(request.phone)) {
    throw new InvalidRequestException();
  }
  if (request.name && !isValidName(request.name)) {
    throw new InvalidRequestException();
  }
  if (request.limit && !isValidLimit(request.limit)) {
    throw new InvalidRequestException();
  }
  if (request.offset && !isValidOffset(request.offset)) {
    throw new InvalidRequestException();
  }
  if (request.email && !isValidString(request.email)) {
    throw new InvalidRequestException();
  }
}

export class GetGuestRequestDTO {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
  limit?: number;
  offset?: number;

  constructor(getGuestRequest: {
    id?: number;
    name?: string;
    phone?: string;
    email?: string;
    limit?: number;
    offset?: number;
  }) {
    this.id = getGuestRequest.id;
    this.name = getGuestRequest.name;
    this.phone = getGuestRequest.phone;
    this.email = getGuestRequest.email;
    this.limit = getGuestRequest.limit;
    this.offset = getGuestRequest.offset;
  }

  public static fromRequest(request: GetGuestRequest): GetGuestRequestDTO {
    validate(request);
    return new GetGuestRequestDTO({
      id: request.id == null ? null : Number(request.id),
      name: request.name == null ? null : String(request.name),
      phone: request.phone == null ? null : String(request.phone),
      email: request.email == null ? null : String(request.email),
      limit: request.limit == null ? null : Number(request.limit),
      offset: request.offset == null ? null : Number(request.offset),
    });
  }
}
