import { GuestService } from "@guest/services/guest.service";
import { SessionService } from "@session/services/session.service";
import { InvalidPasswordException } from "@shared/exceptions/invalid-password.exception";
import { verifyPassword } from "@shared/password/password";
import { v4 as uuidv4 } from "uuid";
interface LoginProps {
  email: string;
  password: string;
}
export class LoginService {
  constructor(
    private readonly guestService: GuestService,
    private readonly sessionService: SessionService
  ) {}

  public async login(props: LoginProps): Promise<string> {
    const guest = await this.guestService.getOne({ email: props.email });
    if (!verifyPassword(guest.password, props.password)) {
      throw new InvalidPasswordException();
    }
    const token = uuidv4();
    const session = await this.sessionService.insert({
      guestID: guest.id,
      sessionExtensionMinutes: Number(process.env.SESSION_EXTENSION_MINUTES),
      token,
    });

    return session.toPrimitives().token;
  }
}
