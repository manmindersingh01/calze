import Nylas from "nylas";

export const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_URI_KEY!,
});

export const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID,
  redirectUri: process.env.NYLAS_REDIRECT_URI + "/api/oauth/exchange",
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_URI_KEY!,
};
