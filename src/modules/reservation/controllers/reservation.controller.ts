import { Reservation } from "../models/reservation";
import { DeleteReservationRequestDTO } from "../requests/reservation/delete-reserevation.request.dto";
import { GetReservationRequestDTO } from "../requests/reservation/get-reservation.request.dto";
import { InsertReservationRequestDTO } from "../requests/reservation/insert-reservation.request.dto";
import { UpdateReservationRequestDTO } from "../requests/reservation/update-reservation.request.dto";
import { ReservationService } from "../services/reservation.service";

export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  public get(
    request: GetReservationRequestDTO
  ): Promise<Reservation | Reservation[]> {
    if (request.id || request.externalReference) {
      return this.reservationService.getOne(request);
    }
    return this.reservationService.getMany(request);
  }

  public update(request: UpdateReservationRequestDTO): Promise<Reservation> {
    return this.reservationService.update(request);
  }

  public insert(request: InsertReservationRequestDTO): Promise<Reservation> {
    return this.reservationService.insert(request);
  }

  public delete(request: DeleteReservationRequestDTO): Promise<boolean> {
    return this.reservationService.delete(request);
  }
}
