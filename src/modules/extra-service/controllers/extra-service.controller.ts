import { ExtraService } from "../models/extra-service";
import { DeleteExtraServiceRequestDTO } from "../requests/delete-extra-service.request.dto";
import { GetExtraServiceRequestDTO } from "../requests/get-extra-service.request.dto";
import { InsertExtraServiceRequestDTO } from "../requests/insert-extra-service.request.dto";
import { UpdateExtraServiceRequestDTO } from "../requests/update-extra-service.request.dto";
import { ExtraServiceService } from "../services/extra-service.service";

export class ExtraServiceController {
  constructor(private readonly service: ExtraServiceService) {}

  public get(
    request: GetExtraServiceRequestDTO
  ): Promise<ExtraService | ExtraService[]> {
    if (request.id || request.name) {
      return this.service.getOne(request);
    }
    return this.service.getMany(request);
  }
  public update(request: UpdateExtraServiceRequestDTO): Promise<ExtraService> {
    return this.service.update(request);
  }
  public insert(request: InsertExtraServiceRequestDTO): Promise<ExtraService> {
    return this.service.insert(request);
  }
  public delete(request: DeleteExtraServiceRequestDTO): Promise<boolean> {
    return this.service.delete(request);
  }
}
