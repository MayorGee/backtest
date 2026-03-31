import { PageShell } from '../../components/PageShell';
import { useBacktest } from '../../context/BacktestContext';
import { allStrategyLibraryRows, templatePresetSummary } from '../../data/strategyLibrary';
import { strategyLabel } from '../../data/strategies';
import type { AppView } from '../../types/navigation';
import type { StrategyId } from '../../types/backtest';
import styles from './strategies-view.module.scss';

interface StrategiesViewProps {
    onNavigate: (view: AppView) => void;
}

export function StrategiesView({ onNavigate }: StrategiesViewProps) {
    const { setStrategyId, applyStrategyPreset } = useBacktest();

    const useInForge = (strategyId: StrategyId) => {
        setStrategyId(strategyId);
        onNavigate('dashboard');
    };

    return (
        <PageShell
            title="Strategies"
            subtitle="Built-in engines plus templates with preset parameters. “Use” keeps your current numbers; templates apply the listed defaults and open the Forge."
        >
            <div className={styles.grid}>
                {allStrategyLibraryRows().map((card) => (
                    <article
                        key={card.kind === 'builtin' ? card.strategyId : card.id}
                        className={styles.card}
                    >
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>{card.name}</h3>
                            <span
                                className={`${styles.badge} ${
                                    card.kind === 'template' ? styles.badgeTemplate : ''
                                }`}
                            >
                                {card.kind === 'builtin' ? 'Built-in' : 'Template'}
                            </span>
                        </div>
                        <p className={styles.engineLine}>
                            Engine: <strong>{strategyLabel(card.strategyId)}</strong>
                        </p>
                        {card.kind === 'template' && (
                            <p className={styles.presetLine}>{templatePresetSummary(card)}</p>
                        )}
                        <p className={styles.desc}>{card.description}</p>
                        <div className={styles.tags}>
                            {card.tags.map((t) => (
                                <span key={t} className={styles.tag}>
                                    {t}
                                </span>
                            ))}
                        </div>
                        <div className={styles.actions}>
                            {card.kind === 'builtin' ? (
                                <>
                                    <button
                                        type="button"
                                        className={styles.useBtn}
                                        onClick={() => useInForge(card.strategyId)}
                                    >
                                        Use in Forge
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.ghostBtn}
                                        onClick={() => onNavigate('dashboard')}
                                    >
                                        Open dashboard
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.useBtn}
                                    onClick={() => {
                                        applyStrategyPreset(card.strategyId, card.presetParams);
                                        onNavigate('dashboard');
                                    }}
                                >
                                    Apply template in Forge
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </PageShell>
    );
}
