import { Code2, Search, User } from 'lucide-react';
import styles from './top-bar.module.scss';

export type ForgeMainTab = 'backtest' | 'optimize' | 'analyze';

interface TopBarProps {
    activeTab: ForgeMainTab;
    onTabChange?: (tab: ForgeMainTab) => void;
}

const TABS: { id: ForgeMainTab; label: string }[] = [
    { id: 'backtest', label: 'Backtest' },
    { id: 'optimize', label: 'Optimize' },
    { id: 'analyze', label: 'Analyze' },
];

export function TopBar({ activeTab, onTabChange }: TopBarProps) {
    return (
        <header className={styles.bar}>
            <div className={styles.tabs} role="tablist" aria-label="Main mode">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === t.id}
                        className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
                        onClick={() => onTabChange?.(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div className={styles.actions}>
                <button type="button" className={styles.iconBtn} aria-label="Search">
                    <Search size={20} strokeWidth={1.75} />
                </button>
                <button type="button" className={styles.iconBtn} aria-label="Developer">
                    <Code2 size={20} strokeWidth={1.75} />
                </button>
                <button type="button" className={styles.avatar} aria-label="Account">
                    <User size={18} strokeWidth={1.75} />
                </button>
            </div>
        </header>
    );
}
