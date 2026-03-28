import { type ReactNode } from 'react';

/** Root provider; backtest state (Context + useReducer) will live here in a later chunk. */
export function BacktestProvider({ children }: { children: ReactNode }) {
    return children;
}
