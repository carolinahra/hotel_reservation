import { Session } from "@session/models/session";
import { SessionTable } from "@shared/database-models/session.database-model";
import { Repository } from "@shared/repositories/repository";
import { Kysely, sql, Transaction } from "kysely";

export abstract class SessionRepository extends Repository {
  abstract get(config: GetSessionConfig): Promise<Session | Session[]>;
  abstract insert(config: InsertSessionConfig): Promise<Session>;
  abstract update(config: UpdateSessionConfig): Promise<Session>;
}

interface GetSessionConfig {
  id?: number;
  token?: string;
  guestID?: number;
  limit?: number;
  offset?: number;
}

interface InsertSessionConfig {
  guestID: number;
  token: string;
  sessionExtensionMinutes: number;
}

interface UpdateSessionConfig {
  token: string;
  guestID?: number;
  sessionExtensionMinutes?: number;
}
interface GetByIDConfig {
  id: number;
}
interface Database extends SessionTable {}
export class KyselySessionRepository extends SessionRepository {
  constructor(private readonly kysely: Kysely<Database>) {
    super();
  }
  public get(
    config: GetSessionConfig,
    transaction?: Transaction<Database>
  ): Promise<Session | Session[]> {
    if (config.id) {
      return this.getByID({ id: config.id });
    }
    if (config.token) {
      return this.getByToken(config);
    }

    if (config.guestID) {
      return this.getByGuestID(config);
    }

    if (config.limit || config.offset) {
      return this.getAll(config);
    }
  }

  public insert(
    config: InsertSessionConfig,
    transaction?: Transaction<Database>
  ): Promise<Session> {
    return (transaction || this.kysely)
      .insertInto("Session")
      .values({
        guest_id: config.guestID,
        token: config.token,
        session_extension_minutes: config.sessionExtensionMinutes,
      })
      .executeTakeFirst()
      .then((result) =>
        this.getByID({ id: Number(result.insertId.toString()) })
      );
  }

  public async update(
    config: UpdateSessionConfig,
    transaction?: Transaction<Database>
  ): Promise<Session> {
    await (transaction || this.kysely)
      .updateTable("Session")
      .set({
        guest_id: config.guestID,
        session_extension_minutes: config.sessionExtensionMinutes,
        updated_at: sql`NOW()`,
      })
      .where("Session.token", "=", config.token)
      .executeTakeFirst();
    return this.getByToken({ token: config.token }, transaction);
  }

  private getAll(config: GetSessionConfig): Promise<Session[]> {
    return this.kysely
      .selectFrom("Session")
      .selectAll()
      .limit(config.limit)
      .offset(config.offset)
      .execute()
      .then((sessions) => sessions.map((session) => new Session(session)));
  }
  private async getByID(config: GetByIDConfig): Promise<Session> {
    const row = await this.kysely
      .selectFrom("Session")
      .selectAll()
      .where("Session.id", "=", config.id)
      .executeTakeFirst();
    return row ? new Session(row) : null;
  }

  private async getByToken(
    config: GetSessionConfig,
    transaction?: Transaction<Database>
  ): Promise<Session> {
    const row = await (transaction || this.kysely)
      .selectFrom("Session")
      .selectAll()
      .where("Session.token", "=", config.token)
      .executeTakeFirst();
    return row ? new Session(row) : null;
  }

  private getByGuestID(
    config: GetSessionConfig,
    transaction?: Transaction<Database>
  ): Promise<Session[]> {
    return (transaction || this.kysely)
      .selectFrom("Session")
      .selectAll()
      .limit(config.limit)
      .offset(config.offset)
      .where("Session.guest_id", "=", config.guestID)
      .execute()
      .then((sessions) => sessions.map((session) => new Session(session)));
  }
}
