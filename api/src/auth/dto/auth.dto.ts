import { IsNotEmpty, IsIn, IsJWT } from 'class-validator';

export class AuthZeroDto {
  @IsNotEmpty()
  @IsJWT()
  token: string;

  @IsNotEmpty()
  @IsIn(['google'])
  platform: string;
}

