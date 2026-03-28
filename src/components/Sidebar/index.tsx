import {
    BookOpen,
    FlaskConical,
    Gauge,
    History,
    LayoutDashboard,
    Settings,
    Sliders,
    Sparkles,
    TrendingUp,
    type LucideIcon,
} from 'lucide-react';
import styles from './sidebar.module.scss';

type NavId =
    | 'dashboard'
    | 'strategies'
    | 'parameters'
    | 'walkforward'
    | 'history'
    | 'montecarlo'
    | 'ga';

const PRIMARY: { id: NavId; label: string; icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'strategies', label: 'Strategies', icon: TrendingUp },
    { id: 'parameters', label: 'Parameters', icon: Sliders },
    { id: 'walkforward', label: 'Walk-Forward', icon: Sparkles },
    { id: 'history', label: 'History', icon: History },
];

const ADVANCED: { id: NavId; label: string; icon: LucideIcon }[] = [
    { id: 'montecarlo', label: 'Monte Carlo', icon: FlaskConical },
    { id: 'ga', label: 'GA Optimizer', icon: Gauge },
];

export function Sidebar() {
    return (
        <aside className={styles.sidebar} aria-label="Primary navigation">
            <div className={styles.brandBlock}>
                <div className={styles.brand}>
                    <span className={styles.brandMark} aria-hidden />
                    <span className={styles.brandText}>Strategy Forge</span>
                </div>
                <p className={styles.tagline}>The Sovereign Analyst</p>
            </div>

            <nav className={styles.nav} aria-label="Application">
                <ul className={styles.list}>
                    {PRIMARY.map(({ id, label, icon: Icon }) => (
                        <li key={id}>
                            <button
                                type="button"
                                className={id === 'dashboard' ? styles.navBtnActive : styles.navBtn}
                            >
                                <Icon className={styles.navIcon} size={18} strokeWidth={1.75} aria-hidden />
                                <span>{label}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <p className={styles.sectionLabel}>Advanced tools</p>
                <ul className={styles.list}>
                    {ADVANCED.map(({ id, label, icon: Icon }) => (
                        <li key={id}>
                            <button type="button" className={styles.navBtn}>
                                <Icon className={styles.navIcon} size={18} strokeWidth={1.75} aria-hidden />
                                <span>{label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={styles.footer}>
                <button type="button" className={styles.footerLink}>
                    <Settings size={16} strokeWidth={1.75} aria-hidden />
                    Settings
                </button>
                <button type="button" className={styles.footerLink}>
                    <BookOpen size={16} strokeWidth={1.75} aria-hidden />
                    Documentation
                </button>
            </div>
        </aside>
    );
}
