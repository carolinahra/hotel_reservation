import {
  DeleteRoomSizeResponse,
  GetRoomSizeResponse,
  InsertRoomSizeResponse,
  UpdateRoomSizeResponse,
} from "@room/response/room-size.response";
import { DeleteRoomSizeRequestDTO } from "../requests/room-size/delete-room-size.request.dto";
import { GetRoomSizeRequestDTO } from "../requests/room-size/get-room-size.request.dto";
import { InsertRoomSizeRequestDTO } from "../requests/room-size/insert-room-size.request.dto";
import { UpdateRoomSizeRequestDTO } from "../requests/room-size/update-room-size.request.dto";
import { RoomSizeService } from "../services/room-size.service";
import { ErrorResponse } from "@shared/exceptions/error-response";
import { ExceptionService } from "@shared/services/exception.service";

export class RoomSizeController {
  constructor(
    private readonly roomSizeService: RoomSizeService,
    private readonly exceptionService: ExceptionService
  ) {}

  public async get(
    request: GetRoomSizeRequestDTO
  ): Promise<GetRoomSizeResponse | GetRoomSizeResponse[] | ErrorResponse> {
    try {
      if (request.id || request.name) {
        const roomSize = await this.roomSizeService.getOne(request);
        return {
          id: roomSize.id,
          name: roomSize.name,
          size: roomSize.size,
        };
      }
      const roomSizes = await this.roomSizeService.getMany(request);
      return roomSizes.map((roomSize) => {
        return {
          id: roomSize.id,
          name: roomSize.name,
          size: roomSize.size,
        };
      });
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async update(
    request: UpdateRoomSizeRequestDTO
  ): Promise<UpdateRoomSizeResponse | ErrorResponse> {
    try {
      const roomSize = await this.roomSizeService.update(request);
      return {
        id: roomSize.id,
        name: roomSize.name,
        size: roomSize.size,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async insert(
    request: InsertRoomSizeRequestDTO
  ): Promise<InsertRoomSizeResponse | ErrorResponse> {
    try {
      const roomSize = await this.roomSizeService.insert(request);
      return {
        id: roomSize.id,
        name: roomSize.name,
        size: roomSize.size,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async delete(
    request: DeleteRoomSizeRequestDTO
  ): Promise<DeleteRoomSizeResponse | ErrorResponse> {
    try {
      const isDeletedRoomSize = await this.roomSizeService.delete(request);
      return { isDeletedRoomSize };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
}
