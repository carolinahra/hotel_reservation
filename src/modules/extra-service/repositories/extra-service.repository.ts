import { ExtraServiceTable } from "@shared/database-models/extra-service.database-model";
import { ExtraService } from "../models/extra-service";
import { Repository } from "@shared/repositories/repository";
import { Kysely, Transaction } from "kysely";

interface GetExtraServiceConfig {
  id?: number;
  name?: string;
  price?: number;
  limit?: number;
  offset?: number;
}

interface UpdateExtraServiceConfig {
  name: string;
  price?: number;
  newPrice?: number;
}

interface InsertExtraServiceConfig {
  name: string;
  price: number;
}
interface DeleteExtraServiceConfig {
  name: string;
}

interface GetById {
  id: number;
}
export abstract class ExtraServiceRepository extends Repository {
  abstract get(
    getExtraService: GetExtraServiceConfig, transaction?: Transaction<any>
  ): Promise<ExtraService | ExtraService[]>;
  abstract update(
    updateExtraServiceConfig: UpdateExtraServiceConfig
  ): Promise<ExtraService>;
  abstract insert(
    insertExtraServiceConfig: InsertExtraServiceConfig
  ): Promise<ExtraService>;
  abstract delete(
    deleteExtraServiceConfig: DeleteExtraServiceConfig
  ): Promise<boolean>;
}

export class KyselyExtraServiceRepository extends ExtraServiceRepository {
  constructor(private readonly kysely: Kysely<ExtraServiceTable>) {
    super();
  }

  public get(
    getExtraService: GetExtraServiceConfig, transaction?: Transaction<ExtraServiceTable>
  ): Promise<ExtraService | ExtraService[]> {
    if (getExtraService.id) {
      return this.getById({ id: getExtraService.id }, transaction);
    }
    if (getExtraService.name) {
      return this.getByName(getExtraService);
    }
    if (getExtraService.price) {
        return this.getByPrice(getExtraService);
    }
    if (getExtraService.limit != null && getExtraService.offset != null) {
      return this.getAll(getExtraService);
    }
  }

  public update(
    updateExtraServiceConfig: UpdateExtraServiceConfig
  ): Promise<ExtraService> {
    if (updateExtraServiceConfig.name) {
      return this.updateName(updateExtraServiceConfig);
    }
    if (updateExtraServiceConfig.newPrice) {
      return this.updateprice(updateExtraServiceConfig);
    }
  }

  public insert(
    insertExtraServiceConfig: InsertExtraServiceConfig
  ): Promise<ExtraService> {
    return this.kysely
      .insertInto("Extra_Service")
      .values({
        name: insertExtraServiceConfig.name,
        price: insertExtraServiceConfig.price,
      })
      .execute()
      .then((result) => this.getById({ id: Number(result[0].insertId) }));
  }

  public delete(
    deleteExtraServiceConfig: DeleteExtraServiceConfig
  ): Promise<boolean> {
    return this.kysely
      .deleteFrom("Extra_Service")
      .where("Extra_Service.name", "=", deleteExtraServiceConfig.name)
      .execute()
      .then(() => true);
  }

  private getById(config: GetById, transaction?: Transaction<ExtraServiceTable>): Promise<ExtraService> {
    return (transaction || this.kysely)
      .selectFrom("Extra_Service")
      .selectAll() //
      .where("Extra_Service.id", "=", config.id)
      .executeTakeFirstOrThrow()
      .then(
        (extraService) =>
          new ExtraService({
            id: extraService.id,
            name: extraService.name,
            price: extraService.price,
          })
      );
  }

  private getAll(
    getExtraServiceConfig: GetExtraServiceConfig
  ): Promise<ExtraService[]> {
    return (
      this.kysely
        .selectFrom("Extra_Service")
        .selectAll()
        .limit(getExtraServiceConfig.limit)
        .offset(getExtraServiceConfig.offset)
        .execute()
        .then((extraServices) => {
          return extraServices.map(
            (extraService) => new ExtraService(extraService)
          );
        })
    );
  }

  private getByName(
    getExtraServiceConfig: GetExtraServiceConfig
  ): Promise<ExtraService> {
    return this.kysely
      .selectFrom("Extra_Service")
      .selectAll()
      .where("Extra_Service.name", "=", getExtraServiceConfig.name)
      .executeTakeFirst()
      .then(
        (extraService) =>
          new ExtraService({
            id: extraService.id,
            name: extraService.name,
            price: extraService.price,
          })
      );
  }

  private getByPrice(
    getExtraServiceConfig: GetExtraServiceConfig
  ): Promise<ExtraService[]> {
    return this.kysely
      .selectFrom("Extra_Service")
      .selectAll()
      .limit(getExtraServiceConfig.limit)
      .offset(getExtraServiceConfig.offset)
      .where("Extra_Service.name", "=", getExtraServiceConfig.name)
      .execute()

      .then((extraServices) =>
        extraServices.map((extraService) => new ExtraService(extraService))
      );
  }

  private updateName(
    updateExtraServiceConfig: UpdateExtraServiceConfig
  ): Promise<ExtraService> {
    return this.kysely
      .updateTable("Extra_Service")
      .set({
        name: updateExtraServiceConfig.name,
      })
      .where("Extra_Service.name", "=", updateExtraServiceConfig.name)
      .execute()
      .then(() => this.getByName({ name: updateExtraServiceConfig.name }));
  }

  private updateprice(
    updateExtraServiceConfig: UpdateExtraServiceConfig
  ): Promise<ExtraService> {
    return this.kysely
      .updateTable("Extra_Service")
      .set({
        price: updateExtraServiceConfig.newPrice,
      })
      .where("Extra_Service.name", "=", updateExtraServiceConfig.name)
      .execute()
      .then(() => this.getByName({ name: updateExtraServiceConfig.name }));
  }
}
