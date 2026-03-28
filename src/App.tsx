import { useCallback, useState } from 'react';
import { BacktestProvider } from './context/BacktestContext';
import { StrategyLogic } from './components/StrategyLogic';
import { StrategyRunButton } from './components/StrategyRunButton';
import { DataInput, type AssetRange } from './components/DataInput';
import { DataStreamPreview, type DataStreamSource } from './components/DataStreamPreview';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileNav } from './components/MobileNav';
import { Sidebar } from './components/Sidebar';
import { TopBar, type ForgeMainTab } from './components/TopBar';
import type { StreamPreviewRow } from './types/backtest';

function App() {
    const [, setAssetRange] = useState<AssetRange>({
        symbol: 'BTC/USDT',
        startDate: '01/01/2023',
        endDate: '12/31/2023',
    });
    const [streamRows, setStreamRows] = useState<StreamPreviewRow[] | null>(null);
    const [mainTab, setMainTab] = useState<ForgeMainTab>('backtest');

    const handleAssetChange = useCallback((data: AssetRange) => {
        setAssetRange(data);
    }, []);

    const handleCsvParsed = useCallback((rows: StreamPreviewRow[]) => {
        setStreamRows(rows);
    }, []);

    const handleCsvClear = useCallback(() => {
        setStreamRows(null);
    }, []);

    const streamSource: DataStreamSource = streamRows === null ? 'demo' : 'csv';

    return (
        <BacktestProvider>
            <div className="app">
                <div className="app__glow app__glow--top" aria-hidden />
                <div className="app__glow app__glow--bottom" aria-hidden />
                <Sidebar />
                <MobileNav />
                <div className="app__main">
                    <TopBar activeTab={mainTab} onTabChange={setMainTab} />
                    <main className="app__content">
                        <div className="app__section">
                            <div className="app__workspace">
                                <DataInput
                                    onAssetChange={handleAssetChange}
                                    onCsvParsed={handleCsvParsed}
                                    onCsvClear={handleCsvClear}
                                />
                                <DataStreamPreview rows={streamRows} source={streamSource} />
                            </div>
                            <div className="app__strategyStrip">
                                <div className="app__strategyBar">
                                    <div className="app__strategyBarMain">
                                        <StrategyLogic />
                                    </div>
                                    <div className="app__strategyBarRun">
                                        <StrategyRunButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    <MobileBottomNav />
                </div>
            </div>
        </BacktestProvider>
    );
}

export default App;
