import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import { areValidIds, isValidDate } from "@shared/validation-functions";

export interface GetBookingPriceRequest {
  extraServicesIDs?: unknown;
  roomsIDs: unknown;
  checkInDate: unknown;
  checkOutDate: unknown;
}

function validate(request: GetBookingPriceRequest): void {
  if (
    Array.isArray(request.extraServicesIDs) &&
    request.extraServicesIDs.length > 0 &&
    !areValidIds(request.extraServicesIDs)
  ) {
    throw new InvalidRequestException();
  }

  if (request.roomsIDs && !areValidIds(request.roomsIDs)) {
    throw new InvalidRequestException();
  }
  if (request.checkInDate && !isValidDate(request.checkInDate)) {
    throw new InvalidRequestException();
  }
  if (request.checkOutDate && !isValidDate(request.checkOutDate)) {
    throw new InvalidRequestException();
  }
}

export class GetBookingPriceRequestDTO {
  extraServicesIDs?: number[];
  roomsIDs: number[];
  checkInDate: string;
  checkOutDate: string;
  constructor(InsertRoomRequest: {
    extraServicesIDs?: number[];
    roomsIDs: number[];
    checkInDate: string;
    checkOutDate: string;
  }) {
    this.roomsIDs = InsertRoomRequest.roomsIDs;
    this.extraServicesIDs = InsertRoomRequest.extraServicesIDs;
    this.checkInDate = InsertRoomRequest.checkInDate;
    this.checkOutDate = InsertRoomRequest.checkOutDate;
  }

  public static fromRequest(
    request: GetBookingPriceRequest
  ): GetBookingPriceRequestDTO {
    const roomsIDs =
      typeof request.roomsIDs === "string" && request.roomsIDs.trim()
        ? request.roomsIDs.split(",").map((id) => Number(id))
        : [];

    const extraServicesIDs =
      typeof request.extraServicesIDs === "string" &&
      request.extraServicesIDs.trim() !== ""
        ? request.extraServicesIDs.split(",").map((id) => Number(id))
        : [];
    const checkInDate = String(request.checkInDate);
    const checkOutDate = String(request.checkOutDate);
    validate({ roomsIDs, extraServicesIDs, checkInDate, checkOutDate });
    return new GetBookingPriceRequestDTO({
      roomsIDs,
      extraServicesIDs,
      checkInDate,
      checkOutDate,
    });
  }
}
