import { Transaction } from "kysely";
import { ReservationDetail } from "../models/reservation-detail";
import { ReservationDetailRepository } from "../repositories/reservation-detail.repository";
import { ReservationDetailTable } from "@shared/database-models/reservation-detail.databasemodel";

interface GetReservationDetail {
  id?: number;
}
interface GetManyReservationDetails {
  reservationId?: number;
  roomId?: number;
  extraServiceId?: number;
  limit?: number;
  offset?: number;
}
interface UpdateReservationDetail {
  id: number;
  reservationId?: number;
  roomId?: number;
  extraServiceId?: number;
}
interface InsertReservationDetail {
  reservationId: number;
  roomId: number;
  extraServiceId: number;
}
interface DeleteReservationDetail {
  id: number;
}

export class ReservationDetailService {
  constructor(private readonly repository: ReservationDetailRepository) {}

  public async getOne(
    getReservationDetail: GetReservationDetail,
    transaction?: Transaction<ReservationDetailTable>
  ): Promise<ReservationDetail> {
    const reservationDetail = await this.repository.get(
      getReservationDetail,
      transaction
    );
    return Array.isArray(reservationDetail)
      ? reservationDetail.pop()
      : reservationDetail;
  }

  public async getMany(
    getReservationDetail: GetManyReservationDetails
  ): Promise<ReservationDetail[]> {
    const reservationDetails = await this.repository.get(getReservationDetail);
    return Array.isArray(reservationDetails)
      ? reservationDetails
      : [reservationDetails];
  }
  public update(
    updateReservationDetail: UpdateReservationDetail
  ): Promise<ReservationDetail> {
    return this.repository.update(updateReservationDetail);
  }
  public insert(
    insertReservationDetail: InsertReservationDetail,
    transaction?: Transaction<ReservationDetailTable>
  ): Promise<ReservationDetail> {
    return this.repository.insert(insertReservationDetail, transaction);
  }
  public delete(
    deleteReservationDetail: DeleteReservationDetail
  ): Promise<boolean> {
    return this.repository.delete(deleteReservationDetail);
  }
}
