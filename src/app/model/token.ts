import {JwtPayload} from 'jwt-decode';

/**
 * @param {number} exp expiration date
 * @param {number} iat generation date
 * @param {string} jti Jwt id
 * @param {string} sub name
 * @param {string} location favourite user's location
 * @param {string} timezone user timezone
 */
export type Token = JwtPayload & {
  location: string;
  lang: 'en' | 'fr';
  timezone: string;
};
