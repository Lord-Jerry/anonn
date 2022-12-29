import { RefObject, useEffect } from "react";
import AuthService from "services/auth";
import SocialAuth from "utils/socialAuth";

export type AuthenticateFunctionReturnType = Awaited<
  ReturnType<typeof AuthService.prototype["authenticate"]>
>;
type SuccessCallbackType = (res: AuthenticateFunctionReturnType) => void;
type ErrorCallbackType = (res: AuthenticateFunctionReturnType) => void;
type Props = {
  isUserLoggedIn: boolean;
  useDefaultCallback?: false;
  googleBtnRef: RefObject<HTMLDivElement>;
  successCallback: SuccessCallbackType;
  errorCallback: ErrorCallbackType;
};
export default function useGoogleAuth({
  googleBtnRef,
  isUserLoggedIn,
  errorCallback,
  successCallback,
}: Props) {
  const callback = async (payload: { credential: string }) => {
    const authService = new AuthService();
    const res = await authService.authenticate(
      payload.credential,
      "google"
    );

    return res ? successCallback(res) : errorCallback(res);
  };
  useEffect(() => {
    // @ts-ignore
    if (window.google) return;
    if (isUserLoggedIn) return;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.addEventListener("load", function () {
      SocialAuth.initializeGoogle(googleBtnRef, callback, "continueWith");
    });
    script.src = "https://accounts.google.com/gsi/client";
    document.getElementsByTagName("head")[0].appendChild(script);
  }, []);
}
