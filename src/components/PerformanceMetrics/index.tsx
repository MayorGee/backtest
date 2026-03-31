import { useBacktest } from '../../context/BacktestContext';
import type { DisplayMetric, MetricTone } from '../../types/backtest';
import styles from './performance-metrics.module.scss';

function valueClass(tone?: MetricTone, emphasized?: boolean): string {
    const base = styles.value;
    if (tone === 'profit') return `${base} ${styles.valueProfit}`;
    if (tone === 'loss') return `${base} ${styles.valueLoss}`;
    if (tone === 'accent') return `${base} ${styles.valueAccent}`;
    if (emphasized) return `${base} ${styles.valueProfit}`;
    return base;
}

function MetricCard({ metric }: { metric: DisplayMetric }) {
    const cardClass =
        metric.emphasized && metric.tone !== 'loss'
            ? `${styles.card} ${styles.cardEmphasized}`
            : styles.card;

    return (
        <li className={cardClass}>
            <span className={styles.label}>{metric.label}</span>
            <p className={valueClass(metric.tone, metric.emphasized)}>{metric.value}</p>
        </li>
    );
}

export function PerformanceMetrics() {
    const { state } = useBacktest();
    const { displayMetrics, runStatus } = state;

    if (runStatus === 'running') {
        return (
            <section className={styles.section} aria-label="Performance metrics" aria-busy="true">
                <h2 className={styles.title}>Performance</h2>
                <div className={styles.skeletonGrid}>
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className={styles.skeletonCard} />
                    ))}
                </div>
            </section>
        );
    }

    if (!displayMetrics?.length) {
        return (
            <section className={styles.section} aria-label="Performance metrics">
                <h2 className={styles.title}>Performance</h2>
                <p className={styles.empty}>
                    Run a backtest to see KPIs here.
                    <span className={styles.emptyHint}>The equity chart will appear below after a run.</span>
                </p>
            </section>
        );
    }

    return (
        <section className={styles.section} aria-label="Performance metrics">
            <h2 className={styles.title}>Performance</h2>
            <ul className={styles.grid}>
                {displayMetrics.map((m, i) => (
                    <MetricCard key={`${i}-${m.label}`} metric={m} />
                ))}
            </ul>
        </section>
    );
}
