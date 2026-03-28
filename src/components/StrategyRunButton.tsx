import { Rocket } from 'lucide-react';
import { useBacktest } from '../context/BacktestContext';
import styles from './strategy-run-button.module.scss';

export function StrategyRunButton() {
    const { state, runBacktest } = useBacktest();
    const busy = state.runStatus === 'running';

    return (
        <div className={styles.wrap}>
            <button
                type="button"
                className={styles.runBtn}
                disabled={busy}
                onClick={() => void runBacktest()}
            >
                <span className={styles.iconBadge} aria-hidden>
                    <Rocket className={styles.rocketIcon} size={22} strokeWidth={2.25} />
                </span>
                <span className={styles.runBtnLabel}>{busy ? 'Running…' : 'Run Backtest'}</span>
            </button>
        </div>
    );
}
