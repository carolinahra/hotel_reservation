import { BookingRequestDTO } from "@shared/requests/booking.request.dto";
import { GetBookingPriceRequestDTO } from "@shared/requests/get-booking-price.request.dto";
import { BookingService } from "@shared/services/booking.service";

export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  public handle(request: BookingRequestDTO) {
    return this.bookingService.handleReservation(request);
  }

  public getPrice(request: GetBookingPriceRequestDTO) {
    return this.bookingService.getReservationPrice(request);
  }
}
