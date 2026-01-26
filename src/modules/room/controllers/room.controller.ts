import { ExceptionService } from "@shared/services/exception.service";
import { Room } from "../models/room";
import { DeleteRoomRequestDTO } from "../requests/room/delete-room.request.dto";
import { GetRoomRequestDTO } from "../requests/room/get-room.request.dto";
import { InsertRoomRequestDTO } from "../requests/room/insert-room.request.dto";
import { UpdateRoomRequestDTO } from "../requests/room/update-room.request.dto";
import { RoomService } from "../services/room.service";
import {
  DeleteRoomResponse,
  GetRoomResponse,
  InsertRoomResponse,
  UpdateRoomResponse,
} from "@room/response/room.response";
import { ErrorResponse } from "@shared/exceptions/error-response";

export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly exceptionService: ExceptionService
  ) {}

  public async get(
    request: GetRoomRequestDTO
  ): Promise<GetRoomResponse | GetRoomResponse[] | ErrorResponse> {
    try {
      if (request.id || request.name) {
        const room = await this.roomService.getOne(request);
        return {
          id: room.id,
          name: room.name,
          room_size_id: room.room_size_id,
          price: room.price,
          availability: room.availability,
          created_at: room.created_at,
          updated_at: room.updated_at,
        };
      }
      const rooms = await this.roomService.getMany(request);
      return rooms.map((room) => {
        return {
          id: room.id,
          name: room.name,
          room_size_id: room.room_size_id,
          price: room.price,
          availability: room.availability,
          created_at: room.created_at,
          updated_at: room.updated_at,
        };
      });
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async update(
    request: UpdateRoomRequestDTO
  ): Promise<UpdateRoomResponse | ErrorResponse> {
    try {
      const room = await this.roomService.update(request);
      return {
        id: room.id,
        name: room.name,
        room_size_id: room.room_size_id,
        price: room.price,
        availability: room.availability,
        created_at: room.created_at,
        updated_at: room.updated_at,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async insert(
    request: InsertRoomRequestDTO
  ): Promise<InsertRoomResponse | ErrorResponse> {
    try {
      const room = await this.roomService.insert(request);
      return {
        id: room.id,
        name: room.name,
        room_size_id: room.room_size_id,
        price: room.price,
        availability: room.availability,
        created_at: room.created_at,
        updated_at: room.updated_at,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async delete(
    request: DeleteRoomRequestDTO
  ): Promise<DeleteRoomResponse | ErrorResponse> {
    try {
      const isDeletedRoom = await this.roomService.delete(request);
      return { isDeletedRoom };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
}
