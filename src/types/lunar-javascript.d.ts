declare module 'lunar-javascript' {
    export class Solar {
        static fromYmd(year: number, month: number, day: number): Solar;
        getLunar(): Lunar;
        getJieQi(): string;
    }

    export class Lunar {
        getDay(): number;
        getMonth(): number;
        getYear(): number;
        getDayInGanZhi(): string;
        getMonthInGanZhi(): string;
        getYearInGanZhi(): string;
        getTimeZhi(): string;
        getZhiXing(): string;
    }

    export class Holiday {
        // Add definitions if needed
    }
}
