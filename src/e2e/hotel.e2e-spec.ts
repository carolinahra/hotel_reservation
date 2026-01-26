import { after, afterEach, before, beforeEach, describe, it } from "node:test";
import { HotelHarness } from "./utils/hotel.harness";
import { Guest } from "@guest/models/guest";
import assert from "assert";
import { hashPassword } from "@shared/password/password";
import { LoginResponse } from "@shared/controllers/login.controller";
import { Room } from "@room/models/room";
import { InsertRoomResponse } from "@room/response/room.response";
import { Session } from "@session/models/session";
import { RoomSize } from "@room/models/room-size";
import { HandleBookingResponse } from "@shared/responses/booking.response";
import { EmailServiceMock } from "./utils/email.service.mock";

const harness = new HotelHarness();
describe("Hotel e2e", () => {
  before(async () => {
    await harness.setup();
  });

  beforeEach(async () => {
    await harness.databaseAsker.clean();
  });

  it("should create session when credentials are valid", async () => {
    // Arrange
    const asker = harness.databaseAsker;
    const email = "test-manuel@email.es";
    const password = "2345";

    await asker.createGuest(
      new Guest({
        email,
        password: hashPassword(password),
        id: 113123,
        name: "test",
        phone: "123123",
      }),
    );

    // Act
    const res: LoginResponse = await fetch("http://127.0.0.1:3000/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res.json());

    // Assert
    const aboutSession = asker.aboutSession(res.token);
    assert.equal(await aboutSession.exists(), true);
  });

  it("should not create a session when credentials aren't valid", async () => {
    const asker = harness.databaseAsker;
    const email = "test-manuel@email.es";
    const password = "2345";
    await asker.createGuest(
      new Guest({
        email,
        password: hashPassword(password),
        id: 113123,
        name: "test",
        phone: "123123",
      }),
    );

    const res: LoginResponse = await fetch("http://127.0.0.1:3000/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: "1",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res.json());

    const aboutSession = asker.aboutSession(res.token);
    assert.equal(await aboutSession.exists(), false);
  });

  it("should insert a room", async () => {
    const asker = harness.databaseAsker;
    const guest = new Guest({
      email: "hotelbookingtest@email.com",
      password: hashPassword("1234"),
      id: 111,
      name: "test",
      phone: "123123",
    });

    await asker.createGuest(guest);
    const session = new Session({
      id: 122,
      guest_id: 111,
      token: "123234321",
      session_extension_minutes: 30,
      created_at: "",
      updated_at: "",
    });
    await asker.createSession(session);

    const roomSize = new RoomSize({
      id: 1222,
      name: "Master Suite",
      size: "Double",
    });
    await asker.createRoomSize(roomSize);

    const res: InsertRoomResponse = await fetch("http://127.0.0.1:3000/rooms", {
      method: "POST",
      body: JSON.stringify({
        name: "test hotel room",
        sizeId: 1222,
        price: 120,
        availability: "available",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        token: session.token,
      },
    }).then((res) => res.json());

    const aboutRoom = asker.aboutRoom(res.name);
    assert.equal(await aboutRoom.exists(), true);
  });

  it("should not insert a room if name is missing", async () => {
    const asker = harness.databaseAsker;
    const guest = new Guest({
      email: "hotelbookingtest@email.com",
      password: hashPassword("1234"),
      id: 112,
      name: "test",
      phone: "123123",
    });

    await asker.createGuest(guest);
    const session = new Session({
      id: 1222,
      guest_id: 112,
      token: "123234321",
      session_extension_minutes: 30,
      created_at: "",
      updated_at: "",
    });
    await asker.createSession(session);
    const res: InsertRoomResponse = await fetch("http://127.0.0.1:3000/rooms", {
      method: "POST",
      body: JSON.stringify({
        roomSizeId: 1,
        price: 120,
        availability: "available",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        token: session.token,
      },
    }).then((res) => res.json());

    const aboutRoom = asker.aboutRoom(res.name);
    assert.equal(await aboutRoom.exists(), false);
  });

  it.only("should insert a reservation", async () => {
    const asker = harness.databaseAsker;
    const guest = new Guest({
      email: "hotelbookingtest@email.com",
      password: hashPassword("1234"),
      id: 111,
      name: "test",
      phone: "123123",
    });

    await asker.createGuest(guest);
    const session = new Session({
      id: 122,
      guest_id: 111,
      token: "123234321",
      session_extension_minutes: 30,
      created_at: "",
      updated_at: "",
    });
    await asker.createSession(session);

    const roomSize = new RoomSize({
      id: 1222,
      name: "Master Suite",
      size: "Double",
    });
    await asker.createRoomSize(roomSize);

    const room = new Room({
      id: 1212,
      name: "test hotel room",
      room_size_id: 1222,
      price: 120,
      availability: "available",
      created_at: "",
      updated_at: "",
    });
    await asker.createRoom(room);

    const res: HandleBookingResponse = await fetch(
      "http://127.0.0.1:3000/booking",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          token: session.token,
        },
        body: JSON.stringify({
          guestId: guest.id,
          roomsId: [room.id],
          checkInDate: "2026-01-23",
          checkOutDate: "2026-01-25",
        }),
      },
    ).then((res) => res.json());

    const aboutReservation = asker.aboutReservation(res.external_reference);
    const expectedCheckIn = "2026-01-23T13:00:00.000Z";
    const expectedCheckOut = "2026-01-25T09:00:00.000Z";
    assert.equal(await aboutReservation.exists(), true);

    assert.equal(res.guest_id, guest.id);
    assert.equal(res.total_price, 240);
    assert.equal(res.check_in_at, expectedCheckIn);
    assert.equal(res.check_out_at, expectedCheckOut);
    const emailServiceMock: EmailServiceMock = harness.container
      .emailService as EmailServiceMock;
    assert.equal(emailServiceMock.entryInputs.length > 0, true);
    assert.equal(emailServiceMock.entryInputs[0].to, guest.email);
  });

  it("should not insert a reservation when guestId is missing", async () => {
    const asker = harness.databaseAsker;
    const guest = new Guest({
      email: "hotelbookingtest@email.com",
      password: hashPassword("1234"),
      id: 111,
      name: "test",
      phone: "123123",
    });

    await asker.createGuest(guest);
    const session = new Session({
      id: 122,
      guest_id: 111,
      token: "123234321",
      session_extension_minutes: 30,
      created_at: "",
      updated_at: "",
    });
    await asker.createSession(session);

    const roomSize = new RoomSize({
      id: 1222,
      name: "Master Suite",
      size: "Double",
    });
    await asker.createRoomSize(roomSize);

    const room = new Room({
      id: 1212,
      name: "test hotel room",
      room_size_id: 1222,
      price: 120,
      availability: "available",
      created_at: "",
      updated_at: "",
    });
    await asker.createRoom(room);

    const res: HandleBookingResponse = await fetch(
      "http://127.0.0.1:3000/booking",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          token: session.token,
        },
        body: JSON.stringify({
          roomsId: [room.id],
          checkInDate: "2026-01-23",
          checkOutDate: "2026-01-25",
        }),
      },
    ).then((res) => res.json());

    const aboutReservation = asker.aboutReservation(res.external_reference);

    assert.equal(await aboutReservation.exists(), false);
  });

  afterEach();

  after(() => {
    harness.teardown();
  });
});
