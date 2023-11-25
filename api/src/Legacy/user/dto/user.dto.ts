import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';
import { AVATARS } from 'src/Legacy/common/constants';

export class UserNameDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @Matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
    message: 'username is not valid',
  })
  username: string;
}

export class AvatarDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.keys(AVATARS))
  avatarId: keyof typeof AVATARS;
}
