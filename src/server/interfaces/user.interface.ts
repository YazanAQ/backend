export interface SOCIAL_MEDIA_I {
  account: {
    access_token: string;
    expires_at: number;
    id_token: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    type: string;
  };
  profile: {
    at_hash: string;
    aud: string;
    azp: string;
    email: string;
    email_verified: boolean;
    exp: number;
    family_name: string;
    given_name: string;
    hd: string;
    iat: number;
    iss: string;
    locale: string;
    name: string;
    picture: string;
    sub: string;
  };
  token: {
    email: string;
    name: string;
    picture: string;
    sub: string;
  };
  user: {
    email: string;
    id: string;
    image: string;
    name: string;
  };
}
