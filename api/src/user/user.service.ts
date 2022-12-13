import {
	NotFoundException,
	Injectable,
	BadRequestException,
} from "@nestjs/common";
import {
	uniqueNamesGenerator,
	adjectives,
	colors,
	animals,
} from "unique-names-generator";

import { DatabaseService } from "src/providers/database/database.service";

@Injectable()
export class UserService {
	constructor(private db: DatabaseService) {}

	async findUserById(userId: string) {
		const user = await this.db.users.findFirst({
			where: {
				pId: userId,
			},
		});

		if (!user) {
			throw new NotFoundException("user not found");
		}

		return user;
	}

	async checkUsernameAvailability(username: string) {
		const user = await this.db.users.findFirst({
			where: {
				username,
			},
		});

		return !user?.id;
	}

	async setUsername(userId: string, username: string) {
		const [user, usernameAvailable] = await Promise.all([
			this.findUserById(userId),
			this.checkUsernameAvailability(username),
		]);

		if (!usernameAvailable) {
			throw new BadRequestException("username not available");
		}

		if (user.username) {
			throw new BadRequestException("username already set");
		}

		return this.db.users.update({
			where: {
				id: user.id,
			},
			data: {
				username,
			},
		});
	}

	async findUserByUsername(username: string) {
		const user = await this.db.users.findFirst({
			where: {
				username,
			},
		});

		if (!user) {
			throw new NotFoundException(`username ${username} not found`);
		}

		return user;
	}

	generateRandomUsername() {
		return uniqueNamesGenerator({
			dictionaries: [adjectives, animals, colors],
			length: 2,
		});
	}
}
