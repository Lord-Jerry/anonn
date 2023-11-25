import { Exclude, Transform } from 'class-transformer';

export class UserEntity {
  @Exclude()
  pId: string;
  @Exclude()
  providerId: string;
  @Exclude()
  provider: string;

  @Transform(({ obj }) => obj.pId)
  id: string | number;
  name: string;
  email: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
