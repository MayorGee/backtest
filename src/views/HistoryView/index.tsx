import { PageShell } from '../../components/PageShell';
import type { AppView } from '../../types/navigation';
import styles from './history-view.module.scss';

const MOCK_RUNS: {
    id: string;
    when: string;
    symbol: string;
    strategy: string;
    interval: string;
    returnPct: string;
}[] = [
    {
        id: '1',
        when: '2026-03-26 14:20',
        symbol: 'BTC/USDT',
        strategy: 'SMA Crossover',
        interval: '1h',
        returnPct: '+18.4%',
    },
    {
        id: '2',
        when: '2026-03-22 09:05',
        symbol: 'BTC/USDT',
        strategy: 'RSI',
        interval: '4h',
        returnPct: '+6.1%',
    },
    {
        id: '3',
        when: '2026-03-18 11:40',
        symbol: 'BTC/USDT',
        strategy: 'Buy & Hold',
        interval: '1d',
        returnPct: '+42.0%',
    },
];

interface HistoryViewProps {
    onNavigate: (view: AppView) => void;
}

export function HistoryView({ onNavigate }: HistoryViewProps) {
    return (
        <PageShell
            title="History"
            subtitle="Saved backtest runs (mock rows). Later: open a row to hydrate the Forge with that config and results."
        >
            <div className={styles.panel}>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th} scope="col">
                                    When
                                </th>
                                <th className={styles.th} scope="col">
                                    Symbol
                                </th>
                                <th className={styles.th} scope="col">
                                    Strategy
                                </th>
                                <th className={styles.th} scope="col">
                                    Interval
                                </th>
                                <th className={styles.th} scope="col">
                                    Return
                                </th>
                                <th className={styles.th} scope="col">
                                    <span className={styles.muted}>Open</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_RUNS.map((r) => (
                                <tr key={r.id}>
                                    <td className={`${styles.td} ${styles.mono}`}>{r.when}</td>
                                    <td className={styles.td}>{r.symbol}</td>
                                    <td className={styles.td}>{r.strategy}</td>
                                    <td className={styles.td}>{r.interval}</td>
                                    <td className={styles.td}>{r.returnPct}</td>
                                    <td className={styles.td}>
                                        <button
                                            type="button"
                                            className={styles.linkBtn}
                                            onClick={() => onNavigate('dashboard')}
                                        >
                                            Open in Forge
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
