import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import { isValidId } from "@shared/validation-functions";

export interface DeleteRoomRequest {
  id: unknown;
}

function validate(request: DeleteRoomRequest): void {
  if (request.id && !isValidId(request.id)) {
    throw new InvalidRequestException();
  }
}

export class DeleteRoomRequestDTO {
  id: number;

  constructor(DeleteRoomRequest: { id: number }) {
    this.id = DeleteRoomRequest.id;
  }

  public static fromRequest(request: DeleteRoomRequest): DeleteRoomRequestDTO {
    validate(request);
    return new DeleteRoomRequestDTO({
      id: request.id == null ? null : Number(request.id),
    });
  }
}
