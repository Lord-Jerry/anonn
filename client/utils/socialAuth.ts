import { RefObject } from "react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

const GOOGLE_BTN_TEXT = {
  signin: "signin_with",
  signup: "signup_with",
} as const;

export default class SocialAuth {
  static initializeGoogle<T>(
    ref: RefObject<HTMLDivElement>,
    callback: (params: T) => void,
    type: keyof typeof GOOGLE_BTN_TEXT
  ) {
    // @ts-ignore
    const google = window.google;
    if (google) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback,
      });

      google.accounts.id.renderButton(ref.current, {
        type: "standard",
        width: "300",
        height: "40",
        size: "large",
        text: GOOGLE_BTN_TEXT[type],
        shape: "square",
      });
    }
  }
}
