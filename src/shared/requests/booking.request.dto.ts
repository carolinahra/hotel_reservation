import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import {
  areValidExtraServices,
  areValidIds,
  isValidDate,
  isValidId,
} from "@shared/validation-functions";

export interface ExtraServiceBookingProps {
  roomId: number;
  extraServiceId: number;
}

export interface BookingRequest {
  guestId: number;
  roomsId: number[];
  extraServices?: ExtraServiceBookingProps[];
  checkInDate: string;
  checkOutDate: string;
}

function validate(request: BookingRequest): void {
  if (request.extraServices && !areValidExtraServices(request.extraServices)) {
    throw new InvalidRequestException();
  }
  if (request.guestId && !isValidId(request.guestId)) {
    throw new InvalidRequestException();
  }
  if (request.roomsId && !areValidIds(request.roomsId)) {
    throw new InvalidRequestException();
  }
  if (request.checkInDate && !isValidDate(request.checkInDate)) {
    throw new InvalidRequestException();
  }
  if (request.checkOutDate && !isValidDate(request.checkOutDate)) {
    throw new InvalidRequestException();
  }
}

export class BookingRequestDTO {
  guestId: number;
  roomsId: number[];
  extraServices?: ExtraServiceBookingProps[];
  checkInDate: string;
  checkOutDate: string;
  constructor(insertRoomRequest: {
    guestId: number;
    roomsId: number[];
    extraServices?: ExtraServiceBookingProps[];
    checkInDate: string;
    checkOutDate: string;
  }) {
    this.guestId = insertRoomRequest.guestId;
    this.roomsId = insertRoomRequest.roomsId;
    this.extraServices = insertRoomRequest.extraServices;
    this.checkInDate = insertRoomRequest.checkInDate;
    this.checkOutDate = insertRoomRequest.checkOutDate;
  }

  public static fromRequest(request: BookingRequest): BookingRequestDTO {
    validate(request);
    return new BookingRequestDTO({
      guestId: request.guestId == null ? null : Number(request.guestId),
      roomsId: request.roomsId.map((roomId) => Number(roomId)),
      extraServices: request.extraServices,
      checkInDate:
        request.checkInDate == null ? null : String(request.checkInDate),
      checkOutDate:
        request.checkOutDate == null ? null : String(request.checkOutDate),
    });
  }
}
