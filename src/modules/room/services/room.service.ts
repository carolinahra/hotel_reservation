import { RoomNotFoundException } from "@room/exceptions/room/room-not-found-exception";
import { Room } from "../models/room";
import { RoomRepository } from "../repositories/room.repository";
import { RoomTable } from "@shared/database-models/room.database-model";
import { Transaction } from "kysely";

interface GetRoom {
  id?: number;
  name?: string;
}
interface GetManyRooms extends GetRoom {
  size?: string;
  limit?: number;
  offset?: number;
}
interface UpdateRoom {
  id: number;
  sizeId: number;
  name: string;
  availability?: string;
  price?: number;
}
interface InsertRoom {
  name: string;
  sizeId: number;
  price: number;
  availability: string;
}
interface DeleteRoom {
  id: number;
}
interface IsBookedRoomProps {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
}
export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  public async getOne(getRoom: GetRoom): Promise<Room> {
    const room = await this.roomRepository.get(getRoom);
    return Array.isArray(room) ? room.pop() : room;
  }
  public async getMany(getRoom: GetManyRooms): Promise<Room[]> {
    const rooms = await this.roomRepository.get(getRoom);
    return Array.isArray(rooms) ? rooms : [rooms];
  }
  public update(updateRoom: UpdateRoom): Promise<Room> {
    return this.roomRepository.update(updateRoom);
  }
  public insert(insertRoom: InsertRoom): Promise<Room> {
    return this.roomRepository.insert(insertRoom);
  }
  public delete(deleteRoom: DeleteRoom): Promise<boolean> {
    return this.roomRepository.delete(deleteRoom);
  }
  public isBookedRoom(props: IsBookedRoomProps): Promise<boolean> {
    return this.roomRepository.isBookedRoom(props);
  }
}
