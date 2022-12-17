import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';
import { AVATARS } from 'src/common/constants';

export class UserNameDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, {
    message: 'username is not valid',
  })
  username: string;
}

export class AvatarDto {
  @IsNotEmpty()
  @IsString()
  @IsIn([Object.keys(AVATARS)])
  avatarId: keyof typeof AVATARS;
}
