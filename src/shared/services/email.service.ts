import nodemailer, { Transporter, TransportOptions } from "nodemailer";
export interface EmailConfig {
  email: string;
  password: string;
}
export interface MessageProps {
  to: string;
  subject: string;
  text: string;
  html?: string;
}
export abstract class EmailService {
  abstract send(messageProps: MessageProps);
}

export class GmailEmailService extends EmailService {
  private transport: Transporter;
  constructor(private readonly config: EmailConfig) {
    super();
    this.transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email,
        pass: config.password,
      },
    });
  }

  send(messageProps: MessageProps): Promise<TransportOptions> {
    const from = this.config.email;
    return this.transport.sendMail({
      from,
      ...messageProps,
    });
  }
}

