import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePollDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString({
    each: true,
  })
  options: string[]
}

export class PollIdParamDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}

export class VoteDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  optionId: string;
}