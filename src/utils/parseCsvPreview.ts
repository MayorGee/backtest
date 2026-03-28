import type { StreamPreviewRow } from '../types/backtest';

function splitCsvLine(line: string): string[] {
    const out: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
            inQuotes = !inQuotes;
            continue;
        }
        if (!inQuotes && c === ',') {
            out.push(cur.trim());
            cur = '';
            continue;
        }
        cur += c;
    }
    out.push(cur.trim());
    return out;
}

function normHeader(cell: string): string {
    return cell.toLowerCase().replace(/[\s_]/g, '');
}

/** Map common CSV header names to StreamPreviewRow keys. */
function columnIndex(headers: string[], ...aliases: string[]): number {
    const normalized = headers.map(normHeader);
    for (const a of aliases) {
        const n = normHeader(a);
        const i = normalized.indexOf(n);
        if (i !== -1) return i;
    }
    return -1;
}

export interface ParseCsvPreviewResult {
    rows: StreamPreviewRow[];
    error?: string;
}

/**
 * Parses the first lines of a CSV into preview rows (string cells).
 * Expects OHLCV-style columns; falls back to fixed column order if no recognizable header.
 */
export function parseCsvPreview(text: string, maxRows = 100): ParseCsvPreviewResult {
    const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

    if (lines.length === 0) {
        return { rows: [], error: 'File is empty.' };
    }

    const first = splitCsvLine(lines[0]);
    const headerKeywords = ['timestamp', 'time', 'date', 'datetime', 'open', 'high', 'low', 'close', 'volume', 'vol'];
    const looksLikeHeader = first.some((c) =>
        headerKeywords.includes(c.replace(/"/g, '').trim().toLowerCase()),
    );

    let headers: string[] = [];
    let dataStart = 0;

    if (looksLikeHeader && first.length >= 5) {
        headers = first;
        dataStart = 1;
    }

    const idx = (name: string, fallback: number) => {
        if (headers.length === 0) return fallback;
        const map: Record<string, string[]> = {
            timestamp: ['timestamp', 'time', 'date', 'datetime'],
            open: ['open', 'o'],
            high: ['high', 'h'],
            low: ['low', 'l'],
            close: ['close', 'c', 'adjclose'],
            volume: ['volume', 'vol', 'v'],
        };
        const aliases = map[name] ?? [name];
        const found = columnIndex(headers, ...aliases);
        return found >= 0 ? found : fallback;
    };

    const ti = idx('timestamp', 0);
    const oi = idx('open', 1);
    const hi = idx('high', 2);
    const li = idx('low', 3);
    const ci = idx('close', 4);
    const vi = idx('volume', 5);

    const rows: StreamPreviewRow[] = [];

    for (let i = dataStart; i < lines.length && rows.length < maxRows; i++) {
        const cells = splitCsvLine(lines[i]);
        const need = Math.max(ti, oi, hi, li, ci, vi) + 1;
        if (cells.length < need) continue;

        rows.push({
            timestamp: cells[ti] ?? '',
            open: cells[oi] ?? '',
            high: cells[hi] ?? '',
            low: cells[li] ?? '',
            close: cells[ci] ?? '',
            volume: cells[vi] ?? '',
        });
    }

    if (rows.length === 0) {
        return { rows: [], error: 'No data rows found. Expected columns like time, open, high, low, close, volume.' };
    }

    return { rows };
}
