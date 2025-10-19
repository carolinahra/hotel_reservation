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
      exceptionService.handle(error);
    });
});

app.put("/guests", (req, res) => {
  const request = UpdateGuestRequestDTO.fromRequest({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    newPhone: req.body.newPhone,
  });
  guestController
    .update(request)
    .then((guest) => res.send(guest.toPrimitives()))
    .catch((error) => {
      console.log(error);
      exceptionService.handle(error);
    });
});

app.delete("/guests", (req, res) => {
  const request = DeleteGuestRequestDTO.fromRequest({
    email: req.body.email,
    phone: req.body.phone,
  });
  guestController.delete(request);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
