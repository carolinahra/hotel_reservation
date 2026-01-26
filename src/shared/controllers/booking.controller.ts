import { ErrorResponse } from "@shared/exceptions/error-response";
import { BookingRequestDTO } from "@shared/requests/booking.request.dto";
import { GetBookingPriceRequestDTO } from "@shared/requests/get-booking-price.request.dto";
import {
  GetPriceResponse,
  HandleBookingResponse,
} from "@shared/responses/booking.response";
import { BookingService } from "@shared/services/booking.service";
import { ExceptionService } from "@shared/services/exception.service";

export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly exceptionService: ExceptionService
  ) {}

  public async handle(
    request: BookingRequestDTO
  ): Promise<HandleBookingResponse | ErrorResponse> {
    try {
      const reservation = await this.bookingService.handleReservation(request);
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

  public async getPrice(
    request: GetBookingPriceRequestDTO
  ): Promise<GetPriceResponse | ErrorResponse> {
    try {
      const price = await this.bookingService.getReservationPrice(request);
      return { price };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
}
