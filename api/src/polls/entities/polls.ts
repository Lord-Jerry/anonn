import { Exclude, Expose, Transform } from "class-transformer";
import { poll_options } from "@prisma/client";

export class PollEntity {
	@Exclude()
	pId: string;
	@Exclude()
	creatorId: number;
  @Exclude()
  poll_options: poll_options[];

	@Transform(({ obj }) => obj.pId)
	id: string | number;

  question: string;

	createdAt: Date;
	updatedAt: Date;

  @Expose()
  get options() {
    return this?.poll_options?.map((option) => ({
      id: option.pId,
      option: option.option,
    }));
  }

	constructor(partial: Partial<PollEntity>) {
		Object.assign(this, partial);
	}
}
