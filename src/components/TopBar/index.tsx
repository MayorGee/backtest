import styles from './top-bar.module.scss';

/**
 * Forge workspace header. Optimize / Analyze modes are not wired yet—those tabs were removed
 * to avoid redundant empty screens.
 */
export function TopBar() {
    return (
        <header className={styles.bar}>
            <div className={styles.brand}>
                <h1 className={styles.title}>Strategy Forge</h1>
                <p className={styles.tagline}>Backtest workspace</p>
            </div>
        </header>
    );
}
