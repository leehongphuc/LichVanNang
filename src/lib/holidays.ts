export const SOLAR_HOLIDAYS: Record<string, string> = {
    "01-01": "Tết Dương Lịch",
    "02-14": "Lễ Tình Nhân",
    "03-08": "Quốc tế Phụ nữ",
    "04-30": "Giải phóng Miền Nam",
    "05-01": "Quốc tế Lao động",
    "06-01": "Quốc tế Thiếu nhi",
    "09-02": "Quốc khánh Việt Nam",
    "10-20": "Phụ nữ Việt Nam",
    "11-20": "Nhà giáo Việt Nam",
    "12-25": "Giáng Sinh",
};

export const LUNAR_HOLIDAYS: Record<string, string> = {
    "01-01": "Tết Nguyên Đán",
    "01-02": "Tết Nguyên Đán",
    "01-03": "Tết Nguyên Đán",
    "01-15": "Tết Nguyên Tiêu",
    "03-10": "Giỗ Tổ Hùng Vương",
    "04-15": "Lễ Phật Đản",
    "05-05": "Tết Đoan Ngọ",
    "07-15": "Lễ Vu Lan",
    "08-15": "Tết Trung Thu",
    "12-23": "Ông Công Ông Táo",
};

export const getHoliday = (day: number, month: number, type: 'solar' | 'lunar'): string | null => {
    const key = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return type === 'solar' ? SOLAR_HOLIDAYS[key] : LUNAR_HOLIDAYS[key];
};
