export class RoomANotAvailableException extends Error {
  constructor(message?: string) {
    super(message || "Room Not Available");
  }
}
