import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import {
  areValidExtraServices,
  areValidIds,
  isValidDate,
  isValidId,
} from "@shared/validation-functions";

export interface GetBookingPriceRequest {
  extraServicesIDs: number[];
  roomsIDs: number[];
  checkInDate: string;
  checkOutDate: string;
}

function validate(request: GetBookingPriceRequest): void {
  if (request.extraServicesIDs && !areValidIds(request.extraServicesIDs)) {
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
  extraServicesIDs: number[];
  roomsIDs: number[];
  checkInDate: string;
  checkOutDate: string;
  constructor(InsertRoomRequest: {
    extraServicesIDs: number[];
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
    validate(request);
    return new GetBookingPriceRequestDTO({
      roomsIDs: request.roomsIDs.map((roomId) => Number(roomId)),
      extraServicesIDs: request.extraServicesIDs.map((extraServiceID) =>
        Number(extraServiceID)
      ),
      checkInDate:
        request.checkInDate == null ? null : String(request.checkInDate),
      checkOutDate:
        request.checkOutDate == null ? null : String(request.checkOutDate),
    });
  }
}
