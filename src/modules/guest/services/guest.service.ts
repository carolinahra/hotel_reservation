import { Guest } from "@guest/models/guest";
import { GuestRepository } from "@guest/repository/guest.repository";

interface GetGuest {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
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
}

interface DeleteGuest {
  phone?: string;
  email?: string;
}

export class GuestService {
  constructor(private readonly guestRepository: GuestRepository) {}

  public get(getGuest: GetGuest): Promise<Guest | Guest[]> {
    return this.guestRepository.get(getGuest);
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
