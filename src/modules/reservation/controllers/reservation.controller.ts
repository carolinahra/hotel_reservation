import { ExceptionService } from "@shared/services/exception.service";
import { Reservation } from "../models/reservation";
import { DeleteReservationRequestDTO } from "../requests/reservation/delete-reserevation.request.dto";
import { GetReservationRequestDTO } from "../requests/reservation/get-reservation.request.dto";
import { InsertReservationRequestDTO } from "../requests/reservation/insert-reservation.request.dto";
import { UpdateReservationRequestDTO } from "../requests/reservation/update-reservation.request.dto";
import { ReservationService } from "../services/reservation.service";
import {
  DeleteReservationResponse,
  GetReservationResponse,
  InsertReservationResponse,
  UpdateReservationResponse,
} from "@reservation/responses/reservation.response";
import { ErrorResponse } from "@shared/exceptions/error-response";

export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly exceptionService: ExceptionService
  ) {}

  public async get(
    request: GetReservationRequestDTO
  ): Promise<
    GetReservationResponse | GetReservationResponse[] | ErrorResponse
  > {
    try {
      if (request.id || request.externalReference) {
        const reservation = await this.reservationService.getOne(request);
        return {
          id: reservation.id,
          guest_id: reservation.guest_id,
          external_reference: reservation.external_reference,
          total_price: reservation.total_price,
          payment_status: reservation.payment_status,
          check_in_at: reservation.check_in_at,
          check_out_at: reservation.check_out_at,
          created_at: reservation.created_at,
          updated_at: reservation.updated_at,
        };
      }
      const reservations = await this.reservationService.getMany(request);
      return reservations.map((reservation) => {
        return {
          id: reservation.id,
          guest_id: reservation.guest_id,
          external_reference: reservation.external_reference,
          total_price: reservation.total_price,
          payment_status: reservation.payment_status,
          check_in_at: reservation.check_in_at,
          check_out_at: reservation.check_out_at,
          created_at: reservation.created_at,
          updated_at: reservation.updated_at,
        };
      });
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }

  public async update(
    request: UpdateReservationRequestDTO
  ): Promise<UpdateReservationResponse | ErrorResponse> {
    try {
      const reservation = await this.reservationService.update(request);
      return {
        id: reservation.id,
        guest_id: reservation.guest_id,
        external_reference: reservation.external_reference,
        total_price: reservation.total_price,
        payment_status: reservation.payment_status,
        check_in_at: reservation.check_in_at,
        check_out_at: reservation.check_out_at,
        created_at: reservation.created_at,
        updated_at: reservation.updated_at,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }

  public async insert(
    request: InsertReservationRequestDTO
  ): Promise<InsertReservationResponse | ErrorResponse> {
    try {
      const reservation = await this.reservationService.insert(request);
      return {
        id: reservation.id,
        guest_id: reservation.guest_id,
        external_reference: reservation.external_reference,
        total_price: reservation.total_price,
        payment_status: reservation.payment_status,
        check_in_at: reservation.check_in_at,
        check_out_at: reservation.check_out_at,
        created_at: reservation.created_at,
        updated_at: reservation.updated_at,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }

  public async delete(
    request: DeleteReservationRequestDTO
  ): Promise<DeleteReservationResponse> {
    try {
      const isDeletedReservation = await this.reservationService.delete(
        request
      );
      return { isDeletedReservation };
    } catch (error) {
      this.exceptionService.handle(error);
    }
  }
}
