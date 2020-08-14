import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
var mixpanel = require("mixpanel-browser");
mixpanel.init(process.env.MIXPANEL_TOKEN);

export function mixpanelize<A extends any[], R>(
  session: ISession | null,
  track: string,
  data: any,
  fn: (...a: A) => R
) {
  return function (...args: A) {
    if (session != null) {
      mixpanel.identify(session.user.sub);
    }
    mixpanel.track(track, data);
    return fn(...args);
  };
}
