import { InvalidRequestException } from "@shared/exceptions/invalid-request.exception";
import { isValidId } from "@shared/validation-functions";

interface DeleteReservationRequest {
  id: unknown;
}

function validate(request: DeleteReservationRequest) {
  if (request.id && !isValidId(request.id)) {
    throw new InvalidRequestException();
  }
}

export class DeleteReservationRequestDTO {
  id: number;

  constructor(DeleteReservationRequest: { id: number }) {
    this.id = DeleteReservationRequest.id;
  }

  public static fromRequest(
    request: DeleteReservationRequest
  ): DeleteReservationRequestDTO {
    validate(request);
    return new DeleteReservationRequestDTO({
      id: request.id == null ? null : Number(request.id),
    });
  }
}
