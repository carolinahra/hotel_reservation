import { Repository } from "@shared/repositories/repository";
import { Kysely, Transaction } from "kysely";
import { Room } from "../models/room";
import { RoomTable } from "@shared/database-models/room.database-model";
import { ReservationDetailTable } from "@shared/database-models/reservation-detail.databasemodel";
import { ReservationTable } from "@shared/database-models/reservation.database-model";

export abstract class RoomRepository extends Repository {
  abstract get(
    getRoom: GetRoomConfig,
    transaction?: Transaction<any>
  ): Promise<Room | Room[]>;
  abstract update(updateRoomConfig: UpdateRoomConfig): Promise<Room>;
  abstract insert(insertRoomConfig: InsertRoomConfig): Promise<Room>;
  abstract delete(deleteRoomConfig: DeleteRoomConfig): Promise<boolean>;
  abstract isBookedRoom(isBookedRoomConfig: IsBookedRoomConfig): Promise<boolean>;
}

interface Database
  extends RoomTable,
    ReservationDetailTable,
    ReservationTable {}

interface GetRoomConfig {
  id?: number;
  name?: string;
  sizeId?: number;
  limit?: number;
  offset?: number;
}

interface UpdateRoomConfig {
  id: number;
  sizeId: number;
  name: string;
  availability?: string;
  price?: number;
}

interface InsertRoomConfig {
  name: string;
  sizeId: number;
  price: number;
  availability: string;
}
interface DeleteRoomConfig {
  id: number;
}

interface GetById {
  id: number;
}

interface IsBookedRoomConfig {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
}

export class KyselyRoomRepository extends RoomRepository {
  constructor(private readonly kysely: Kysely<Database>) {
    super();
  }

  public get(
    getRoom: GetRoomConfig,
    transaction?: Transaction<Database>
  ): Promise<Room | Room[]> {
    if (getRoom.id) {
      return this.getById({ id: getRoom.id }, transaction);
    }
    if (getRoom.name) {
      return this.getByName(getRoom);
    }
    if (getRoom.limit != null && getRoom.offset != null) {
      return this.getAll(getRoom);
    }
  }

  public isBookedRoom(config: IsBookedRoomConfig): Promise<boolean> {
    return this.kysely
      .selectFrom("Room as r")
      .innerJoin("Reservation_Detail as rd", "r.id", "rd.room_id")
      .innerJoin("Reservation as re", "rd.reservation_id", "re.id")
      .selectAll()
      .where("r.id", "=", config.roomId)
      .where("re.check_in_date", ">=", config.checkInDate)
      .where("re.check_in_date", "<=", config.checkOutDate)
      .where("re.check_out_date", ">=", config.checkInDate)
      .where("re.check_out_date", "<=", config.checkOutDate)
      .executeTakeFirst()
      .then((result) => result !== undefined);
  }

  public update(updateRoomConfig: UpdateRoomConfig): Promise<Room> {
    return this.kysely
      .updateTable("Room")
      .set({
        name: updateRoomConfig.name,
        room_size_id: updateRoomConfig.sizeId,
        availability: updateRoomConfig.availability,
        price: updateRoomConfig.price,
      })
      .where("Room.name", "=", updateRoomConfig.name)
      .execute()
      .then(() => this.getByName({ name: updateRoomConfig.name }));
  }

  public insert(insertRoomConfig: InsertRoomConfig): Promise<Room> {
    return this.kysely
      .insertInto("Room")
      .values({
        name: insertRoomConfig.name,
        room_size_id: insertRoomConfig.sizeId,
        price: insertRoomConfig.price,
        availability: insertRoomConfig.availability,
      })
      .executeTakeFirst()
      .then((result) => this.getById({ id: Number(result.insertId) }));
  }

  public delete(deleteRoomConfig: DeleteRoomConfig): Promise<boolean> {
    return this.kysely
      .deleteFrom("Room")
      .where("Room.id", "=", deleteRoomConfig.id)
      .executeTakeFirst()
      .then(() => true);
  }

  private getById(
    config: GetById,
    transaction?: Transaction<Database>
  ): Promise<Room> {
    return (transaction || this.kysely)
      .selectFrom("Room")
      .selectAll() //
      .where("Room.id", "=", config.id)
      .executeTakeFirstOrThrow()
      .then(
        (room) =>
          new Room({
            id: room.id,
            name: room.name,
            room_size_id: room.room_size_id,
            price: room.price,
            availability: room.availability,
            created_at: room.created_at,
            updated_at: room.updated_at,
          })
      );
  }

  private getAll(getRoomConfig: GetRoomConfig): Promise<Room[]> {
    return this.kysely
      .selectFrom("Room")
      .selectAll()
      .limit(getRoomConfig.limit)
      .offset(getRoomConfig.offset)
      .execute()
      .then((rooms) => {
        return rooms.map((room) => new Room(room));
      });
  }

  private getByName(getRoomConfig: GetRoomConfig): Promise<Room> {
    return this.kysely
      .selectFrom("Room")
      .selectAll()
      .where("Room.name", "=", getRoomConfig.name)
      .limit(getRoomConfig.limit)
      .offset(getRoomConfig.offset)
      .executeTakeFirst()
      .then(
        (room) =>
          new Room({
            id: room.id,
            name: room.name,
            room_size_id: room.room_size_id,
            price: room.price,
            availability: room.availability,
            created_at: room.created_at,
            updated_at: room.updated_at,
          })
      );
  }

  private getBysizeId(getRoomConfig: GetRoomConfig): Promise<Room> {
    return this.kysely
      .selectFrom("Room")
      .selectAll() //
      .where("Room.room_size_id", "=", getRoomConfig.sizeId)
      .executeTakeFirst()
      .then(
        (room) =>
          new Room({
            id: room.id,
            name: room.name,
            room_size_id: room.room_size_id,
            price: room.price,
            availability: room.availability,
            created_at: room.created_at,
            updated_at: room.updated_at,
          })
      );
  }
}
