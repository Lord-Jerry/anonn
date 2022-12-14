import { Injectable, NotFoundException } from "@nestjs/common";

import { UserService } from "src/user/user.service";
import { DatabaseService } from "src/providers/database/database.service";

@Injectable()
export class JournalsService {
	constructor(private db: DatabaseService, private userService: UserService) {}

	async get(journalId: string) {
		const journal = await this.db.journals.findFirst({
			where: {
				pId: journalId,
			},
		});

		if (!journal) {
			throw new NotFoundException("journal not found");
		}

		return journal;
	}

	async create(userId: string, title: string, content: string) {
		const user = await this.userService.findUserById(userId);

		const journal = await this.db.journals.create({
			data: {
				title,
				content,
				userId: user.id,
				username: this.userService.generateRandomUsername(),
			},
		});

		return journal;
	}

	async delete(userId: string, journalId: string) {
		const user = await this.userService.findUserById(userId);
		const journal = await this.db.journals.findFirst({
			where: {
				pId: journalId,
				userId: user.id,
			},
		});

		if (!journal) {
			throw new NotFoundException("journal not found");
		}

		return this.db.journals.delete({
			where: {
				id: journal.id,
			},
		});
	}
}
