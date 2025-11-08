import { ExtraServiceRepository } from "@extraService/repositories/extra-service.repository";
import { ExtraService } from "../models/extra-service";

interface GetExtraService {
  id?: number;
  name?: string;
}

interface GetManyExtraServices extends GetExtraService {
  price?: number;
  limit?: number;
  offset?: number;
}

interface UpdateExtraService {
  name: string;
  price?: number;
  newPrice?: number;
}

interface InsertExtraService {
  name: string;
  price: number;
}
interface DeleteExtraService {
  name: string;
}

export class ExtraServiceService {
  constructor(private readonly repository: ExtraServiceRepository) {}
  public async getOne(getExtraService: GetExtraService): Promise<ExtraService> {
    const extraService = await this.repository.get(getExtraService);
    return Array.isArray(extraService) ? extraService.pop() : extraService;
  }
  public async getMany(
    getExtraService: GetExtraService
  ): Promise<ExtraService[]> {
    const extraServices = await this.repository.get(getExtraService);
    return Array.isArray(extraServices) ? extraServices : [extraServices];
  }
  public update(updateExtraService: UpdateExtraService): Promise<ExtraService> {
    return this.repository.update(updateExtraService);
  }
  public insert(insertExtraService: InsertExtraService): Promise<ExtraService> {
    return this.repository.insert(insertExtraService);
  }
  public delete(deleteExtraService: DeleteExtraService): Promise<boolean> {
    return this.repository.delete(deleteExtraService);
  }
}
