import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";

import { UserService } from "src/user/user.service";
import { DatabaseService } from "src/providers/database/database.service";

@Injectable()
export class PollsService {
	constructor(private db: DatabaseService, private userService: UserService) {}

	async checkIfPollExists(pollId: string) {
    const poll = await this.db.polls.findUnique({
			where: {
				pId: pollId,
			},
			include: {
				poll_options: true,
			},
		});

		if (!poll) {
			throw new NotFoundException("Poll not found");
		}

		return poll;
  }
  
  async createPoll(userId: string, question: string, options: string[]) {
		const user = await this.userService.findUserById(userId);
		return this.db.polls.create({
			data: {
				question,
				creatorId: user.id,
				poll_options: {
					create: options.map((option) => ({
						option,
					})),
				},
			},
		});
	}

	async getSinglePoll(pollId: string) {
		const poll = await this.checkIfPollExists(pollId);
    /** Potiential optimization strategy:
     * 1. cache this result and recompute at certain intervals
     * 2. create a cache entry for each poll option and increment/decrement the count on vote
     */
    const pollResult = await this.db.votes.groupBy({
      by: ['optionId'],
      where: {
        pollId: poll.id,
      },
      _count: {
        optionId: true,
      },
    });

    return {
      ...poll,
      poll_options: poll.poll_options.map((option) => {
        const result = pollResult.find((result) => result.optionId === option.id);
  
        return {
          ...option,
          votes: result?._count.optionId || 0,
        }
      })
    }
	}

	async deletePoll(userId: string, pollId: string) {
		const [user, poll] = await Promise.all([
			this.userService.findUserById(userId),
			this.checkIfPollExists(pollId),
		]);

		if (poll.creatorId !== user.id) {
			throw new ForbiddenException();
		}

		return this.db.polls.delete({
			where: {
				id: poll.id,
			},
		});
	}

	async voteOnPoll(userId: string, pollId: string, optionId: string) {
		const [user, poll] = await Promise.all([
			this.userService.findUserById(userId),
			this.checkIfPollExists(pollId),
		]);

		// TODO: implement logic that chevks if the poll is not expired.
		const option = poll.poll_options.find((option) => option.pId === optionId);
		if (!option) {
			throw new ForbiddenException("invalid selection");
		}

		const vote = await this.db.votes.findFirst({
			where: {
				userId: user.id,
				pollId: poll.id,
			},
		});
		if (vote) {
			throw new ForbiddenException("You have already voted");
		}

		return this.db.votes.create({
			data: {
				userId: user.id,
				pollId: poll.id,
				optionId: option.id,
			},
		});
	}
}
