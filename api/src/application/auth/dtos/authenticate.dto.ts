import { IsNotEmpty, IsIn, IsJWT } from 'class-validator';
import { AUTH_PROVIDERS } from 'src/infrastructure/constants';

export class AuthenticateDto {
  @IsNotEmpty()
  @IsJWT()
  token: string;

  @IsNotEmpty()
  @IsIn(Object.values(AUTH_PROVIDERS))
  provider: string;

  @IsNotEmpty()
  @IsIn(['WEB', 'IOS', 'ANDROID'])
  platform: string;
}
