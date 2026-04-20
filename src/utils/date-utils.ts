const SHANGHAI_TIME_ZONE = 'Asia/Shanghai';
const SHANGHAI_OFFSET_MINUTES = 8 * 60;
const SHANGHAI_OFFSET_MS = SHANGHAI_OFFSET_MINUTES * 60 * 1000;

const monthMap: Record<string, number> = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12
};

function createShanghaiDate(year: number, month: number, day: number, hour = 0, minute = 0) {
    return new Date(Date.UTC(year, month - 1, day, hour, minute) - SHANGHAI_OFFSET_MS);
}

function parseEnglishMonthDate(value: string) {
    const matched = value
        .trim()
        .match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2})(?:,)?\s+(\d{4})$/i);

    if (!matched) {
        return null;
    }

    const [, monthName, day, year] = matched;
    const month = monthMap[monthName.slice(0, 3).toLowerCase()];

    return createShanghaiDate(Number(year), month, Number(day));
}

export function parseContentDate(value: string | Date) {
    if (value instanceof Date) {
        return value;
    }

    const normalizedValue = value.trim();

    const fullDateTimeMatch = normalizedValue.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})$/);
    if (fullDateTimeMatch) {
        const [, year, month, day, hour, minute] = fullDateTimeMatch;
        return createShanghaiDate(Number(year), Number(month), Number(day), Number(hour), Number(minute));
    }

    const dateOnlyMatch = normalizedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        return createShanghaiDate(Number(year), Number(month), Number(day));
    }

    const englishMonthDate = parseEnglishMonthDate(normalizedValue);
    if (englishMonthDate) {
        return englishMonthDate;
    }

    const fallbackDate = new Date(normalizedValue);
    if (!Number.isNaN(fallbackDate.getTime())) {
        return fallbackDate;
    }

    throw new Error(
        `Invalid date "${value}". Use "YYYY-MM-DD-HH-mm" for new posts, for example "2026-01-01-22-30".`
    );
}

export function formatDateForDisplay(date: Date) {
    return new Intl.DateTimeFormat('zh-CN', {
        timeZone: SHANGHAI_TIME_ZONE,
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

export { SHANGHAI_TIME_ZONE };
