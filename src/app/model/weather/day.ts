import { Condition } from './condition';

export class Day {
    maxTempC: number;
    minTempC: number;
    avgTempC: number;
    maxWindKph: number;
    totalPrecipMm: number;
    avgVisKm: number;
    avgHumidity: number;
    condition: Condition;
    uv: number;
    dailyWillItRain: number;
    dailyChanceOfRain: number;
    dailyWillItSnow: number;
    dailyChanceOfSnow: number;
}
