import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import {
  isValidId,
  isValidName,
  isValidString,
} from "@shared/validation-functions";

export interface UpdateRoomRequest {
  id: unknown;
  sizeId: unknown;
  name: unknown;
  availability?: unknown;
  price?: unknown;
}

function validate(request: UpdateRoomRequest): void {
  if (request.sizeId && !isValidId(request.sizeId)) {
    throw new InvalidRequestException();
  }
  if (request.id && !isValidId(request.id)) {
    throw new InvalidRequestException();
  }
  if (request.availability && !isValidString(request.availability)) {
    throw new InvalidRequestException();
  }
  if (request.name && !isValidName(request.name)) {
    throw new InvalidRequestException();
  }
}

export class UpdateRoomRequestDTO {
  id: number;
  sizeId: number;
  name: string;
  availability?: string;
  price?: number;
  constructor(updateRoomRequest: {
    id: number;
    sizeId: number;
    name: string;
    availability?: string;
    price?: number;
  }) {
    this.id = updateRoomRequest.id;
    this.name = updateRoomRequest.name;
    this.availability = updateRoomRequest.availability;
    this.price = updateRoomRequest.price;
  }

  public static fromRequest(request: UpdateRoomRequest): UpdateRoomRequestDTO {
    validate(request);
    return new UpdateRoomRequestDTO({
      id: request.id == null ? null : Number(request.id),
      sizeId: request.sizeId == null ? null : Number(request.sizeId),
      name: request.name == null ? null : String(request.name),
      availability:
        request.availability == null ? null : String(request.availability),
      price: request.price == null ? null : Number(request.price),
    });
  }
  u;
}
