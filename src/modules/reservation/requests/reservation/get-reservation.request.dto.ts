import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import {
  isValidDate,
  isValidId,
  isValidLimit,
  isValidOffset,
} from "@shared/validation-functions";

interface GetReservationRequest {
  id?: unknown;
  externalReference?: unknown;
  guestId?: unknown;
  checkInDate?: unknown;
  checkOutDate?: unknown;
  limit?: unknown;
  offset?: unknown;
}

function validate(request: GetReservationRequest) {
  if (request.id && !isValidId(request.id)) {
    throw new InvalidRequestException();
  }
  if (request.guestId && !isValidId(request.guestId)) {
    throw new InvalidRequestException();
  }
  if (request.checkInDate && !isValidDate(request.checkInDate)) {
    throw new InvalidRequestException();
  }
  if (request.checkOutDate && !isValidDate(request.checkOutDate)) {
    throw new InvalidRequestException();
  }
  if (request.limit && !isValidLimit(request.limit)) {
    throw new InvalidRequestException();
  }
  if (request.offset && !isValidOffset(request.offset)) {
    throw new InvalidRequestException();
  }
}

export class GetReservationRequestDTO {
  id?: number;
  externalReference?: string;
  guestId?: number;
  checkInDate?: string;
  checkOutDate?: string;
  limit?: number;
  offset?: number;

  constructor(getReservationRequest: {
    id?: number;
    externalReference?: string;
    guestId?: number;
    checkInDate?: string;
    checkOutDate?: string;
    limit?: number;
    offset?: number;
  }) {
    (this.id = getReservationRequest.id),
      (this.externalReference = getReservationRequest.externalReference),
      (this.guestId = getReservationRequest.guestId),
      (this.checkInDate = getReservationRequest.checkInDate),
      (this.checkOutDate = getReservationRequest.checkOutDate),
      (this.limit = getReservationRequest.limit),
      (this.offset = getReservationRequest.offset);
  }

  public static fromRequest(
    request: GetReservationRequest
  ): GetReservationRequestDTO {
    validate(request);
    return new GetReservationRequestDTO({
      id: request.id == null ? null : Number(request.id),
      guestId: request.guestId == null ? null : Number(request.guestId),
      externalReference:
        request.externalReference == null
          ? null
          : String(request.externalReference),
      checkInDate:
        request.checkInDate == null ? null : String(request.checkInDate),
      checkOutDate:
        request.checkOutDate == null ? null : String(request.checkOutDate),
      limit: request.limit == null ? null : Number(request.limit),
      offset: request.offset == null ? null : Number(request.offset),
    });
  }
}
