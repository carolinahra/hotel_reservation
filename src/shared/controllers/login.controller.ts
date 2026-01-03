import { LoginRequestDTO } from "@shared/requests/login.request.dto";
import { LoginService } from "@shared/services/login.service";

export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  public handle(request: LoginRequestDTO): Promise<string> {
    return this.loginService.login(request);
  }
}
