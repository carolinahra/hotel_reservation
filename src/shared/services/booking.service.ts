import { ExtraServiceService } from "@extraService/services/extra-service.service";
import { GuestNotFoundException } from "@guest/exceptions/guest-not-found-exception";
import { GuestService } from "@guest/services/guest.service";
import { Reservation } from "@reservation/models/reservation";
import { ReservationDetailService } from "@reservation/services/reservation-detail.service";
import { ReservationService } from "@reservation/services/reservation.service";
import { RoomANotAvailableException } from "@room/exceptions/room/room-not-available.exception";
import { RoomNotFoundException } from "@room/exceptions/room/room-not-found-exception";
import { RoomService } from "@room/services/room.service";
import { Kysely } from "kysely";
import { v4 as uuidv4 } from "uuid";
import { EmailService } from "./email.service";
interface ExtraServiceProps {
  roomId: number;
  extraServiceId: number;
}

interface BookingProps {
  guestId: number;
  roomsId: number[];
  extraServices?: ExtraServiceProps[];
  checkInDate: string;
  checkOutDate: string;
}

interface BookingPriceProps {
  extraServicesIDs?: number[];
  roomsIDs: number[];
  checkInDate: string;
  checkOutDate: string;
}

export class BookingService {
  constructor(
    private readonly kysely: Kysely<any>,
    private readonly guestService: GuestService,
    private readonly roomService: RoomService,
    private readonly extraServiceService: ExtraServiceService,
    private readonly reservationService: ReservationService,
    private readonly reservationDetailService: ReservationDetailService,
    private readonly emailService: EmailService
  ) {}

  // TODO: Test

  public async handleReservation(props: BookingProps): Promise<Reservation> {
    const guest = await this.guestService.getOne({ id: props.guestId });
    if (!guest) {
      throw new GuestNotFoundException();
    }
    const rooms = await Promise.all(
      props.roomsId.map((roomId) => this.roomService.getOne({ id: roomId }))
    );
    if (rooms.some((room) => !room)) {
      throw new RoomNotFoundException();
    }
    const checkIn = new Date(props.checkInDate);
    checkIn.setHours(15, 0, 0, 0);
    const checkOut = new Date(props.checkOutDate);
    checkOut.setHours(11, 0, 0, 0);
    for (const room of rooms) {
      const isBookedRoom = await this.roomService.isBookedRoom({
        roomId: room.id,
        checkInDate: this.toSqlDateTime(checkIn),
        checkOutDate: this.toSqlDateTime(checkOut),
      });
      if (isBookedRoom) {
        throw new RoomANotAvailableException();
      }
    }

    const extraServices = await Promise.all(
      props.extraServices?.map((extraService) =>
        this.extraServiceService.getOne({
          id: extraService.extraServiceId,
        })
      )
    );

    const totalDays = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const roomsPrices = rooms.reduce(
      (roomPrice, room) => roomPrice + room.price,
      0
    );

    const extraServicesPrice = extraServices.reduce(
      (extraServicePrices, extraService) =>
        extraServicePrices + extraService.price,
      0
    );

    const totalPrice = (roomsPrices + extraServicesPrice) * totalDays;
    const externalReference = uuidv4();

    const createdReservation = await this.kysely
      .transaction()
      .execute(async (transaction) => {
        const reservation = await this.reservationService.insert(
          {
            guestId: guest.id,
            checkInDate: this.toSqlDateTime(checkIn),
            checkOutDate: this.toSqlDateTime(checkOut),
            externalReference,
            paymentStatus: "pending",
            totalPrice,
          },
          transaction
        );
        for (const reservationDetailProp of props?.extraServices) {
          await this.reservationDetailService.insert(
            {
              reservationId: reservation.id,
              extraServiceId: reservationDetailProp.extraServiceId,
              roomId: reservationDetailProp.roomId,
            },
            transaction
          );
        }
        return reservation;
      });
    if (createdReservation) {
      this.emailService.send({
        to: guest.email,
        subject: "Reservation Confirmed",
        text: `Dear ${guest.name}, \n
        Your reservation with id ${createdReservation.external_reference} is confirmed. \n Check in date: ${createdReservation.check_in_at} \n Check-out date: ${createdReservation.check_out_at} \n Total price: ${totalPrice}`,
      });
    }
    return createdReservation;
  }

  public async getReservationPrice(props: BookingPriceProps): Promise<number> {
    const checkIn = new Date(props.checkInDate);
    checkIn.setHours(15, 0, 0, 0);
    const checkOut = new Date(props.checkOutDate);
    checkOut.setHours(11, 0, 0, 0);
    const totalDays = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const rooms = await Promise.all(
      props.roomsIDs.map((roomID) => this.roomService.getOne({ id: roomID }))
    );
    if (rooms.some((room) => !room)) {
      throw new RoomNotFoundException();
    }
    const extraServices = await Promise.all(
      props.extraServicesIDs?.map((id) =>
        this.extraServiceService.getOne({
          id,
        })
      )
    );
    const roomsPrices = rooms.reduce(
      (roomPrice, room) => roomPrice + room.price,
      0
    );

    const extraServicesPrice = extraServices.reduce(
      (extraServicePrices, extraService) =>
        extraServicePrices + extraService.price,
      0
    );

    const totalPrice = (roomsPrices + extraServicesPrice) * totalDays;
    return totalPrice;
  }

  private toSqlDateTime(date: Date): string {
    return date.toISOString().slice(0, 19).replace("T", " ");
  }
}
