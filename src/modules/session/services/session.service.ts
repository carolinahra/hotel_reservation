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

export class SessionService {
  constructor(private readonly repository: SessionRepository) {}

  public async getOne(getSession: GetSession): Promise<Session> {
    const session = await this.repository.get(getSession);
    return Array.isArray(session) ? session.pop() : session;
  }

  public async getMany(getSession: GetManySessions): Promise<Session[]> {
    const sessions = await this.repository.get(getSession);
    return Array.isArray(sessions) ? sessions : [sessions];
  }

  public insert(insertSession: InsertSession): Promise<Session> {
    return this.repository.insert(insertSession);
  }

  public update(updateSession: UpdateSession): Promise<Session> {
    return this.repository.update(updateSession);
  }
}
