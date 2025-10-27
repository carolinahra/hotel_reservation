import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import {
  isValidDate,
  isValidExternalReference,
  isValidId,
  isValidPrice,
  isValidString,
} from "@shared/validation-functions";

interface UpdateReservationRequest {
  id: unknown;
  guestId: unknown;
  externalReference: unknown;
  totalPrice: unknown;
  paymentStatus: unknown;
  checkInDate: unknown;
  checkOutDate: unknown;
}

function validate(request: UpdateReservationRequest) {
  if (request.id && !isValidId(request.id)) {
    throw new InvalidRequestException();
  }
  if (request.guestId && !isValidId(request.guestId)) {
    throw new InvalidRequestException();
  }
  if (
    request.externalReference &&
    !isValidExternalReference(request.externalReference)
  ) {
    throw new InvalidRequestException();
  }
  if (request.totalPrice && !isValidPrice(request.totalPrice)) {
    throw new InvalidRequestException();
  }
  if (request.paymentStatus && !isValidString(request.paymentStatus)) {
    throw new InvalidRequestException();
  }
  if (request.checkInDate && !isValidDate(request.checkInDate)) {
    throw new InvalidRequestException();
  }
  if (request.checkOutDate && !isValidDate(request.checkOutDate)) {
    throw new InvalidRequestException();
  }
}

export class UpdateReservationRequestDTO {
  id: number;
  guestId: number;
  externalReference: string;
  totalPrice: number;
  paymentStatus: string;
  checkInDate: string;
  checkOutDate: string;

  constructor(updateReservationRequest: {
    id: number;
    guestId: number;
    externalReference: string;
    totalPrice: number;
    paymentStatus: string;
    checkInDate: string;
    checkOutDate: string;
  }) {
     (this.id = updateReservationRequest.id),
      (this.guestId = updateReservationRequest.guestId),
      (this.externalReference = updateReservationRequest.externalReference),
      (this.totalPrice = updateReservationRequest.totalPrice),
      (this.paymentStatus = updateReservationRequest.paymentStatus),
      (this.checkInDate = updateReservationRequest.checkInDate),
      (this.checkOutDate = updateReservationRequest.checkOutDate);
  }

  public static fromRequest(
    request: UpdateReservationRequest
  ): UpdateReservationRequestDTO {
    validate(request);
    return new UpdateReservationRequestDTO({
      id: request.id == null ? null : Number(request.id),
      guestId: request.guestId == null ? null : Number(request.guestId),
      externalReference:
        request.externalReference == null
          ? null
          : String(request.externalReference),
      totalPrice:
        request.totalPrice == null ? null : Number(request.totalPrice),
      checkInDate:
        request.checkInDate == null ? null : String(request.checkInDate),
      checkOutDate:
        request.checkOutDate == null ? null : String(request.checkOutDate),
      paymentStatus: request.paymentStatus == null ? null : String(request),
    });
  }
}
