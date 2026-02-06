import { Solar, Lunar, Holiday } from "lunar-javascript";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export interface CalendarDay {
    solarDate: Date;
    lunarDay: number;
    lunarMonth: number;
    lunarYear: number;
    canChiDay: string;
    canChiMonth: string;
    canChiYear: string;
    isToday: boolean;
    isOtherMonth: boolean;
    solarEvents: string[];
    lunarEvents: string[];
}

export const getMonthData = (year: number, month: number): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    // Calculate start day to fill grid (Monday start or Sunday start? Let's do Monday start for VN)
    // Day of week: 0 (Sun) -> 6 (Sat).
    // If we want Monday start:
    // Mon(1) -> 0 offset
    // Sun(0) -> 6 offset
    let startOffset = firstDayOfMonth.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const startDate = new Date(year, month - 1, 1 - startOffset);

    // 6 weeks * 7 days = 42 cells to ensure full coverage
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const solar = Solar.fromYmd(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            currentDate.getDate()
        );
        const lunar = solar.getLunar();

        const isToday =
            new Date().toDateString() === currentDate.toDateString();

        const isOtherMonth = currentDate.getMonth() + 1 !== month;

        days.push({
            solarDate: currentDate,
            lunarDay: lunar.getDay(),
            lunarMonth: lunar.getMonth(),
            lunarYear: lunar.getYear(),
            canChiDay: lunar.getDayInGanZhi(),
            canChiMonth: lunar.getMonthInGanZhi(),
            canChiYear: lunar.getYearInGanZhi(),
            isToday,
            isOtherMonth,
            solarEvents: [], // Will be populated by holiday logic later
            lunarEvents: [],
        });
    }

    return days;
};

export const formatSolarDate = (date: Date) => {
    return format(date, "EEEE, 'ngày' d 'tháng' M 'năm' yyyy", { locale: vi });
};

// Translation Maps
const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const CAN_ZH = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const CHI_ZH = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const TIET_KHI = [
    "Tiểu hàn", "Đại hàn", "Lập xuân", "Vũ thủy", "Kinh trập", "Xuân phân",
    "Thanh minh", "Cốc vũ", "Lập hạ", "Tiểu mãn", "Mang chủng", "Hạ chí",
    "Tiểu thử", "Đại thử", "Lập thu", "Xử thử", "Bạch lộ", "Thu phân",
    "Hàn lộ", "Sương giáng", "Lập đông", "Tiểu tuyết", "Đại tuyết", "Đông chí"
];
const TIET_KHI_ZH = [
    "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
    "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
    "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
    "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
];

const TRUC = ["Kiến", "Trừ", "Mãn", "Bình", "Định", "Chấp", "Phá", "Nguy", "Thành", "Thu", "Khai", "Bế"];
const TRUC_ZH = ["建", "除", "满", "平", "定", "执", "破", "危", "成", "收", "开", "闭"];

// Helper to translate Can Chi
const translateCanChi = (str: string) => {
    let res = str;
    CAN_ZH.forEach((c, i) => res = res.replace(c, CAN[i]));
    CHI_ZH.forEach((c, i) => res = res.replace(c, CHI[i]));
    return res;
};

// Helper to translate JieQi
const translateJieQi = (str: string) => {
    const idx = TIET_KHI_ZH.indexOf(str);
    return idx !== -1 ? TIET_KHI[idx] : str;
};

// Helper to translate ZhiXing
const translateZhiXing = (str: string) => {
    const idx = TRUC_ZH.indexOf(str);
    return idx !== -1 ? TRUC[idx] : str;
};

export const getDayDetail = (date: Date) => {
    const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const lunar = solar.getLunar();

    return {
        formattedSolarDate: formatSolarDate(date),
        canChiYear: translateCanChi(lunar.getYearInGanZhi()),
        canChiMonth: translateCanChi(lunar.getMonthInGanZhi()),
        canChiDay: translateCanChi(lunar.getDayInGanZhi()),
        jieQi: translateJieQi((lunar as any).getJieQi()),
        zhiXing: translateZhiXing(lunar.getZhiXing()),
        lunarDay: lunar.getDay(),
        lunarMonth: lunar.getMonth()
    };
};
