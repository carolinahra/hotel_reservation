import { describe, it, mock } from "node:test";
import { BookingService } from "./booking.service";
import {
  DummyDriver,
  Kysely,
  MysqlDialect,
  NoopQueryExecutor,
  Transaction,
  TransactionBuilder,
} from "kysely";
import { GuestService } from "@guest/services/guest.service";
import { RoomService } from "@room/services/room.service";
import { ExtraServiceService } from "@extraService/services/extra-service.service";
import { ReservationService } from "@reservation/services/reservation.service";
import { ReservationDetailService } from "@reservation/services/reservation-detail.service";
import { Room, RoomProps } from "@room/models/room";
import { Guest, GuestProps } from "@guest/models/guest";
import {
  ExtraService,
  ExtraServiceProps,
} from "@extraService/models/extra-service";
import { Reservation, ReservationProps } from "@reservation/models/reservation";
import { GuestRepository } from "@guest/repository/guest.repository";
import { RoomRepository } from "@room/repositories/room.repository";
import {
  InsertReservationConfig,
  ReservationRepository,
} from "@reservation/repositories/reservation.repository";
import { ExtraServiceRepository } from "@extraService/repositories/extra-service.repository";
import { ReservationDetailRepository } from "@reservation/repositories/reservation-detail.repository";
import {
  ReservationDetail,
  ReservationDetailProps,
} from "@reservation/models/reservation-detail";
import assert from "assert";
import { Pool } from "mysql2";
import { PoolConnection } from "node_modules/mysql2/typings/mysql/lib/PoolConnection";
import { GuestNotFoundException } from "@guest/exceptions/guest-not-found-exception";
import { RoomANotAvailableException } from "@room/exceptions/room/room-not-available.exception";

const fakeRoomsProps: RoomProps[] = [
  {
    id: 1,
    name: "Angelina Suite",
    room_size_id: 3,
    price: 150,
    availability: "available",
    created_at: "12-03-2022",
    updated_at: "12-03-20222",
  },
  {
    id: 2,
    name: "Elizabeth Suite",
    room_size_id: 3,
    price: 100,
    availability: "available",
    created_at: "2022-03-12",
    updated_at: "2022-03-12",
  },
];
const fakeGuestProps: GuestProps = {
  id: 1,
  name: "Luis Perez",
  email: "luisperez@email.com",
  phone: "7649264",
};
const fakeGuest = new Guest(fakeGuestProps);

const fakeExtraServicesProps: ExtraServiceProps = {
  id: 1,
  name: "Breakfast",
  price: 20,
};

const fakeReservationProps: ReservationProps = {
  id: 1,
  guest_id: 1,
  external_reference: "64y3uhjbend",
  total_price: 1080,
  payment_status: "pending",
  check_in_at: "2025-12-20",
  check_out_at: "2025-12-24",
  created_at: "2025-10-28",
  updated_at: "2025-10-28",
};
const fakeReservation = new Reservation(fakeReservationProps);

const fakeReservationDetailProps: ReservationDetailProps = {
  id: 1,
  reservation_id: 1,
  room_id: 1,
  extra_service_id: 1,
};
const fakeReservationDetail = new ReservationDetail(fakeReservationDetailProps);

const fakeExtraServiceProps = {
  roomId: 1,
  extraServiceId: 1,
};
const fakeExtraService = new ExtraService(fakeExtraServicesProps);

const fakeBookingProps = {
  guestId: 1,
  roomsId: [1, 2],
  extraServices: [fakeExtraServiceProps],
  checkInDate: "2025-12-20",
  checkOutDate: "2025-12-24",
};

class PoolMock implements Partial<Pool> {
  getConnection(
    callback: (
      err: NodeJS.ErrnoException | null,
      connection: PoolConnection
    ) => any
  ): void {}
  end(
    callback?: (err: NodeJS.ErrnoException | null, ...args: any[]) => any
  ): void {}
}
const dialect = new MysqlDialect({
  pool: new PoolMock(),
});

class KyselyMock extends Kysely<any> {
  constructor() {
    super({
      dialect,
    });
  }

  transaction(): TransactionBuilder<any> {
    return new TransactionBuilderMock({} as any);
  }
}

class TransactionBuilderMock extends TransactionBuilder<any> {
  execute<T>(callback: (trx: Transaction<any>) => Promise<T>): Promise<T> {
    return callback(
      new Transaction({
        dialect,
        config: {
          dialect,
        },
        driver: new DummyDriver(),
        executor: new NoopQueryExecutor(),
      })
    );
  }
}

class GuestRepositoryMock extends GuestRepository {
  async get(): Promise<Guest | Guest[]> {
    return [];
  }
  async update(): Promise<Guest> {
    return;
  }
  async insert(): Promise<Guest> {
    return;
  }
  async delete(): Promise<boolean> {
    return;
  }
}

function getGuestService(returnValue: any) {
  return class GuestServiceMock extends GuestService {
    override getOne(): Promise<Guest> {
      return Promise.resolve(returnValue);
    }
  };
}

class RoomRepositoryMock extends RoomRepository {
  async get(): Promise<Room | Room[]> {
    return [];
  }
  async update(): Promise<Room> {
    return;
  }
  async insert(): Promise<Room> {
    return;
  }
  async delete(): Promise<boolean> {
    return;
  }

  async isBookedRoom(): Promise<boolean> {
    return;
  }
}

function getRoomService(rooms: RoomProps[], isBookedRoom: boolean) {
  let counter = 0;
  return class RoomServiceMock extends RoomService {
    override async getOne() {
      const room = new Room(rooms[counter]);
      counter++;
      return room;
    }
    override isBookedRoom(): Promise<boolean> {
      return Promise.resolve(isBookedRoom);
    }
  };
}

class ReservationRepositoryMock extends ReservationRepository {
  get(): Promise<Reservation | Reservation[]> {
    return;
  }
  delete(): Promise<boolean> {
    return;
  }
  insert(): Promise<Reservation> {
    return;
  }
  update(): Promise<Reservation> {
    return;
  }
}

function getReservationService(returnValue: any) {
  return class ReservationServiceMock extends ReservationService {
    insert = mock.fn(() => Promise.resolve(returnValue));
  };
}

class ExtraServiceRepositoryMock extends ExtraServiceRepository {
  get(): Promise<ExtraService | ExtraService[]> {
    return;
  }
  delete(): Promise<boolean> {
    return;
  }
  insert(): Promise<ExtraService> {
    return;
  }
  update(): Promise<ExtraService> {
    return;
  }
}
function getExtraServiceService(returnValue: any) {
  return class ExtraServiceServiceMock extends ExtraServiceService {
    getOne(): Promise<ExtraService> {
      return Promise.resolve(returnValue);
    }
  };
}
class ReservationDetailRepositoryMock extends ReservationDetailRepository {
  get(): Promise<ReservationDetail | ReservationDetail[]> {
    return;
  }
  delete(): Promise<boolean> {
    return;
  }
  insert(): Promise<ReservationDetail> {
    return;
  }
  update(): Promise<ReservationDetail> {
    return;
  }
}

function getReservationDetailService(returnValue: any) {
  return class ReservationDetailServiceMock extends ReservationDetailService {
    insert(): Promise<ReservationDetail> {
      return Promise.resolve(returnValue);
    }
  };
}

describe("Booking Service", () => {
  it("should return a Reservation Object", () => {
    const kyselyMock = new KyselyMock();
    const roomRepositoryMock = new RoomRepositoryMock();
    const roomServiceMock = new (getRoomService(fakeRoomsProps, false))(
      roomRepositoryMock
    );

    const mockGuestRepository = new GuestRepositoryMock();
    const mockGuestService = new (getGuestService(fakeGuest))(
      mockGuestRepository
    );

    const reservationRepositoryMock = new ReservationRepositoryMock();
    const reservationServiceMock = new (getReservationService(fakeReservation))(
      reservationRepositoryMock
    );
    const extraServiceRepositoryMock = new ExtraServiceRepositoryMock();
    const extraServiceServiceMock = new (getExtraServiceService(
      fakeExtraService
    ))(extraServiceRepositoryMock);

    const reservationDetailRepositoryMock =
      new ReservationDetailRepositoryMock();
    const reservationDetailServiceMock = new (getReservationDetailService(
      fakeReservationDetail
    ))(reservationDetailRepositoryMock);

    const bookingService = new BookingService(
      kyselyMock,
      mockGuestService,
      roomServiceMock,
      extraServiceServiceMock,
      reservationServiceMock,
      reservationDetailServiceMock
    );

    return bookingService
      .handleReservation(fakeBookingProps)
      .then((reservation) => {
        const reservationArgs =
          reservationServiceMock.insert.mock.calls.pop().arguments;
        const insertReservationProps: InsertReservationConfig =
          reservationArgs.shift();

        assert.deepEqual(
          {
            guest_id: insertReservationProps.guestId,
            total_price: insertReservationProps.totalPrice,
            payment_status: insertReservationProps.paymentStatus,
            check_in_at: insertReservationProps.checkInDate,
            check_out_at: insertReservationProps.checkOutDate,
          },
           {
            guest_id: fakeReservationProps.guest_id,
            total_price: fakeReservationProps.total_price,
            payment_status: fakeReservationProps.payment_status,
            check_in_at: fakeReservationProps.check_in_at,
            check_out_at: fakeReservationProps.check_out_at,
          },
        );
      });
  });

  it("should throw a GuessNotFoundError", async () => {
    const kyselyMock = new KyselyMock();
    const roomRepositoryMock = new RoomRepositoryMock();
    const roomServiceMock = new (getRoomService(fakeRoomsProps, false))(
      roomRepositoryMock
    );

    const mockGuestRepository = new GuestRepositoryMock();
    const mockGuestService = new (getGuestService(null))(mockGuestRepository);

    const reservationRepositoryMock = new ReservationRepositoryMock();
    const reservationServiceMock = new (getReservationService(fakeReservation))(
      reservationRepositoryMock
    );

    const extraServiceRepositoryMock = new ExtraServiceRepositoryMock();
    const extraServiceServiceMock = new (getExtraServiceService(
      fakeExtraService
    ))(extraServiceRepositoryMock);

    const reservationDetailRepositoryMock =
      new ReservationDetailRepositoryMock();
    const reservationDetailServiceMock = new (getReservationDetailService(
      fakeReservationDetail
    ))(reservationDetailRepositoryMock);

    const bookingService = new BookingService(
      kyselyMock,
      mockGuestService,
      roomServiceMock,
      extraServiceServiceMock,
      reservationServiceMock,
      reservationDetailServiceMock
    );
    await assert.rejects(
      () => bookingService.handleReservation(fakeBookingProps),
      GuestNotFoundException
    );
  });

  it("should throw a RoomNotAvailable", async () => {
    const kyselyMock = new KyselyMock();
    const roomRepositoryMock = new RoomRepositoryMock();
    const roomServiceMock = new (getRoomService(fakeRoomsProps, true))(
      roomRepositoryMock
    );

    const mockGuestRepository = new GuestRepositoryMock();
    const mockGuestService = new (getGuestService(fakeGuest))(
      mockGuestRepository
    );

    const reservationRepositoryMock = new ReservationRepositoryMock();
    const reservationServiceMock = new (getReservationService(fakeReservation))(
      reservationRepositoryMock
    );

    const extraServiceRepositoryMock = new ExtraServiceRepositoryMock();
    const extraServiceServiceMock = new (getExtraServiceService(
      fakeExtraService
    ))(extraServiceRepositoryMock);

    const reservationDetailRepositoryMock =
      new ReservationDetailRepositoryMock();
    const reservationDetailServiceMock = new (getReservationDetailService(
      fakeReservationDetail
    ))(reservationDetailRepositoryMock);

    const bookingService = new BookingService(
      kyselyMock,
      mockGuestService,
      roomServiceMock,
      extraServiceServiceMock,
      reservationServiceMock,
      reservationDetailServiceMock
    );
    await assert.rejects(
      () => bookingService.handleReservation(fakeBookingProps),
      RoomANotAvailableException
    );
  });
});
