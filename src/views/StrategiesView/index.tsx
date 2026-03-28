import { PageShell } from '../../components/PageShell';
import { useBacktest } from '../../context/BacktestContext';
import { builtInCards, STRATEGY_TEMPLATES } from '../../data/strategyLibrary';
import type { AppView } from '../../types/navigation';
import type { StrategyId } from '../../types/backtest';
import styles from './strategies-view.module.scss';

interface StrategiesViewProps {
    onNavigate: (view: AppView) => void;
}

export function StrategiesView({ onNavigate }: StrategiesViewProps) {
    const { setStrategyId } = useBacktest();

    const applyStrategy = (strategyId: StrategyId) => {
        setStrategyId(strategyId);
        onNavigate('dashboard');
    };

    return (
        <PageShell
            title="Strategies"
            subtitle="Built-in logic you can ship to the Forge, plus starter templates. Selection updates the backtest bar—runs still use mock output until the API is connected."
        >
            <h2 className={styles.sectionLabel}>Built-in</h2>
            <div className={styles.grid}>
                {builtInCards().map((card) => (
                    <article key={card.strategyId} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>{card.name}</h3>
                            <span className={styles.badge}>Built-in</span>
                        </div>
                        <p className={styles.desc}>{card.description}</p>
                        <div className={styles.tags}>
                            {card.tags.map((t) => (
                                <span key={t} className={styles.tag}>
                                    {t}
                                </span>
                            ))}
                        </div>
                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.useBtn}
                                onClick={() => applyStrategy(card.strategyId)}
                            >
                                Use in Forge
                            </button>
                            <button type="button" className={styles.ghostBtn} onClick={() => onNavigate('dashboard')}>
                                Open dashboard
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <h2 className={styles.sectionLabel}>Templates</h2>
            <div className={styles.grid}>
                {STRATEGY_TEMPLATES.map((card) => (
                    <article key={card.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>{card.name}</h3>
                            <span className={`${styles.badge} ${styles.badgeTemplate}`}>Template</span>
                        </div>
                        <p className={styles.desc}>{card.description}</p>
                        <div className={styles.tags}>
                            {card.tags.map((t) => (
                                <span key={t} className={styles.tag}>
                                    {t}
                                </span>
                            ))}
                        </div>
                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.useBtn}
                                onClick={() => applyStrategy(card.strategyId)}
                            >
                                Apply template
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </PageShell>
    );
}
