import { ExtraServiceService } from "@extraService/services/extra-service.service";
import { GuestNotFoundException } from "@guest/exceptions/guest-not-found-exception";
import { GuestService } from "@guest/services/guest.service";
import { ReservationDetailService } from "@reservation/services/reservation-detail.service";
import { RoomNotFoundException } from "@room/exceptions/room/room-not-found-exception";
import { RoomService } from "@room/services/room.service";
interface ExtraServiceProps {
    roomId: number;
    extraServiceId: number;
}

interface BookingProps {
  guestId: number;
  roomsId: number[];
  extraServices?: ExtraServiceProps[];
}

export class BookingService {
  constructor( 
    private readonly guestService: GuestService,
    private readonly roomService: RoomService,
    private readonly extraServiceService: ExtraServiceService,
    private readonly reservationDetailService: ReservationDetailService
  ) {}

  // TODO: Test

  public async handleReservation(props: BookingProps) {
    const guest = await this.guestService.get({ id: props.guestId });
    if (!guest) {
        throw new GuestNotFoundException();
    }
    const rooms = await props.roomsId.map((roomId) => this.roomService.get({id: roomId}));
    if (!rooms.length) {
        throw new RoomNotFoundException();
    }

  }

  
}
