import { EmailService, MessageProps } from "@shared/services/email.service";

export class EmailServiceMock extends EmailService {
  public entryInputs: MessageProps[] = [];
  send(messageProps: MessageProps): void {
    this.entryInputs.push(messageProps);
  }
}
