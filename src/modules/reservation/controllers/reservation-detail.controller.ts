import { ExceptionService } from "@shared/services/exception.service";
import { ReservationDetail } from "../models/reservation-detail";
import { DeleteReservationDetailRequestDTO } from "../requests/reservation-detail/delete-reservation-detail.request.dto";
import { GetReservationDetailRequestDTO } from "../requests/reservation-detail/get-reservation-detail.request.dto";
import { InsertReservationDetailRequestDTO } from "../requests/reservation-detail/insert-reservation-detail.request.dto";
import { UpdateReservationDetailRequestDTO } from "../requests/reservation-detail/update-reservation-detail.request.dto";
import { ReservationDetailService } from "../services/reservation-detail.service";
import {
  DeleteReservationDetailResponse,
  GetReservationDetailResponse,
  InsertReservationDetailResponse,
  UpdateReservationDetailResponse,
} from "@reservation/responses/reservation-detail.response";
import { ErrorResponse } from "@shared/exceptions/error-response";

export class ReservationDetailController {
  constructor(
    private readonly reservationDetailService: ReservationDetailService,
    private readonly exceptionService: ExceptionService
  ) {}
  public async get(
    request: GetReservationDetailRequestDTO
  ): Promise<
    | GetReservationDetailResponse
    | GetReservationDetailResponse[]
    | ErrorResponse
  > {
    try {
      if (request.id) {
        const reservationDetail = await this.reservationDetailService.getOne(
          request
        );
        return {
          id: reservationDetail.id,
          reservation_id: reservationDetail.reservation_id,
          room_id: reservationDetail.room_id,
          extra_service_id: reservationDetail.extra_service_id,
        };
      }
      const reservationDetails = await this.reservationDetailService.getMany(
        request
      );
      return reservationDetails.map((reservationDetail) => {
        return {
          id: reservationDetail.id,
          reservation_id: reservationDetail.reservation_id,
          room_id: reservationDetail.room_id,
          extra_service_id: reservationDetail.extra_service_id,
        };
      });
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async update(
    request: UpdateReservationDetailRequestDTO
  ): Promise<UpdateReservationDetailResponse | ErrorResponse> {
    try {
      const reservationDetail = await this.reservationDetailService.update(
        request
      );
      return {
        id: reservationDetail.id,
        reservation_id: reservationDetail.reservation_id,
        room_id: reservationDetail.room_id,
        extra_service_id: reservationDetail.extra_service_id,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async insert(
    request: InsertReservationDetailRequestDTO
  ): Promise<InsertReservationDetailResponse | ErrorResponse> {
    try {
      const reservationDetail = await this.reservationDetailService.insert(
        request
      );
      return {
        id: reservationDetail.id,
        reservation_id: reservationDetail.reservation_id,
        room_id: reservationDetail.room_id,
        extra_service_id: reservationDetail.extra_service_id,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async delete(
    request: DeleteReservationDetailRequestDTO
  ): Promise<DeleteReservationDetailResponse | ErrorResponse> {
    try {
      const isDeletedReservationDetail =
        await this.reservationDetailService.delete(request);
      return {
        isDeletedReservationDetail,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
}
