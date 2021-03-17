export class Token {
    /**
     * @param exp expiration date
     * @param iat generation date
     * @param jti Jwt id
     * @param sub name
     * @param location favourite user's location
     */
    constructor(
        public exp: number,
        public iat: number,
        public jti: string,
        public sub: string,
        public location: string
    ) {}
}
