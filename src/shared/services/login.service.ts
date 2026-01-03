import { GuestService } from "@guest/services/guest.service";
import { SessionService } from "@session/services/session.service";
import { InvalidPasswordException } from "@shared/exceptions/invalid-password.exception";
import { verifyPassword } from "@shared/password/password";
import { v4 as uuidv4 } from "uuid";
interface LoginProps {
  guestID: number;
  password: string;
  sessionExtensionMinutes: number;
}
export class LoginService {
  constructor(
    private readonly guestService: GuestService,
    private readonly sessionService: SessionService
  ) {}

  public async login(props: LoginProps): Promise<string> {
    try {
      const guest = await this.guestService.getOne({ id: props.guestID });
      if (!verifyPassword(guest.password, props.password)) {
        throw new InvalidPasswordException();
      }
      const token = uuidv4();
      const session = await this.sessionService.insert({
        guestID: guest.id,
        sessionExtensionMinutes: props.sessionExtensionMinutes,
        token,
      });

      return session.token;
    } catch (error) {
      throw new Error(error);
    }
  }
}
