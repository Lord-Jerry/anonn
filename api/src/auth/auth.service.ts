import * as crypto from "crypto";
import {
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OAuth2Client } from "google-auth-library";
import appleSigninAuth from 'apple-signin-auth';

import { DatabaseService } from "src/providers/database/database.service";
import { ConfigMangerService } from "src/common/config/";
import { UserService } from "src/user/user.service";
import { AuthZeroDto } from "./dto";


@Injectable()
export class AuthService {
	private client: OAuth2Client;
	constructor(
		private config: ConfigMangerService,
		private db: DatabaseService,
		private jwtService: JwtService,
		private userService: UserService,
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
			}
		} catch (error) {
			throw new UnauthorizedException("Invalid Google Token");
		}
	}

	async verifyAppleLogin(token: string) {
		const nonce = 'abc123_nonce'
		const appleIdTokenClaims = await appleSigninAuth.verifyIdToken(token, {
			audience: ['com.anonn.ios', 'com.anonn.web'],
			/** sha256 hex hash of raw nonce */
			nonce: nonce ? crypto.createHash('sha256').update(nonce).digest('hex') : undefined,
		});

		return {
			provider: "apple",
			providerId: appleIdTokenClaims.sub,
			name: this.userService.generateRandomUsername(),
			email: appleIdTokenClaims.email,
		}
	}

	async generateToken(userId: string) {
		return this.jwtService.signAsync(
			{ userId },
			{
				secret: this.config.get("AT_SECRET"),
				expiresIn: "31d",
			},
		)
	}

	async createAccount(authZeroUser: Awaited<ReturnType<typeof this.verifyGoogleLogin>>) {
		const user = await this.db.users.create({
			data: {
				...authZeroUser,
			},
		});

		const token = await this.generateToken(user.pId);
		return {
			...user,
			token,
		};
	}


	async authenticate (dto: AuthZeroDto) {
		const auth0User = dto.platform === 'google' ? await this.verifyGoogleLogin(dto.token) : await this.verifyAppleLogin(dto.token);
		const findUser = await this.db.users.findFirst({
			where: {
				email: auth0User.email,
			},
		});

		
		// apple only returns name on first login/signup,
		// so if payload has name, then it can be assumed to be the first login/signup
		if (!findUser && dto.name && dto.platform === 'apple') {
			auth0User.name = dto.name;
		}

		if (!findUser) {
			return this.createAccount(auth0User)
		}

		if (auth0User.provider !== findUser.provider) {
			throw new UnauthorizedException("Email already registered with different provider");
		}

		const token = await this.generateToken(findUser.pId);
		return {
			...findUser,
			token,
		};
	}
}
