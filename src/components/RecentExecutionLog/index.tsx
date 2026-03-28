import { Download } from 'lucide-react';
import { useCallback } from 'react';
import { useBacktest } from '../../context/BacktestContext';
import type { ExecutionLogRow } from '../../types/backtest';
import { downloadExecutionLogCsv } from '../../utils/executionLogCsv';
import styles from './recent-execution-log.module.scss';

const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
});

function formatPrice(n: number): string {
    return n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function RowCells({ row }: { row: ExecutionLogRow }) {
    const pnlClass = row.pnlUsd >= 0 ? styles.pnlProfit : styles.pnlLoss;
    const sideClass = row.side === 'long' ? styles.sideLong : styles.sideShort;

    return (
        <tr className={styles.tr}>
            <td className={styles.td}>{row.asset}</td>
            <td className={styles.td}>
                <span className={sideClass}>{row.side.toUpperCase()}</span>
            </td>
            <td className={`${styles.td} ${styles.tdRight}`}>{formatPrice(row.entryPrice)}</td>
            <td className={`${styles.td} ${styles.tdRight}`}>{formatPrice(row.exitPrice)}</td>
            <td className={`${styles.td} ${styles.tdRight} ${pnlClass}`}>
                {row.pnlUsd >= 0 ? '+' : ''}
                {usd.format(row.pnlUsd)}
            </td>
            <td className={styles.td}>
                <span
                    className={`${styles.badge} ${
                        row.status === 'profit' ? styles.badgeProfit : styles.badgeLoss
                    }`}
                >
                    {row.status.toUpperCase()}
                </span>
            </td>
        </tr>
    );
}

export function RecentExecutionLog() {
    const { state } = useBacktest();
    const { executionLog, runStatus } = state;

    const handleExport = useCallback(() => {
        if (executionLog?.length) {
            downloadExecutionLogCsv(executionLog);
        }
    }, [executionLog]);

    if (runStatus === 'running') {
        return (
            <section className={styles.section} aria-label="Recent execution log" aria-busy="true">
                <h2 className={styles.title}>Executions</h2>
                <div className={styles.panel}>
                    <div className={styles.header}>
                        <h3 className={styles.heading}>Recent Execution Log</h3>
                    </div>
                    <div className={styles.skeleton} />
                </div>
            </section>
        );
    }

    if (!executionLog?.length) {
        return (
            <section className={styles.section} aria-label="Recent execution log">
                <h2 className={styles.title}>Executions</h2>
                <p className={styles.empty}>Run a backtest to see recent executions here. Use Export CSV after a run.</p>
            </section>
        );
    }

    return (
        <section className={styles.section} aria-label="Recent execution log">
            <h2 className={styles.title}>Executions</h2>
            <div className={styles.panel}>
                <div className={styles.header}>
                    <h3 className={styles.heading}>Recent Execution Log</h3>
                    <button type="button" className={styles.exportBtn} onClick={handleExport}>
                        <Download size={16} strokeWidth={2} aria-hidden />
                        Export CSV
                    </button>
                </div>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th} scope="col">
                                    Asset
                                </th>
                                <th className={styles.th} scope="col">
                                    Side
                                </th>
                                <th className={`${styles.th} ${styles.thRight}`} scope="col">
                                    Entry price
                                </th>
                                <th className={`${styles.th} ${styles.thRight}`} scope="col">
                                    Exit price
                                </th>
                                <th className={`${styles.th} ${styles.thRight}`} scope="col">
                                    P&amp;L ($)
                                </th>
                                <th className={styles.th} scope="col">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {executionLog.map((row) => (
                                <RowCells key={row.id} row={row} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
