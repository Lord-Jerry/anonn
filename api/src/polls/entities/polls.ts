import { Exclude, Expose, Transform } from "class-transformer";
import { poll_options } from "@prisma/client";

type PollOptions = poll_options & { votes: number };

export class PollEntity {
	@Exclude()
	pId: string;
	@Exclude()
	creatorId: number;
  @Exclude()
  poll_options: PollOptions[];

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
			votes: option.votes,
    }));
  }

	constructor(partial: Partial<PollEntity>) {
		Object.assign(this, partial);
	}
}
