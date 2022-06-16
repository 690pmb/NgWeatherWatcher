export class Token {
  /**
   * @param {number} exp expiration date
   * @param {number} iat generation date
   * @param {string} jti Jwt id
   * @param {string} sub name
   * @param {string} location favourite user's location
   */
  constructor(
    public exp: number,
    public iat: number,
    public jti: string,
    public sub: string,
    public location: string
  ) {}
}
