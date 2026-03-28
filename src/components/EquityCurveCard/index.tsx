import { useId, useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    type TooltipProps,
} from 'recharts';
import { useBacktest } from '../../context/BacktestContext';
import type { EquityChartPoint } from '../../types/backtest';
import styles from './equity-curve-card.module.scss';

const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

function formatY(v: number): string {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return `${Math.round(v)}`;
}

function EquityTooltip({
    active,
    payload,
}: TooltipProps<number, string> & { payload?: { payload: EquityChartPoint }[] }) {
    if (!active || !payload?.[0]) return null;
    const p = payload[0].payload as EquityChartPoint;
    return (
        <div className={styles.tooltip}>
            <p className={styles.tooltipDate}>{p.date}</p>
            <p className={styles.tooltipRow}>Equity: {usd.format(p.equity)}</p>
            <p className={styles.tooltipDrawdown}>Drawdown: {p.drawdown.toFixed(1)}%</p>
        </div>
    );
}

type YScaleMode = 'linear' | 'log';

export function EquityCurveCard() {
    const { state } = useBacktest();
    const { equitySeries, runStatus } = state;
    const [yScale, setYScale] = useState<YScaleMode>('linear');
    const gradId = useId().replace(/:/g, '');

    const logDomain = useMemo((): [number, 'auto'] => {
        if (!equitySeries?.length) return [1, 'auto'];
        const minE = Math.min(...equitySeries.map((d) => d.equity));
        const floor = Math.max(minE * 0.92, 1);
        return [floor, 'auto'];
    }, [equitySeries]);

    if (runStatus === 'running') {
        return (
            <section className={styles.section} aria-label="Equity curve" aria-busy="true">
                <h2 className={styles.title}>Equity curve</h2>
                <div className={styles.panel}>
                    <div className={styles.header}>
                        <h3 className={styles.heading}>Equity performance</h3>
                    </div>
                    <div className={styles.skeleton} />
                </div>
            </section>
        );
    }

    if (!equitySeries?.length) {
        return (
            <section className={styles.section} aria-label="Equity curve">
                <h2 className={styles.title}>Equity curve</h2>
                <p className={styles.empty}>Run a backtest to plot the equity curve.</p>
            </section>
        );
    }

    return (
        <section className={styles.section} aria-label="Equity curve">
            <h2 className={styles.title}>Equity curve</h2>
            <div className={styles.panel}>
                <div className={styles.header}>
                    <h3 className={styles.heading}>Equity performance</h3>
                    <div className={styles.toggleGroup} role="group" aria-label="Y-axis scale">
                        <button
                            type="button"
                            className={`${styles.toggle} ${yScale === 'linear' ? styles.toggleActive : ''}`}
                            onClick={() => setYScale('linear')}
                        >
                            Linear
                        </button>
                        <button
                            type="button"
                            className={`${styles.toggle} ${yScale === 'log' ? styles.toggleActive : ''}`}
                            onClick={() => setYScale('log')}
                        >
                            Logarithmic
                        </button>
                    </div>
                </div>
                <div className={styles.chartWrap}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={equitySeries} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                            <defs>
                                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#8b919e', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                dy={6}
                            />
                            <YAxis
                                scale={yScale === 'log' ? 'log' : 'linear'}
                                domain={yScale === 'log' ? logDomain : ['auto', 'auto']}
                                tick={{ fill: '#8b919e', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatY}
                                width={44}
                            />
                            <Tooltip content={<EquityTooltip />} cursor={{ stroke: 'rgba(124,158,255,0.35)' }} />
                            <Area
                                type="monotone"
                                dataKey="equity"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill={`url(#${gradId})`}
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 2, stroke: '#a5b4fc', fill: '#6366f1' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
