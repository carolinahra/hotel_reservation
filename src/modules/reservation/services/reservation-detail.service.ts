import { Transaction } from "kysely";
import { ReservationDetail } from "../models/reservation-detail";
import { ReservationDetailRepository } from "../repositories/reservation-detail.repository";
import { ReservationDetailTable } from "@shared/database-models/reservation-detail.databasemodel";

interface GetReservationDetail {
  id?: number;
  reservationId?: number;
  roomId?: number;
  extraServiceId?: number;
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

  public get(
    getReservationDetail: GetReservationDetail,
    transaction?: Transaction<ReservationDetailTable>
  ): Promise<ReservationDetail | ReservationDetail[]> {
    return this.repository.get(getReservationDetail, transaction);
  }
  public update(
    updateReservationDetail: UpdateReservationDetail
  ): Promise<ReservationDetail> {
    return this.repository.update(updateReservationDetail);
  }
  public insert(
    insertReservationDetail: InsertReservationDetail
  ): Promise<ReservationDetail> {
    return this.repository.insert(insertReservationDetail);
  }
  public delete(
    deleteReservationDetail: DeleteReservationDetail
  ): Promise<boolean> {
    return this.repository.delete(deleteReservationDetail);
  }
}
