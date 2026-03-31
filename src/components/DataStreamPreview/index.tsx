import { useBacktest } from '../../context/BacktestContext';
import type { StreamPreviewRow } from '../../types/backtest';
import styles from './data-stream-preview.module.scss';

/** Shown only when using exchange path; clarifies that rows are not live market data. */
const EXCHANGE_DEMO_ROWS: StreamPreviewRow[] = [
    {
        timestamp: '2025-12-31 23:59',
        open: '42124.50',
        high: '42300.00',
        low: '42100.20',
        close: '42250.80',
        volume: '124.52',
    },
    {
        timestamp: '2025-12-31 23:58',
        open: '42110.00',
        high: '42150.00',
        low: '42080.50',
        close: '42124.50',
        volume: '89.12',
    },
    {
        timestamp: '2025-12-31 23:57',
        open: '42050.20',
        high: '42120.00',
        low: '42040.00',
        close: '42110.00',
        volume: '56.78',
    },
];

function parseNum(s: string): number {
    const n = parseFloat(s.replace(/,/g, ''));
    return Number.isFinite(n) ? n : NaN;
}

function closeCellClass(open: string, close: string): string {
    const o = parseNum(open);
    const c = parseNum(close);
    if (Number.isNaN(o) || Number.isNaN(c)) return styles.cellCloseNeutral;
    if (c > o) return styles.cellCloseUp;
    if (c < o) return styles.cellCloseDown;
    return styles.cellCloseNeutral;
}

const MAX_PREVIEW_ROWS = 12;

export function DataStreamPreview() {
    const { state } = useBacktest();
    const { dataset, csvPreviewRows } = state;
    const isCsv = dataset.dataSource === 'csv';
    const displayRows: StreamPreviewRow[] = isCsv ? (csvPreviewRows ?? []) : EXCHANGE_DEMO_ROWS;
    const visible = displayRows.slice(0, MAX_PREVIEW_ROWS);

    const badge = isCsv ? (
        <span className={`${styles.badge} ${styles.badgeCsv}`}>
            CSV · {displayRows.length} row{displayRows.length === 1 ? '' : 's'} parsed
        </span>
    ) : (
        <span className={`${styles.badge} ${styles.badgeDemo}`}>Sample table only</span>
    );

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h3 className={styles.title}>OHLCV preview</h3>
                {visible.length > 0 || isCsv ? badge : null}
            </div>

            <p className={styles.explainer}>
                {isCsv ? (
                    <>
                        First rows of your upload—used to build the request to the API when you run a backtest. Fix CSV
                        errors in the data panel if the row count reads zero.
                    </>
                ) : (
                    <>
                        Real candles are not streamed in the browser. When you <strong>Run backtest</strong>, the API
                        fetches Binance klines for your symbol and range (or uses your CSV if you switch to upload). This
                        table is only a layout example.
                    </>
                )}
            </p>

            {visible.length === 0 ? (
                <p className={styles.empty}>
                    {isCsv
                        ? 'No rows yet — choose a valid OHLCV CSV in the data panel.'
                        : 'No preview rows.'}
                </p>
            ) : (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Timestamp</th>
                                <th className={styles.th}>Open</th>
                                <th className={styles.th}>High</th>
                                <th className={styles.th}>Low</th>
                                <th className={styles.th}>Close</th>
                                <th className={styles.th}>Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((row, index) => (
                                <tr key={`${row.timestamp}-${index}`} className={styles.tr}>
                                    <td className={styles.td}>{row.timestamp}</td>
                                    <td className={styles.td}>{row.open}</td>
                                    <td className={styles.td}>{row.high}</td>
                                    <td className={styles.td}>{row.low}</td>
                                    <td className={`${styles.td} ${closeCellClass(row.open, row.close)}`}>
                                        {row.close}
                                    </td>
                                    <td className={styles.td}>{row.volume}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
