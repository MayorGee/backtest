import { useEffect, useState } from 'react';
import { PageShell } from '../../components/PageShell';
import styles from './settings-view.module.scss';

const STORAGE_KEY = 'strategy-forge-api-base';

export function SettingsView() {
    const [apiBase, setApiBase] = useState('');

    useEffect(() => {
        setApiBase(() => localStorage.getItem(STORAGE_KEY) ?? '');
    }, []);

    useEffect(() => {
        const t = window.setTimeout(() => {
            if (apiBase === '') {
                localStorage.removeItem(STORAGE_KEY);
            } else {
                localStorage.setItem(STORAGE_KEY, apiBase.trim());
            }
        }, 300);
        return () => window.clearTimeout(t);
    }, [apiBase]);

    return (
        <PageShell
            title="Settings"
            subtitle="Workspace preferences. API base is stored in this browser only—no secrets in the bundle."
        >
            <div className={styles.panel}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="settings-api-base">
                        API base URL
                    </label>
                    <input
                        id="settings-api-base"
                        type="url"
                        className={styles.input}
                        placeholder="https://api.example.com"
                        value={apiBase}
                        onChange={(e) => setApiBase(e.target.value)}
                        autoComplete="off"
                    />
                    <p className={styles.hint}>
                        Used when the Vite app calls your FastAPI deployment (e.g. Railway). Leave blank for mock-only
                        mode.
                    </p>
                </div>
                <p className={styles.note}>Theme: dark (default). Light mode can land after core workflows stabilize.</p>
            </div>
        </PageShell>
    );
}
