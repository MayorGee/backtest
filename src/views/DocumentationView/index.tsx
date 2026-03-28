import { PageShell } from '../../components/PageShell';
import styles from './documentation-view.module.scss';

export function DocumentationView() {
    return (
        <PageShell
            title="Documentation"
            subtitle="In-app reference for Strategy Forge. Expand with your README and API contract as the stack grows."
        >
            <div className={styles.doc}>
                <section className={styles.block}>
                    <h2 className={styles.blockTitle}>Backtest flow</h2>
                    <p className={styles.p}>
                        Choose exchange bars or upload CSV, pick a strategy and parameters, then run. Metrics, equity, and
                        execution log populate from the mock engine today; swap the client call for FastAPI when ready.
                    </p>
                </section>
                <section className={styles.block}>
                    <h2 className={styles.blockTitle}>Data formats</h2>
                    <p className={styles.p}>CSV expects a header row with OHLCV columns, e.g.:</p>
                    <code className={styles.code}>timestamp,open,high,low,close,volume</code>
                </section>
                <section className={styles.block}>
                    <h2 className={styles.blockTitle}>Roadmap</h2>
                    <ul className={styles.list}>
                        <li>Vectorized strategies in pandas (buy &amp; hold, SMA, RSI)</li>
                        <li>POST /backtest with dataset + strategy payload</li>
                        <li>Walk-forward and optimization services wired from this shell</li>
                    </ul>
                </section>
            </div>
        </PageShell>
    );
}
