import type { DisplayMetric, EquityChartPoint, ExecutionLogRow, StrategyId } from '../types/backtest';

export interface BacktestParams {
    fastPeriod: number;
    slowPeriod: number;
    rsiPeriod: number;
    rsiOverbought: number;
    rsiOversold: number;
}

export interface BacktestState {
    strategyId: StrategyId;
    params: BacktestParams;
    runStatus: 'idle' | 'running' | 'done';
    /** Populated after a successful run (mock or API). */
    displayMetrics: DisplayMetric[] | null;
    equitySeries: EquityChartPoint[] | null;
    executionLog: ExecutionLogRow[] | null;
}

export type BacktestAction =
    | { type: 'SET_STRATEGY'; strategyId: StrategyId }
    | { type: 'SET_PARAM'; key: keyof BacktestParams; value: number }
    | { type: 'RUN_START' }
    | {
          type: 'RUN_SUCCESS';
          metrics: DisplayMetric[];
          equity: EquityChartPoint[];
          executions: ExecutionLogRow[];
      }
    | { type: 'RUN_FAIL' };

export const defaultBacktestParams: BacktestParams = {
    fastPeriod: 20,
    slowPeriod: 50,
    rsiPeriod: 14,
    rsiOverbought: 70,
    rsiOversold: 30,
};

export const initialBacktestState: BacktestState = {
    strategyId: 'sma_crossover',
    params: { ...defaultBacktestParams },
    runStatus: 'idle',
    displayMetrics: null,
    equitySeries: null,
    executionLog: null,
};

export function backtestReducer(state: BacktestState, action: BacktestAction): BacktestState {
    switch (action.type) {
        case 'SET_STRATEGY':
            return { ...state, strategyId: action.strategyId };
        case 'SET_PARAM':
            return {
                ...state,
                params: { ...state.params, [action.key]: action.value },
            };
        case 'RUN_START':
            return { ...state, runStatus: 'running' };
        case 'RUN_SUCCESS':
            return {
                ...state,
                runStatus: 'done',
                displayMetrics: action.metrics,
                equitySeries: action.equity,
                executionLog: action.executions,
            };
        case 'RUN_FAIL':
            return { ...state, runStatus: 'idle' };
        default:
            return state;
    }
}
