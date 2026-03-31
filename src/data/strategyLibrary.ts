import type { BacktestParams } from '../context/backtestReducer';
import type { StrategyId } from '../types/backtest';

export interface BuiltInStrategyCard {
    kind: 'builtin';
    strategyId: StrategyId;
}

export interface TemplateStrategyCard {
    kind: 'template';
    id: string;
    name: string;
    description: string;
    strategyId: StrategyId;
    /** Applied in Forge together with `strategyId` (merged onto current params). */
    presetParams: Partial<BacktestParams>;
    tags: string[];
}

const BUILTIN_META: Record<StrategyId, { blurb: string; tags: string[] }> = {
    sma_crossover: { blurb: 'Classic trend following via moving-average cross.', tags: ['Trend', 'Classic'] },
    rsi: { blurb: 'Mean-reversion signals from relative strength extremes.', tags: ['Mean reversion', 'Oscillator'] },
    buy_hold: { blurb: 'Baseline long-only exposure over the full window.', tags: ['Baseline'] },
};

export function builtInCards(): (BuiltInStrategyCard & { name: string; description: string; tags: string[] })[] {
    const order: StrategyId[] = ['sma_crossover', 'rsi', 'buy_hold'];
    const labels: Record<StrategyId, string> = {
        sma_crossover: 'SMA Crossover',
        rsi: 'RSI',
        buy_hold: 'Buy & Hold',
    };
    return order.map((strategyId) => ({
        kind: 'builtin' as const,
        strategyId,
        name: labels[strategyId],
        description: BUILTIN_META[strategyId].blurb,
        tags: BUILTIN_META[strategyId].tags,
    }));
}

export const STRATEGY_TEMPLATES: TemplateStrategyCard[] = [
    {
        kind: 'template',
        id: 'mean-rev-alpha',
        name: 'Mean reversion alpha',
        description:
            'Tighter RSI bands for shorter-term fades: period 14, oversold 28, overbought 72. Still the RSI engine—different defaults.',
        strategyId: 'rsi',
        presetParams: { rsiPeriod: 14, rsiOversold: 28, rsiOverbought: 72 },
        tags: ['Template', 'RSI'],
    },
    {
        kind: 'template',
        id: 'trend-draft',
        name: 'Trend draft (fast trend)',
        description:
            'Faster SMA pair (12 / 26) tuned for liquid spot-style trends. Same SMA crossover engine with template defaults.',
        strategyId: 'sma_crossover',
        presetParams: { fastPeriod: 12, slowPeriod: 26 },
        tags: ['Template', 'Trend'],
    },
];

/** Single list: built-ins first, then templates (for one Strategies grid). */
export type StrategyLibraryRow =
    | (ReturnType<typeof builtInCards>[number] & { kind: 'builtin' })
    | TemplateStrategyCard;

export function allStrategyLibraryRows(): StrategyLibraryRow[] {
    return [...builtInCards(), ...STRATEGY_TEMPLATES];
}

function formatPresetSummary(card: TemplateStrategyCard): string {
    const p = card.presetParams;
    if (card.strategyId === 'sma_crossover') {
        return `Forge preset: fast ${p.fastPeriod ?? '—'}, slow ${p.slowPeriod ?? '—'}`;
    }
    if (card.strategyId === 'rsi') {
        return `Forge preset: period ${p.rsiPeriod ?? '—'}, OB ${p.rsiOverbought ?? '—'}, OS ${p.rsiOversold ?? '—'}`;
    }
    return '';
}

export function templatePresetSummary(card: TemplateStrategyCard): string {
    return formatPresetSummary(card);
}
