import {
  DeleteExtraServiceResponse,
  GetExtraServiceResponse,
  InsertExtraServiceResponse,
  UpdateExtraServiceResponse,
} from "@extraService/responses/extra-service.response";
import { ExtraService } from "../models/extra-service";
import { DeleteExtraServiceRequestDTO } from "../requests/delete-extra-service.request.dto";
import { GetExtraServiceRequestDTO } from "../requests/get-extra-service.request.dto";
import { InsertExtraServiceRequestDTO } from "../requests/insert-extra-service.request.dto";
import { UpdateExtraServiceRequestDTO } from "../requests/update-extra-service.request.dto";
import { ExtraServiceService } from "../services/extra-service.service";
import { ErrorResponse } from "@shared/exceptions/error-response";
import { ExceptionService } from "@shared/services/exception.service";

export class ExtraServiceController {
  constructor(
    private readonly service: ExtraServiceService,
    private readonly exceptionService: ExceptionService
  ) {}

  public async get(
    request: GetExtraServiceRequestDTO
  ): Promise<
    GetExtraServiceResponse | GetExtraServiceResponse[] | ErrorResponse
  > {
    try {
      if (request.id || request.name) {
        const extraService = await this.service.getOne(request);
        return {
          id: extraService.id,
          name: extraService.name,
          price: extraService.price,
        };
      }
      const extraServices = await this.service.getMany(request);
      return extraServices.map((extraService) => {
        return {
          id: extraService.id,
          name: extraService.name,
          price: extraService.price,
        };
      });
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async update(
    request: UpdateExtraServiceRequestDTO
  ): Promise<UpdateExtraServiceResponse | ErrorResponse> {
    try {
      const extraService = await this.service.update(request);
      return {
        id: extraService.id,
        name: extraService.name,
        price: extraService.price,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async insert(
    request: InsertExtraServiceRequestDTO
  ): Promise<InsertExtraServiceResponse | ErrorResponse> {
    try {
      const extraService = await this.service.insert(request);
      return {
        id: extraService.id,
        name: extraService.name,
        price: extraService.price,
      };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
  public async delete(
    request: DeleteExtraServiceRequestDTO
  ): Promise<DeleteExtraServiceResponse | ErrorResponse> {
    try {
      const isDeletedExtraService = await this.service.delete(request);
      return { isDeletedExtraService };
    } catch (error) {
      return this.exceptionService.handle(error);
    }
  }
}
