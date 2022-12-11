import {
	NotFoundException,
	Injectable,
	UnauthorizedException,
	BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OAuth2Client } from "google-auth-library";

import { DatabaseService } from "src/providers/database/database.service";
import { ConfigMangerService } from "src/common/config/";
import { AuthZeroDto } from "./dto";


@Injectable()
export class AuthService {
	private client: OAuth2Client;
	constructor(
		private config: ConfigMangerService,
		private db: DatabaseService,
		private jwtService: JwtService,
	) {
		this.client = new OAuth2Client(this.config.get("GOOGLE_CLIENT_ID"));
	}

	async verifyGoogleLogin(token: string) {
		try {
			const ticket = await this.client.verifyIdToken({
				idToken: token,
				audience: this.config.get("GOOGLE_AUDIENCE_ID"),
			});
	
			const payload = ticket.getPayload();
	
			return {
				provider: "google",
				providerId: payload.sub,
				name: payload.name,
				email: payload.email,
				picture: payload.picture,
			}
		} catch (error) {
			throw new UnauthorizedException("Invalid Google Token");
		}
	}

	async generateToken(userId: string) {
		return this.jwtService.signAsync(
			{ userId },
			{
				secret: this.config.get("AT_SECRET"),
				expiresIn: "15m",
			},
		)
	}

	async createAccount(dto: AuthZeroDto) {
		const auth0User = await this.verifyGoogleLogin(dto.token);
		const findUser = await this.db.users.findFirst({
			where: {
				email: auth0User.email,
			},
		});

		if (findUser) {
			throw new BadRequestException("user already exists");
		}

		const user = await this.db.users.create({
			data: {
				...auth0User,
			},
		});

		const token = await this.generateToken(user.pId);
		return {
			...user,
			token,
		};
	}

	async loginAccount(dto: AuthZeroDto) {
		const auth0User = await this.verifyGoogleLogin(dto.token);
		const checkUserExists = await this.db.users.findFirst({
			where: {
				email: auth0User.email,
			}
		})
		if (!checkUserExists) {
			throw new UnauthorizedException("user not found");
		}


		const token = await this.generateToken(checkUserExists.pId);
		return {
			...checkUserExists,
			token,
		};
	}
}
