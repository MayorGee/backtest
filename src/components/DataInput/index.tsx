import { useEffect, useId, useState } from 'react';
import { Calendar, ChevronDown, Upload } from 'lucide-react';
import type { StreamPreviewRow } from '../../types/backtest';
import { parseCsvPreview } from '../../utils/parseCsvPreview';
import styles from './data-input.module.scss';

export type DataInputTab = 'asset-selection' | 'csv-upload';

export interface AssetRange {
    symbol: string;
    startDate: string;
    endDate: string;
}

interface DataInputProps {
    onAssetChange: (data: AssetRange) => void;
    onCsvParsed?: (rows: StreamPreviewRow[]) => void;
    /** Called when user switches back to asset mode so preview can revert to demo data. */
    onCsvClear?: () => void;
}

export function DataInput({ onAssetChange, onCsvParsed, onCsvClear }: DataInputProps) {
    const fileInputId = useId();
    const [activeTab, setActiveTab] = useState<DataInputTab>('asset-selection');
    const [symbol, setSymbol] = useState('BTC/USDT');
    const [startDate, setStartDate] = useState('01/01/2023');
    const [endDate, setEndDate] = useState('12/31/2023');
    const [csvFileName, setCsvFileName] = useState<string | null>(null);
    const [csvError, setCsvError] = useState<string | null>(null);

    useEffect(() => {
        if (activeTab === 'asset-selection') {
            onAssetChange({ symbol, startDate, endDate });
        }
    }, [symbol, startDate, endDate, activeTab, onAssetChange]);

    const selectTab = (tab: DataInputTab) => {
        if (tab === 'asset-selection' && activeTab !== 'asset-selection') {
            onCsvClear?.();
            setCsvFileName(null);
            setCsvError(null);
        }
        setActiveTab(tab);
    };

    const handleCsvFile = (file: File | null) => {
        setCsvError(null);
        if (!file) return;
        onCsvClear?.();
        setCsvFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            const text = typeof reader.result === 'string' ? reader.result : '';
            const { rows, error } = parseCsvPreview(text);
            if (error) {
                setCsvError(error);
                return;
            }
            onCsvParsed?.(rows);
        };
        reader.onerror = () => setCsvError('Could not read file.');
        reader.readAsText(file);
    };

    return (
        <div className={styles.panel}>
            <div className={styles.tabs} role="tablist" aria-label="Data source">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'asset-selection'}
                    className={`${styles.tab} ${activeTab === 'asset-selection' ? styles.tabActive : ''}`}
                    onClick={() => selectTab('asset-selection')}
                >
                    <span className={styles.tabLabel}>Asset Selection</span>
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'csv-upload'}
                    className={`${styles.tab} ${activeTab === 'csv-upload' ? styles.tabActive : ''}`}
                    onClick={() => selectTab('csv-upload')}
                >
                    <span className={styles.tabLabel}>CSV Upload</span>
                </button>
            </div>

            {activeTab === 'asset-selection' && (
                <div className={styles.fields}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="data-symbol">
                            Symbol
                        </label>
                        <div className={styles.inputWrap}>
                            <input
                                id="data-symbol"
                                type="text"
                                className={styles.input}
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value)}
                                autoComplete="off"
                            />
                            <ChevronDown className={styles.inputIcon} aria-hidden strokeWidth={2} />
                        </div>
                    </div>

                    <div className={styles.dateGrid}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="data-start">
                                Start Date
                            </label>
                            <div className={styles.inputWrap}>
                                <input
                                    id="data-start"
                                    type="text"
                                    className={styles.input}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    autoComplete="off"
                                />
                                <Calendar className={styles.inputIcon} aria-hidden strokeWidth={2} />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="data-end">
                                End Date
                            </label>
                            <div className={styles.inputWrap}>
                                <input
                                    id="data-end"
                                    type="text"
                                    className={styles.input}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    autoComplete="off"
                                />
                                <Calendar className={styles.inputIcon} aria-hidden strokeWidth={2} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'csv-upload' && (
                <div className={styles.csvZone}>
                    <Upload className={styles.csvUploadIcon} size={28} strokeWidth={1.5} aria-hidden />
                    <p className={styles.csvHint}>
                        Upload OHLCV CSV with a header row (e.g. timestamp, open, high, low, close, volume). A
                        preview of the first rows appears in the stream panel.
                    </p>
                    <label className={styles.fileLabel} htmlFor={fileInputId}>
                        Choose CSV
                    </label>
                    <input
                        id={fileInputId}
                        className={styles.fileInput}
                        type="file"
                        accept=".csv,text/csv"
                        onChange={(e) => handleCsvFile(e.target.files?.[0] ?? null)}
                    />
                    {csvFileName && <span className={styles.fileName}>{csvFileName}</span>}
                    {csvError && <p className={styles.csvError}>{csvError}</p>}
                </div>
            )}
        </div>
    );
}
