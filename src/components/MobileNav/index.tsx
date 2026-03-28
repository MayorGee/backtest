import styles from './mobile-nav.module.scss';

export function MobileNav() {
    return (
        <header className={styles.bar}>
            <div className={styles.brand}>
                <span className={styles.brandMark} aria-hidden />
                <div className={styles.titles}>
                    <span className={styles.title}>Strategy Forge</span>
                    <span className={styles.subtitle}>The Sovereign Analyst</span>
                </div>
            </div>
        </header>
    );
}
