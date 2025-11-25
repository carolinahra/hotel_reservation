import { ReservationNotFoundException } from "@reservation/exceptions/reservation/reservation-not-found.exception";
import { Reservation } from "../models/reservation";
import { ReservationRepository } from "../repositories/reservation.repository";
import { Transaction } from "kysely";
import { ReservationTable } from "@shared/database-models/reservation.database-model";

interface GetReservation {
  id?: number;
  externalReference?: string;
}

interface GetManyReservations extends GetReservation {
  guestId?: number;
  checkInDate?: string;
  limit?: number;
  offset?: number;
}

interface InsertReservation {
  guestId: number;
  externalReference: string;
  totalPrice: number;
  paymentStatus: string;
  checkInDate: string;
  checkOutDate: string;
}

interface UpdateReservation {
  id: number;
  guestId: number;
  externalReference: string;
  totalPrice: number;
  paymentStatus: string;
  checkInDate: string;
  checkOutDate: string;
}

interface DeleteReservation {
  id: number;
}

export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  public async getOne(getReservation: GetReservation): Promise<Reservation> {
    const reservation = await this.reservationRepository.get(getReservation);
    return Array.isArray(reservation) ? reservation.pop() : reservation;
  }
  public async getMany(
    getReservation: GetManyReservations
  ): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.get(getReservation);
    return Array.isArray(reservations) ? reservations : [reservations];
  }

  public update(updateReservation: UpdateReservation): Promise<Reservation> {
    return this.reservationRepository.update(updateReservation);
  }

  public insert(
    insertReservation: InsertReservation,
    transaction?: Transaction<ReservationTable>
  ): Promise<Reservation> {
    return this.reservationRepository.insert(insertReservation, transaction);
  }

  public delete(deleteReservation: DeleteReservation): Promise<boolean> {
    return this.reservationRepository.delete(deleteReservation);
  }
}
