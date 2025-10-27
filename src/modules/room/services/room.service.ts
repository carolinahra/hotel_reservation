import { RoomNotFoundException } from "@room/exceptions/room/room-not-found-exception";
import { Room } from "../models/room";
import { RoomRepository } from "../repositories/room.repository";
import { RoomTable } from "@shared/database-models/room.database-model";
import { Transaction } from "kysely";

interface GetRoom {
  id?: number;
  name?: string;
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

export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  public async get(getRoom: GetRoom, transaction?: Transaction<RoomTable>): Promise<Room | Room[]> {
    const rooms = await this.roomRepository.get(getRoom, transaction);

    if ((Array.isArray(rooms) && !rooms.length) || !rooms) {
      throw new RoomNotFoundException();
    }
    return rooms;
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
}
