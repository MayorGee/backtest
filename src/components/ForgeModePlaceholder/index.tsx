import type { ForgeMainTab } from '../TopBar';
import styles from './forge-mode-placeholder.module.scss';

const COPY: Record<Exclude<ForgeMainTab, 'backtest'>, { title: string; body: string }> = {
    optimize: {
        title: 'Optimize',
        body: 'Parameter sweeps, walk-forward schedules, and objective selection will run here against the FastAPI engine.',
    },
    analyze: {
        title: 'Analyze',
        body: 'Post-run analytics—distribution of returns, regime breakdown, and Monte Carlo summaries—will plug into this workspace.',
    },
};

interface ForgeModePlaceholderProps {
    mode: Exclude<ForgeMainTab, 'backtest'>;
}

export function ForgeModePlaceholder({ mode }: ForgeModePlaceholderProps) {
    const { title, body } = COPY[mode];
    return (
        <div className={styles.wrap}>
            <div className={styles.panel}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.body}>{body}</p>
                <p className={styles.hint}>Switch to Backtest to use the live dashboard.</p>
            </div>
        </div>
    );
}
