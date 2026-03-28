import type { StrategyId } from '../types/backtest';

export interface BuiltInStrategyCard {
    kind: 'builtin';
    strategyId: StrategyId;
}

export interface TemplateStrategyCard {
    kind: 'template';
    /** Stable id for keys; applies `strategyId` in Forge until full engine exists. */
    id: string;
    name: string;
    description: string;
    strategyId: StrategyId;
    tags: string[];
}

export type StrategyLibraryCard = BuiltInStrategyCard | TemplateStrategyCard;

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
        name: 'Mean Reversion Alpha',
        description: 'RSI-style fades with a volatility regime filter — ships as RSI in Forge for now.',
        strategyId: 'rsi',
        tags: ['Template', 'Alpha'],
    },
    {
        kind: 'template',
        id: 'trend-draft',
        name: 'Trend Draft',
        description: 'Dual moving-average template tuned for liquid spot pairs. Maps to SMA Crossover.',
        strategyId: 'sma_crossover',
        tags: ['Template', 'Trend'],
    },
];
