import { useCallback, useState } from 'react';
import { BacktestProvider } from './context/BacktestContext';
import { DataInput } from './components/DataInput';
import { DataStreamPreview, type DataStreamSource } from './components/DataStreamPreview';
import { EquityCurveCard } from './components/EquityCurveCard';
import { ForgeModePlaceholder } from './components/ForgeModePlaceholder';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileNav } from './components/MobileNav';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { RecentExecutionLog } from './components/RecentExecutionLog';
import { RunContextBanner } from './components/RunContextBanner';
import { Sidebar } from './components/Sidebar';
import { StrategyLogic } from './components/StrategyLogic';
import { StrategyRunButton } from './components/StrategyRunButton';
import { TopBar, type ForgeMainTab } from './components/TopBar';
import type { StreamPreviewRow } from './types/backtest';

function AppLayout() {
    const [streamRows, setStreamRows] = useState<StreamPreviewRow[] | null>(null);
    const [mainTab, setMainTab] = useState<ForgeMainTab>('backtest');

    const handleCsvParsed = useCallback((rows: StreamPreviewRow[]) => {
        setStreamRows(rows);
    }, []);

    const handleCsvClear = useCallback(() => {
        setStreamRows(null);
    }, []);

    const streamSource: DataStreamSource = streamRows === null ? 'demo' : 'csv';

    return (
        <div className="app">
            <div className="app__glow app__glow--top" aria-hidden />
            <div className="app__glow app__glow--bottom" aria-hidden />
            <Sidebar />
            <MobileNav />
            <div className="app__main">
                <TopBar activeTab={mainTab} onTabChange={setMainTab} />
                <main className="app__content">
                    {mainTab === 'backtest' && (
                        <>
                            <RunContextBanner />
                            <div className="app__section">
                                <div className="app__workspace">
                                    <DataInput onCsvParsed={handleCsvParsed} onCsvClear={handleCsvClear} />
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
                                <PerformanceMetrics />
                                <EquityCurveCard />
                                <RecentExecutionLog />
                            </div>
                        </>
                    )}
                    {mainTab === 'optimize' && <ForgeModePlaceholder mode="optimize" />}
                    {mainTab === 'analyze' && <ForgeModePlaceholder mode="analyze" />}
                </main>
            </div>
            <MobileBottomNav />
        </div>
    );
}

function App() {
    return (
        <BacktestProvider>
            <AppLayout />
        </BacktestProvider>
    );
}

export default App;
