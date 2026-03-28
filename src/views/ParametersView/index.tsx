import { useState } from 'react';
import { PageShell } from '../../components/PageShell';
import styles from './parameters-view.module.scss';

export function ParametersView() {
    const [capital, setCapital] = useState('10000');
    const [feePct, setFeePct] = useState('0.1');
    const [slippageBps, setSlippageBps] = useState('2');

    return (
        <PageShell
            title="Parameters"
            subtitle="Global backtest assumptions: capital at risk, costs, and friction. Values are UI-only until the FastAPI engine reads them."
        >
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.panel}>
                    <h2 className={styles.panelTitle}>Portfolio & costs</h2>
                    <div className={styles.grid2}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="param-capital">
                                Initial capital ($)
                            </label>
                            <input
                                id="param-capital"
                                type="text"
                                className={styles.input}
                                value={capital}
                                onChange={(e) => setCapital(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="param-fee">
                                Fee (round-trip %)
                            </label>
                            <input
                                id="param-fee"
                                type="text"
                                className={styles.input}
                                value={feePct}
                                onChange={(e) => setFeePct(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="param-slip">
                                Slippage (basis points)
                            </label>
                            <input
                                id="param-slip"
                                type="text"
                                className={styles.input}
                                value={slippageBps}
                                onChange={(e) => setSlippageBps(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <p className={styles.hint}>
                        Strategy-specific inputs (e.g. SMA periods) stay on the Dashboard strategy bar. Per-instrument
                        overrides can move here later.
                    </p>
                </div>
            </form>
        </PageShell>
    );
}
