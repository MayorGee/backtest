import { useBacktest } from '../../context/BacktestContext';
import { intervalLabel } from '../../data/marketOptions';
import { strategyLabel } from '../../data/strategies';
import styles from './run-context-banner.module.scss';

export function RunContextBanner() {
    const { state } = useBacktest();
    const { strategyId, dataset } = state;
    const strat = strategyLabel(strategyId);

    const primary =
        dataset.dataSource === 'csv' ? (
            <>
                <span>{strat}</span>
                <span className={styles.sep}>·</span>
                <span>CSV upload</span>
                {dataset.csvFileLabel && (
                    <>
                        <span className={styles.sep}>·</span>
                        <span>{dataset.csvFileLabel}</span>
                    </>
                )}
            </>
        ) : (
            <>
                <span>{strat}</span>
                <span className={styles.sep}>·</span>
                <span>{dataset.symbol}</span>
                <span className={styles.sep}>·</span>
                <span>{intervalLabel(dataset.interval)}</span>
                <span className={styles.sep}>·</span>
                <span>{dataset.exchange}</span>
                <span className={styles.sep}>·</span>
                <span>
                    {dataset.startDate} – {dataset.endDate}
                </span>
            </>
        );

    return (
        <div className={styles.banner} role="status" aria-label="Active backtest context">
            <p className={styles.line}>{primary}</p>
            <span className={styles.meta}>
                {dataset.dataSource === 'exchange'
                    ? 'Exchange bars — backtest still uses mock output until the API is wired.'
                    : 'Uploaded OHLCV — mock output until the engine reads this file.'}
            </span>
        </div>
    );
}
