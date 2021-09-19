export class AccessTokenDto {
  /**
   * JSON Web Token that should be included as a bearer token in requests that
   * require authentication.
   */
  accessToken: string;
}

export const asAccessTokenDto = (jwt: string): AccessTokenDto => ({
  accessToken: jwt,
});
