import { IsNotEmpty, IsIn, IsJWT, IsString, IsOptional } from 'class-validator';

export class AuthZeroDto {
  @IsNotEmpty()
  @IsJWT()
  token: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsIn(['google', 'apple'])
  platform: string;
}
