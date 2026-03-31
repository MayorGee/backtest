import { PageShell } from '../../components/PageShell';
import styles from './documentation-view.module.scss';

export function DocumentationView() {
    return (
        <PageShell
            title="Documentation"
            subtitle="In-app reference for how Strategy Forge works today."
        >
            <div className={styles.doc}>
                <section className={styles.block}>
                    <h2 className={styles.blockTitle}>What this app does</h2>
                    <p className={styles.p}>
                        Strategy Forge is a <strong>backtest shell</strong>: you choose data (Binance spot or CSV),
                        strategy and parameters, optional out-of-sample split, then <strong>Run backtest</strong>. Results
                        include KPI tiles, an equity curve, and an execution log. The UI can call your{' '}
                        <strong>FastAPI</strong> service; if the API is missing or errors, it falls back to demo output
                        and explains why in the run banner.
                    </p>
                </section>

                <section className={styles.block}>
                    <h2 className={styles.blockTitle}>Backtest flow</h2>
                    <ol className={styles.ol}>
                        <li>
                            <strong>Settings:</strong> set the API base URL (e.g. <code className={styles.inlineCode}>http://127.0.0.1:8888</code>
                            ) so runs hit your Python engine.
                        </li>
                        <li>
                            <strong>Data:</strong> use <strong>Asset selection</strong> for crypto symbols—bars are
                            fetched on the server from <strong>Binance spot</strong> when you run. For{' '}
                            <strong>forex and metals</strong> (EURUSD, XAUUSD, …), use <strong>CSV upload</strong> with
                            broker or platform OHLCV.
                        </li>
                        <li>
                            <strong>OHLCV preview:</strong> CSV mode shows parsed rows from your file. Exchange mode
                            shows a sample table only; real candles are not streamed in the browser.
                        </li>
                        <li>
                            <strong>Strategies:</strong> three engines—Buy &amp; hold, SMA crossover, RSI. The{' '}
                            <strong>Strategies</strong> page lists built-ins plus <strong>templates</strong> that apply
                            preset parameters (same engines, different defaults).
                        </li>
                        <li>
                            <strong>OOS start (optional):</strong> if you set an out-of-sample date (
                            <code className={styles.inlineCode}>MM/DD/YYYY</code>, UTC), the API adds a second block of
                            KPIs prefixed with <strong>OOS ·</strong> for bars from that day onward. The equity chart
                            stays full-sample.
                        </li>
                        <li>
                            <strong>History:</strong> runs are saved in this browser (local storage). Open a row to
                            restore that configuration and saved results when available.
                        </li>
                    </ol>
                </section>

                <section className={styles.block}>
                    <h2 className={styles.blockTitle}>API (FastAPI)</h2>
                    <ul className={styles.list}>
                        <li>
                            <code className={styles.inlineCode}>GET /health</code> — liveness.
                        </li>
                        <li>
                            <code className={styles.inlineCode}>POST /backtest</code> — body matches the Forge state:
                            strategy, parameters, portfolio, dataset, optional <code className={styles.inlineCode}>bars</code>{' '}
                            for CSV mode. Engine is <strong>long-only</strong> (spot-style).
                        </li>
                        <li>
                            CORS in development allows the Vite dev origin; adjust <code className={styles.inlineCode}>main.py</code>{' '}
                            for production.
                        </li>
                    </ul>
                    <p className={styles.p}>
                        See the project <code className={styles.inlineCode}>README.md</code> for install and{' '}
                        <code className={styles.inlineCode}>uvicorn</code> commands.
                    </p>
                </section>

                <section className={styles.block}>
                    <h2 className={styles.blockTitle}>CSV format</h2>
                    <p className={styles.p}>Expect a header row with OHLCV columns, e.g.:</p>
                    <code className={styles.code}>timestamp,open,high,low,close,volume</code>
                    <p className={styles.p}>Preview parsing must succeed before a CSV run is sent to the API.</p>
                </section>

                <section className={styles.block}>
                    <h2 className={styles.blockTitle}>Walk-forward and other sidebar tools</h2>
                    <p className={styles.p}>
                        The <strong>Walk-forward</strong> page holds form controls only; it does not execute a rolling
                        backtest on the server yet. <strong>Monte Carlo</strong> and <strong>Genetic optimizer</strong>{' '}
                        open brief placeholder screens with no API integration.
                    </p>
                </section>
            </div>
        </PageShell>
    );
}
