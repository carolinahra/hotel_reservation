import { DeleteGuestRequestDTO } from "@guest/requests/delete-guest.request.dto";
import { GetGuestRequestDTO } from "@guest/requests/get-guest.request.dto";
import { InsertGuestRequestDTO } from "@guest/requests/insert-guest.request.dto";
import { UpdateGuestRequestDTO } from "@guest/requests/update-guest.request.dto";
import { DeleteGuestResponse, GetGuestResponse, InsertGuestResponse, UpdateGuestResponse } from "@guest/responses/guest.response";
import { GuestService } from "@guest/services/guest.service";
import { ErrorResponse } from "@shared/exceptions/error-response";
import { ExceptionService } from "@shared/services/exception.service";


export class GuestController {
  constructor(
    private readonly guestService: GuestService,
    private readonly exceptionService: ExceptionService
  ) {}
  public async get(
    request: GetGuestRequestDTO
  ): Promise<GetGuestResponse | GetGuestResponse[] | ErrorResponse> {
    try {
      if (request.id || request.phone || request.email) {
        const guest = await this.guestService.getOne(request);
        return {
          id: guest.id,
          name: guest.name,
          phone: guest.phone,
          email: guest.email,
        };
      }
      const guests = await this.guestService.getMany(request);
      return guests.map((guest) => {
        return {
          id: guest.id,
          name: guest.name,
          phone: guest.phone,
          email: guest.email,
        };
      });
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }

  public async getBy(request: GetGuestRequestDTO): Promise<GetGuestResponse[] | ErrorResponse> {
    try {
      const guests = await this.guestService.getBy(request);
      return guests.map((guest) => {
        return {
          id: guest.id,
          name: guest.name,
          phone: guest.phone,
          email: guest.email,
        };
      });
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }

  public async update(
    request: UpdateGuestRequestDTO
  ): Promise<UpdateGuestResponse> {
    try {
      const guest = await this.guestService.update(request);
      return {
        id: guest.id,
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
      };
    } catch (error) {
      this.exceptionService.handle(error);
    }
  }

  public async insert(
    request: InsertGuestRequestDTO
  ): Promise<InsertGuestResponse | ErrorResponse> {
    try {
      const guest = await this.guestService.insert(request);
      return {
        id: guest.id,
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }

  public async delete(
    request: DeleteGuestRequestDTO
  ): Promise<DeleteGuestResponse> {
    try {
      const isDeletedGuest = await this.guestService.delete(request);
      return { isDeletedGuest };
    } catch (error) {
      this.exceptionService.handle(error);
    }
  }
}
