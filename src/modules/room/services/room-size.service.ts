import { RoomSize } from "../models/room-size";
import { RoomSizeRepository } from "../repositories/room-size.repository";

interface GetRoomSize {
  id?: number;
  name?: string;
}

interface GetManyRoomSizes extends GetRoomSize {
  size?: string;
  limit?: number;
  offset?: number;
}
interface UpdateRoomSize {
  name: string;
  size?: string;
  newName?: string;
}
interface InsertRoomSize {
  name: string;
  size: string;
}
interface DeleteRoomSize {
  name: string;
}

export class RoomSizeService {
  constructor(private readonly roomSizeRepository: RoomSizeRepository) {}

  public async getOne(getRoomSize: GetRoomSize): Promise<RoomSize> {
    const room = await this.roomSizeRepository.get(getRoomSize);
    return Array.isArray(room) ? room.pop() : room;
  }
  public async getMany(getRoomSize: GetManyRoomSizes): Promise<RoomSize[]> {
    const rooms = await this.roomSizeRepository.get(getRoomSize);
    return Array.isArray(rooms) ? rooms : [rooms];
  }
  public update(updateRoomSize: UpdateRoomSize): Promise<RoomSize> {
    return this.roomSizeRepository.update(updateRoomSize);
  }
  public insert(insertRoomSize: InsertRoomSize): Promise<RoomSize> {
    return this.roomSizeRepository.insert(insertRoomSize);
  }
  public delete(deleteRoomSize: DeleteRoomSize): Promise<boolean> {
    return this.roomSizeRepository.delete(deleteRoomSize);
  }
}
