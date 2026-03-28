export interface IntervalOption {
    value: string;
    label: string;
}

export interface ExchangeOption {
    value: string;
    label: string;
}

/** Bar size for exchange-backed history (MVP labels). */
export const INTERVAL_OPTIONS: IntervalOption[] = [
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '1d', label: '1D' },
];

export const EXCHANGE_OPTIONS: ExchangeOption[] = [
    { value: 'Binance', label: 'Binance' },
    { value: 'Bybit', label: 'Bybit' },
];

export function intervalLabel(value: string): string {
    return INTERVAL_OPTIONS.find((o) => o.value === value)?.label ?? value.toUpperCase();
}
