import { GuestNotFoundException } from "@guest/exceptions/guest-not-found-exception";
import { DeleteGuestRequestDTO } from "@guest/requests/delete-guest.request.dto";
import { GetGuestRequestDTO } from "@guest/requests/get-guest.request.dto";
import { InsertGuestRequestDTO } from "@guest/requests/insert-guest.request.dto";
import { UpdateGuestRequestDTO } from "@guest/requests/update-guest.request.dto";
import { GuestService } from "@guest/services/guest.service";
import { ExceptionService } from "@shared/services/exception.service";

export class GuestController {
  constructor(
    private readonly guestService: GuestService,
    private readonly exceptionService: ExceptionService
  ) {}
  public get(request: GetGuestRequestDTO) {
    return this.guestService
      .get(request)
      .catch((error) => this.exceptionService.handle(error));
  }

  public update(request: UpdateGuestRequestDTO) {
    return this.guestService.update(request);
  }

  public insert(request: InsertGuestRequestDTO) {
    return this.guestService.insert(request).catch(() => {
      throw new GuestNotFoundException();
    });
  }

  public delete(request: DeleteGuestRequestDTO) {
    return this.guestService.delete(request).catch(() => {
      throw new GuestNotFoundException();
    });
  }
}
