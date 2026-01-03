import { Session } from "@session/models/session";
import { SessionRepository } from "@session/repositories/session.repository";
interface GetSession {
  id?: number;
  token?: string;
}

interface GetManySessions extends GetSession {
  guestID?: number;
  limit?: number;
  offset?: number;
}

interface InsertSession {
  guestID: number;
  token: string;
  sessionExtensionMinutes: number;
}

interface UpdateSession {
  token: string;
  guestID?: number;
  sessionExtensionMinutes?: number;
}
interface DeleteSession {
  token: string;
}

export class SessionService {
  constructor(private readonly repository: SessionRepository) {}

  public async getOne(getSession: GetSession): Promise<Session> {
    const guest = await this.repository.get(getSession);
    return Array.isArray(guest) ? guest.pop() : guest;
  }

  public async getMany(getSession: GetManySessions): Promise<Session[]> {
    const guests = await this.repository.get(getSession);
    return Array.isArray(guests) ? guests : [guests];
  }

  public insert(insertSession: InsertSession): Promise<Session> {
    return this.repository.insert(insertSession);
  }

  public update(updateSession: UpdateSession): Promise<Session> {
    return this.repository.update(updateSession);
  }

  public delete(deleteSession: DeleteSession): Promise<boolean> {
    return this.repository.delete(deleteSession);
  }
}
