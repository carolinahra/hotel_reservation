import { GetGuestRequestDTO } from "@guest/requests/get-guest.request.dto";
import { Container } from "@shared/container";
import express from "express";
import "dotenv/config";
import type { Request, NextFunction, Response } from "express";
import cors from "cors";
import { InsertGuestRequestDTO } from "@guest/requests/insert-guest.request.dto";
import { ErrorResponse } from "@shared/exceptions/error-response";
import { DeleteGuestRequestDTO } from "@guest/requests/delete-guest.request.dto";
import { UpdateGuestRequestDTO } from "@guest/requests/update-guest.request.dto";
import { DeleteRoomRequestDTO } from "@room/requests/room/delete-room.request.dto";
import { GetRoomRequestDTO } from "@room/requests/room/get-room.request.dto";
import { InsertRoomRequestDTO } from "@room/requests/room/insert-room.request.dto";
import { UpdateRoomRequestDTO } from "@room/requests/room/update-room.request.dto";
import { DeleteReservationRequestDTO } from "@reservation/requests/reservation/delete-reserevation.request.dto";
import { GetReservationRequestDTO } from "@reservation/requests/reservation/get-reservation.request.dto";
import { InsertReservationRequestDTO } from "@reservation/requests/reservation/insert-reservation.request.dto";
import { UpdateReservationRequestDTO } from "@reservation/requests/reservation/update-reservation.request.dto";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: "*" }));

const container = new Container({
  database: {
    driver: "mysql",
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  log: {
    logPath: process.env.LOG_PATH,
  },
});

const logService = container.logService;
const exceptionService = container.exceptionService;

app.use((req: Request, res: Response, next: NextFunction) => {
  logService.start();
  logService.collect({ request: req });

  const originalSend = res.send;
  res.send = function (body?: any) {
    logService.collect({ responseBody: body });
    logService.log();

    return originalSend.call(res, body);
  } as typeof originalSend;
  next();
});

const guestController = container.guestController;

app.get("/guests", (req, res) => {
  const request = GetGuestRequestDTO.fromRequest({
    name: req.query.name,
    phone: req.query.phone,
    email: req.query.email,
    limit: req.query.limit,
    offset: req.query.offset,
  });

  guestController
    .get(request)
    .then((guests) =>
      res.send(
        Array.isArray(guests)
          ? guests.map((guest) => guest.toPrimitives())
          : guests instanceof ErrorResponse
          ? guests
          : guests.toPrimitives()
      )
    );
});

app.post("/guests", (req, res) => {
  const request = InsertGuestRequestDTO.fromRequest({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
  });
  guestController
    .insert(request)
    .then((guest) => res.send(guest.toPrimitives()))
    .catch((error) => {
      console.log(error);
      res.send(exceptionService.handle(error));
    });
});

app.put("/guests", (req, res) => {
  const request = UpdateGuestRequestDTO.fromRequest({
    id: req.body.id,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
  });
  guestController
    .update(request)
    .then((guest) => res.send(guest.toPrimitives()))
    .catch((error) => {
      console.log(error);
      res.send(exceptionService.handle(error));
    });
});

app.delete("/guests", (req, res) => {
  const request = DeleteGuestRequestDTO.fromRequest({
    email: req.body.email,
    phone: req.body.phone,
  });
  guestController.delete(request).catch((error) => {
    console.log(error);
    res.send(exceptionService.handle(error));
  });
});

// Rooms
const roomController = container.roomController;

app.get("/rooms", (req, res) => {
  const request = GetRoomRequestDTO.fromRequest({
    id: req.query.id,
    name: req.query.name,
    sizeId: req.query.sizeId,
    limit: req.query.limit,
    offset: req.query.offset,
  });

  roomController
    .get(request)
    .then((rooms) =>
      res.send(
        Array.isArray(rooms)
          ? rooms.map((guest) => guest.toPrimitives())
          : rooms instanceof ErrorResponse
          ? rooms
          : rooms.toPrimitives()
      )
    )
    .catch((error) => {
      console.log(error);
      const errorResponse = exceptionService.handle(error);
      res.status(errorResponse.httpCode);
      res.send(errorResponse);
    });
});

app.post("/rooms", (req, res) => {
  const request = InsertRoomRequestDTO.fromRequest({
    name: req.body.name,
    sizeId: req.body.sizeId,
    price: req.body.price,
    availability: req.body.availability,
  });
  roomController
    .insert(request)
    .then((room) => res.send(room.toPrimitives()))
    .catch((error) => {
      console.log(error);
      res.send(exceptionService.handle(error));
    });
});

app.put("/rooms", (req, res) => {
  const request = UpdateRoomRequestDTO.fromRequest({
    id: req.body.id,
    name: req.body.name,
    sizeId: req.body.sizeId,
    availability: req.body.availability,
    price: req.body.price,
  });
  roomController
    .update(request)
    .then((room) => res.send(room.toPrimitives()))
    .catch((error) => {
      console.log(error);
      res.send(exceptionService.handle(error));
    });
});

app.delete("/rooms", (req, res) => {
  const request = DeleteRoomRequestDTO.fromRequest({
    id: req.body.id,
  });
  roomController.delete(request).catch((error) => {
    console.log(error);
    res.send(exceptionService.handle(error));
  });
});

// Reservations
const reservationController = container.reservationController;

app.get("/reservations", (req, res) => {
  const request = GetReservationRequestDTO.fromRequest({
    id: req.query.id,
    externalReference: req.query.externalReference,
    guestId: req.query.guestId,
    checkInDate: String(req.query.checkInDate),
    limit: req.query.limit,
    offset: req.query.offset,
  });

  reservationController
    .get(request)
    .then((reservations) =>
      res.send(
        Array.isArray(reservations)
          ? reservations.map((guest) => guest.toPrimitives())
          : reservations instanceof ErrorResponse
          ? reservations
          : reservations.toPrimitives()
      )
    )
    .catch((error) => {
      console.log(error);
      res.send(exceptionService.handle(error));
    });
});

app.post("/reservations", (req, res) => {
  const request = InsertReservationRequestDTO.fromRequest({
    id: req.body.id,
    guestId: req.body.guestId,
    externalReference: req.body.externalReference,
    totalPrice: req.body.totalPrice,
    paymentStatus: req.body.paymentStatus,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  });
  reservationController
    .insert(request)
    .then((reservation) => res.send(reservation.toPrimitives()))
    .catch((error) => {
      console.log(error);
      res.send(exceptionService.handle(error));
    });
});

app.put("/reservations", (req, res) => {
  const request = UpdateReservationRequestDTO.fromRequest({
    id: req.body.id,
    guestId: req.body.guestId,
    externalReference: req.body.externalReference,
    totalPrice: req.body.totalPrice,
    paymentStatus: req.body.paymentStatus,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  });
  reservationController
    .update(request)
    .then((reservation) => res.send(reservation.toPrimitives()))
    .catch((error) => {
      console.log(error);
      res.send(exceptionService.handle(error));
    });
});

app.delete("/reservations", (req, res) => {
  const request = DeleteReservationRequestDTO.fromRequest({
    id: req.body.id,
  });
  reservationController.delete(request).catch((error) => {
    console.log(error);
    res.send(exceptionService.handle(error));
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
