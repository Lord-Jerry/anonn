import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";

import { Injectable } from "@nestjs/common";

import { ConfigMangerService } from "src/common/config/";

type GoogleProfile = {
  id: string;
  name: { givenName: string; familyName: string };
  emails: { value: string }[];
  photos: { value: string }[];
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	constructor(config: ConfigMangerService) {
		super({
			clientID: config.get("GOOGLE_CLIENT_ID"),
			clientSecret: config.get("GOOGLE_SECRET"),
			callbackURL: "http://localhost:3000/google/redirect",
			scope: ["email", "profile"],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: GoogleProfile,
	){
    return {
      provider: "google",
      providerid: profile.id,
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      email: profile.emails[0].value,
      accessToken,
      refreshToken,
    }
	}
}
