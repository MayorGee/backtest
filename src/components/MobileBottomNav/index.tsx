import { BookOpen, Footprints, LayoutDashboard, ScrollText, Settings, type LucideIcon } from 'lucide-react';
import styles from './mobile-bottom-nav.module.scss';

export type MobileNavId = 'forge' | 'library' | 'walk' | 'logs' | 'config';

const ITEMS: { id: MobileNavId; label: string; icon: LucideIcon }[] = [
    { id: 'forge', label: 'Forge', icon: LayoutDashboard },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'walk', label: 'Walk', icon: Footprints },
    { id: 'logs', label: 'Logs', icon: ScrollText },
    { id: 'config', label: 'Config', icon: Settings },
];

interface MobileBottomNavProps {
    activeId?: MobileNavId;
    onNavigate?: (id: MobileNavId) => void;
}

export function MobileBottomNav({ activeId = 'forge', onNavigate }: MobileBottomNavProps) {
    return (
        <nav className={styles.nav} aria-label="Primary">
            {ITEMS.map(({ id, label, icon: Icon }) => {
                const active = id === activeId;
                return (
                    <button
                        key={id}
                        type="button"
                        className={`${styles.item} ${active ? styles.itemActive : ''}`}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => onNavigate?.(id)}
                    >
                        <span className={styles.icon} aria-hidden>
                            <Icon size={20} strokeWidth={active ? 2 : 1.75} />
                        </span>
                        <span className={styles.label}>{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
