import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
    type ReactNode,
} from 'react';
import { MOCK_EQUITY_DATA, MOCK_METRICS } from '../data/dashboardMock';
import type { StrategyId } from '../types/backtest';
import {
    backtestReducer,
    initialBacktestState,
    type BacktestAction,
    type BacktestParams,
    type BacktestState,
} from './backtestReducer';

interface BacktestContextValue {
    state: BacktestState;
    dispatch: React.Dispatch<BacktestAction>;
    setStrategyId: (id: StrategyId) => void;
    setParam: (key: keyof BacktestParams, value: number) => void;
    runBacktest: () => Promise<void>;
}

const BacktestContext = createContext<BacktestContextValue | null>(null);

export function BacktestProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(backtestReducer, initialBacktestState);

    const setStrategyId = useCallback((strategyId: StrategyId) => {
        dispatch({ type: 'SET_STRATEGY', strategyId });
    }, []);

    const setParam = useCallback((key: keyof BacktestParams, value: number) => {
        dispatch({ type: 'SET_PARAM', key, value });
    }, []);

    const runBacktest = useCallback(async () => {
        dispatch({ type: 'RUN_START' });
        await new Promise((r) => setTimeout(r, 480));
        dispatch({
            type: 'RUN_SUCCESS',
            metrics: MOCK_METRICS,
            equity: MOCK_EQUITY_DATA,
        });
    }, []);

    const value = useMemo(
        () => ({
            state,
            dispatch,
            setStrategyId,
            setParam,
            runBacktest,
        }),
        [state, setStrategyId, setParam, runBacktest],
    );

    return <BacktestContext.Provider value={value}>{children}</BacktestContext.Provider>;
}

export function useBacktest(): BacktestContextValue {
    const ctx = useContext(BacktestContext);
    if (!ctx) {
        throw new Error('useBacktest must be used within BacktestProvider');
    }
    return ctx;
}
