import { Guest } from "@guest/models/guest";
import { Reservation } from "@reservation/models/reservation";
import { Room } from "@room/models/room";
import { RoomSize } from "@room/models/room-size";
import { Session } from "@session/models/session";
import { GuestTable } from "@shared/database-models/guest.database-model";
import { ReservationDetailTable } from "@shared/database-models/reservation-detail.databasemodel";
import { ReservationTable } from "@shared/database-models/reservation.database-model";
import { RoomSizeTable } from "@shared/database-models/room-size.database-model";
import { RoomTable } from "@shared/database-models/room.database-model";
import { SessionTable } from "@shared/database-models/session.database-model";
import { Kysely } from "kysely";

interface DatabaseDb
  extends SessionTable,
    GuestTable,
    RoomTable,
    RoomSizeTable,
    ReservationTable,
    ReservationDetailTable {}

export abstract class DatabaseAsker {
  abstract aboutSession(token: string): {
    exists(): Promise<boolean>;
    get(): Promise<Session>;
  };

  abstract aboutRoom(name: string): {
    exists(): Promise<boolean>;
    get(): Promise<Room>;
  };
  abstract aboutReservation(externalReference: string): {
    exists(): Promise<boolean>;
    get(): Promise<Reservation>;
  };

  abstract createRoom(room: Room): Promise<void>;
  abstract createSession(session: Session): Promise<void>;
  abstract createGuest(guest: Guest): Promise<void>;
  abstract createRoomSize(roomSize: RoomSize): Promise<void>;

  abstract clean(): Promise<void>;
  abstract close(): Promise<void>;
}

export class KyselyDatabaseAsker extends DatabaseAsker {
  constructor(private readonly kysely: Kysely<DatabaseDb>) {
    super();
  }

  async clean(): Promise<void> {
    await this.kysely.deleteFrom("Session").execute();
    await this.kysely.deleteFrom("Reservation_Detail").execute();
    await this.kysely.deleteFrom("Reservation").execute();
    await this.kysely.deleteFrom("Guest").execute();
    await this.kysely.deleteFrom("Room").execute();
    await this.kysely.deleteFrom("Room_Size").execute();
  }

  async close(): Promise<void> {
    await this.kysely.destroy();
  }

  aboutSession(token: string): {
    exists(): Promise<boolean>;
    get(): Promise<Session>;
  } {
    const session = this.kysely
      .selectFrom("Session")
      .selectAll()
      .where("Session.token", "=", token)
      .executeTakeFirst();

    return {
      exists: async () => {
        const res = await session;
        return !!res;
      },
      get: async () => {
        const res = await session;
        return new Session(res);
      },
    };
  }

  aboutRoom(name: string): {
    exists(): Promise<boolean>;
    get(): Promise<Room>;
  } {
    const room = this.kysely
      .selectFrom("Room")
      .selectAll()
      .where("Room.name", "=", name)
      .executeTakeFirst();
    return {
      exists: async () => {
        const res = await room;
        return !!res;
      },
      get: async () => {
        const res = await room;
        return new Room(res);
      },
    };
  }

  async createRoom(room: Room): Promise<void> {
    await this.kysely
      .insertInto("Room")
      .values({
        id: room.id,
        name: room.name,
        price: room.price,
        availability: room.availability,
        room_size_id: room.room_size_id,
      })
      .execute()
      .catch((error) => console.log(error));
  }
  async createSession(session: Session): Promise<void> {
    await this.kysely
      .insertInto("Session")
      .values({
        guest_id: session.guest_id,
        token: session.token,
        session_extension_minutes: session.session_extension_minutes,
      })
      .execute()
      .catch((error) => console.log(error));
  }

  async createGuest(guest: Guest): Promise<void> {
    await this.kysely
      .insertInto("Guest")
      .values({
        id: guest.id,
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
        password: guest.password,
      })
      .execute()
      .catch((error) => console.log(error));
  }

  async createRoomSize(roomSize: RoomSize): Promise<void> {
    await this.kysely
      .insertInto("Room_Size")
      .values({
        id: roomSize.id,
        name: roomSize.name,
        size: roomSize.size,
      })
      .execute()
      .catch((error) => console.log(error));
  }

  aboutReservation(externalReference: string): {
    exists(): Promise<boolean>;
    get(): Promise<Reservation>;
  } {
    const reservation = this.kysely
      .selectFrom("Reservation")
      .selectAll()
      .where("Reservation.external_reference", "=", externalReference)
      .executeTakeFirst();
    return {
      exists: async () => {
        const res = await reservation;
        return !!res;
      },
      get: async () => {
        const res = await reservation;
        return new Reservation(res);
      },
    };
  }
}
