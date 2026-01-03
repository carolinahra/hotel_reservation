import { Guest } from "@guest/models/guest";
import { GuestRepository } from "@guest/repository/guest.repository";

interface GetGuest {
  id?: number;
  phone?: string;
  email?: string;
}

interface GetManyGuest extends GetGuest {
  name?: string;
  limit?: number;
  offset?: number;
}

interface UpdateGuest {
  id: number;
  phone?: string;
  name?: string;
  email?: string;
}
interface InsertGuest {
  phone: string;
  name: string;
  email: string;
  password: string;
}

interface DeleteGuest {
  phone?: string;
  email?: string;
}

export class GuestService {
  constructor(private readonly guestRepository: GuestRepository) {}

  public async getOne(getGuest: GetGuest): Promise<Guest> {
    const guest = await this.guestRepository.get(getGuest);
    return Array.isArray(guest) ? guest.pop() : guest;
  }

  public async getMany(getGuest: GetManyGuest): Promise<Guest[]> {
    const guests = await this.guestRepository.get(getGuest);

    return Array.isArray(guests) ? guests : [guests];
  }

  public async getBy(getGuest: GetManyGuest): Promise<Guest[]> {
    const guests = await this.guestRepository.getBy(getGuest);
    return guests;
  }

  public update(updateGuest: UpdateGuest) {
    return this.guestRepository.update(updateGuest);
  }

  public insert(insertGuest: InsertGuest) {
    return this.guestRepository.insert(insertGuest);
  }

  public delete(deleteGuest: DeleteGuest) {
    return this.guestRepository.delete(deleteGuest);
  }
}
