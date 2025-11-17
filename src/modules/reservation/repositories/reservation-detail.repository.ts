import { Repository } from "@shared/repositories/repository";
import { ReservationDetail } from "../models/reservation-detail";
import { Kysely, Transaction } from "kysely";
import { ReservationDetailTable } from "@shared/database-models/reservation-detail.databasemodel";

interface GetReservationDetailConfig {
  id?: number;
  reservationId?: number;
  roomId?: number;
  extraServiceId?: number;
  limit?: number;
  offset?: number;
}
interface UpdateReservationDetailConfig {
  id: number;
  reservationId?: number;
  roomId?: number;
  extraServiceId?: number;
}
interface InsertReservationDetailConfig {
  reservationId: number;
  roomId: number;
  extraServiceId: number;
}
interface DeleteReservationDetailConfig {
  id: number;
}

interface GetByIdConfig {
  id: number;
}

export abstract class ReservationDetailRepository extends Repository {
  abstract get(
    getReservationDetailConfig: GetReservationDetailConfig,
    transaction?: Transaction<any>
  ): Promise<ReservationDetail | ReservationDetail[]>;
  abstract update(
    updateReservationDetailConfig: UpdateReservationDetailConfig
  ): Promise<ReservationDetail>;
  abstract insert(
    insertReservationDetailConfig: InsertReservationDetailConfig,
    transaction?: Transaction<ReservationDetailTable>
  ): Promise<ReservationDetail>;
  abstract delete(
    deleteReservationDetailConfig: DeleteReservationDetailConfig
  ): Promise<boolean>;
}

export class KyselyReservationDetailRepository extends ReservationDetailRepository {
  constructor(private readonly kysely: Kysely<ReservationDetailTable>) {
    super();
  }
  public get(
    getReservationDetailConfig: GetReservationDetailConfig,
    transaction?: Transaction<ReservationDetailTable>
  ): Promise<ReservationDetail | ReservationDetail[]> {
    if (getReservationDetailConfig.id) {
      return this.getById({ id: getReservationDetailConfig.id }, transaction);
    }
    if (getReservationDetailConfig.reservationId) {
      return this.getByReservationId(getReservationDetailConfig);
    }
  }

  public update(
    updateReservationDetailConfig: UpdateReservationDetailConfig
  ): Promise<ReservationDetail> {
    if (updateReservationDetailConfig.extraServiceId) {
      return this.updateExtraServiceId(updateReservationDetailConfig);
    }
  }

  public insert(
    insertReservationDetailConfig: InsertReservationDetailConfig,
    transaction?: Transaction<ReservationDetailTable>
  ): Promise<ReservationDetail> {
    return (transaction || this.kysely)
      .insertInto("Reservation_Detail")
      .values({
        reservation_id: insertReservationDetailConfig.reservationId,
        room_id: insertReservationDetailConfig.roomId,
        extra_service_id: insertReservationDetailConfig.extraServiceId,
      })
      .executeTakeFirst()
      .then((result) =>
        this.getById({ id: Number(result.insertId) }, transaction)
      );
  }

  public delete(
    deleteReservationDetailConfig: DeleteReservationDetailConfig
  ): Promise<boolean> {
    return this.kysely
      .deleteFrom("Reservation_Detail")
      .where("Reservation_Detail.id", "=", deleteReservationDetailConfig.id)
      .execute()
      .then(() => true);
  }

  private getById(
    config: GetByIdConfig,
    transaction?: Transaction<ReservationDetailTable>
  ) {
    return (transaction || this.kysely)
      .selectFrom("Reservation_Detail")
      .selectAll()
      .where("Reservation_Detail.id", "=", config.id)
      .executeTakeFirst()
      .then(
        (reservationDetail) =>
          new ReservationDetail({
            id: reservationDetail.id,
            reservation_id: reservationDetail.reservation_id,
            room_id: reservationDetail.room_id,
            extra_service_id: reservationDetail.extra_service_id,
          })
      );
  }

  private getByReservationId(
    getReservationDetailConfig: GetReservationDetailConfig
  ) {
    return this.kysely
      .selectFrom("Reservation_Detail")
      .selectAll()
      .where(
        "Reservation_Detail.reservation_id",
        "=",
        getReservationDetailConfig.reservationId
      )
      .limit(getReservationDetailConfig.limit)
      .offset(getReservationDetailConfig.offset)
      .execute()
      .then((reservationDetails) =>
        reservationDetails.map(
          (reservationDetail) => new ReservationDetail(reservationDetail)
        )
      );
  }

  private updateExtraServiceId(
    updateReservationDetailConfig: UpdateReservationDetailConfig
  ): Promise<ReservationDetail> {
    return this.kysely
      .updateTable("Reservation_Detail")
      .set({
        extra_service_id: updateReservationDetailConfig.extraServiceId,
      })
      .where("Reservation_Detail.id", "=", updateReservationDetailConfig.id)
      .executeTakeFirst()
      .then(() => this.getById({ id: updateReservationDetailConfig.id }));
  }
}
