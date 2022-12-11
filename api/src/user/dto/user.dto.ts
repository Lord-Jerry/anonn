import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserNameDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, { message: 'username is not valid' })
  username: string;
}