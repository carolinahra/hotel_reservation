import { GetGuestRequestDTO } from "@guest/requests/get-guest.request.dto";
import { Container } from "@shared/container";
import express from "express";
import dotenv from "dotenv";
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
import { BookingRequestDTO } from "@shared/requests/booking.request.dto";
import { GetExtraServiceRequestDTO } from "@extraService/requests/get-extra-service.request.dto";
import { GetBookingPriceRequestDTO } from "@shared/requests/get-booking-price.request.dto";
import { LoginRequestDTO } from "@shared/requests/login.request.dto";

export function setContainer(): Container {
  dotenv.config();

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
    email: {
      email: process.env.GOOGLE_EMAIL,
      password: process.env.GOOGLE_APP_PASSWORD,
    },
  });
  return container;
}

export function launchApp(container: Container) {
  const app = express();
  const port = 3000;
  dotenv.config();

  app.use(express.json());
  app.use(cors({ origin: "*" }));

  const logService = container.logService;
  const exceptionService = container.exceptionService;

  app.use((req: Request, res: Response, next: NextFunction) => {
    logService.start();
    logService.collect({ request: req });

    const originalSend = res.send.bind(res);
    res.send = function (body?: any) {
      logService.collect({ responseBody: body });

      return originalSend(body);
    } as typeof originalSend;

    res.on("finish", () => logService.log());

    next();
  });

  const tokenValidationMiddleware = container.tokenValidationMiddleware;

  app.use(tokenValidationMiddleware.handle.bind(tokenValidationMiddleware));

  const guestController = container.guestController;

  app.get("/guests", async (req, res) => {
    const request = GetGuestRequestDTO.fromRequest({
      name: req.query.name,
      phone: req.query.phone,
      email: req.query.email,
      limit: req.query.limit,
      offset: req.query.offset,
    });

    if (req.query.filter) {
      const guests = await guestController.getBy(request);

      if (guests instanceof ErrorResponse) {
        return res.status(400).json(guests);
      }

      return res.json();
    }

    const guests = await guestController.get(request);

    if (guests instanceof ErrorResponse) {
      return res.status(400).json(guests);
    }

    return res.json();
  });

  app.post("/guests", (req, res) => {
    const request = InsertGuestRequestDTO.fromRequest({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
    });
    guestController
      .insert(request)
      .then((response) => res.send(response))
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
      .then((guest) => res.send(guest))
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
      .then((response) => res.send(response))
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
      .then((response) => res.send(response))
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
      .then((response) => res.send(response))
      .catch((error) => {
        console.log(error);
        res.send(exceptionService.handle(error));
      });
  });

  app.delete("/rooms", (req, res) => {
    const request = DeleteRoomRequestDTO.fromRequest({
      id: req.body.id,
    });
    roomController
      .delete(request)
      .then((response) => res.send(response))
      .catch((error) => {
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
      checkInDate: req.query.checkInDate,
      limit: req.query.limit,
      offset: req.query.offset,
    });

    reservationController
      .get(request)
      .then((response) => res.send(response))
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
      .then((response) => res.send(response))
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
      .then((response) => res.send(response))
      .catch((error) => {
        console.log(error);
        res.send(exceptionService.handle(error));
      });
  });

  app.delete("/reservations", (req, res) => {
    const request = DeleteReservationRequestDTO.fromRequest({
      id: req.body.id,
    });
    reservationController
      .delete(request)
      .then((response) => res.send(response))
      .catch((error) => {
        console.log(error);
        res.send(exceptionService.handle(error));
      });
  });

  const extraServiceController = container.extraServiceController;

  app.get("/extra-services", (req, res) => {
    const request = GetExtraServiceRequestDTO.fromRequest({
      id: req.query.id,
      name: req.query.name,
      price: req.query.price,
      limit: req.query.limit,
      offset: req.query.offset,
    });
    extraServiceController
      .get(request)
      .then((response) => res.send(response))
      .catch((error) => {
        console.log(error);
        res.send(exceptionService.handle(error));
      });
  });

  const bookingController = container.bookingController;

  app.get("/booking", (req, res) => {
    const request = GetBookingPriceRequestDTO.fromRequest({
      roomsIDs: req.query.roomsIDs,
      extraServicesIDs: req.query.extraServicesIDs,
      checkInDate: req.query.checkInDate,
      checkOutDate: req.query.checkOutDate,
    });
    bookingController
      .getPrice(request)
      .then((response) => res.send(response))
      .catch((error) => {
        console.log(error);
        res.send(exceptionService.handle(error));
      });
  });

  app.post("/booking", (req, res) => {
    const request = BookingRequestDTO.fromRequest({
      guestId: req.body.guestId,
      roomsId: req.body.roomsId,
      extraServices: req.body.extraServices,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
    });
    bookingController
      .handle(request)
      .then((response) => {
        return res.send(response);
      })
      .catch((error) => {
        console.log(error);
        res.send(exceptionService.handle(error));
      });
  });

  const loginController = container.loginController;
  app.post("/login", (req, res) => {
    const request = LoginRequestDTO.fromRequest({
      email: req.body.email,
      password: req.body.password,
    });
    loginController
      .handle(request)
      .then((token) => res.send(token))
      .catch((error) => {
        console.log(error);
        return res.send(exceptionService.handle(error));
      });
  });

  const launchedApp = app.listen(port, (error) => {
    if (error) {
      console.error(error);
    }
    console.log(`Example app listening on port ${port}`);
  });

  return { app: launchedApp, container };
}
