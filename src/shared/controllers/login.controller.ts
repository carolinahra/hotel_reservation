import { LoginRequestDTO } from "@shared/requests/login.request.dto";
import { LoginService } from "@shared/services/login.service";
export interface LoginResponse {
  token: string;
}
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  public async handle(request: LoginRequestDTO): Promise<LoginResponse> {
    const token = await this.loginService.login(request);
    return { token };
  }
}
