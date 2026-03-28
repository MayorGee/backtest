import type { DisplayMetric, EquityChartPoint } from '../types/backtest';

export const MOCK_EQUITY_DATA: EquityChartPoint[] = [
    { date: 'Jan', equity: 10000, drawdown: 0 },
    { date: 'Feb', equity: 10500, drawdown: -1.2 },
    { date: 'Mar', equity: 10800, drawdown: -0.8 },
    { date: 'Apr', equity: 11200, drawdown: -1.5 },
    { date: 'May', equity: 11800, drawdown: -2.1 },
    { date: 'Jun', equity: 12400, drawdown: -1.8 },
    { date: 'Jul', equity: 12200, drawdown: -2.5 },
    { date: 'Aug', equity: 13000, drawdown: -1.2 },
    { date: 'Sep', equity: 13500, drawdown: -0.9 },
    { date: 'Oct', equity: 14100, drawdown: -1.1 },
    { date: 'Nov', equity: 14240, drawdown: -2.1 },
    { date: 'Dec', equity: 15000, drawdown: -0.5 },
];

export const MOCK_METRICS: DisplayMetric[] = [
    { label: 'Total Return', value: '+124.5%', tone: 'profit', emphasized: true },
    { label: 'Sharpe Ratio', value: '2.41', tone: 'profit', emphasized: true },
    { label: 'Max Drawdown', value: '-12.3%', tone: 'loss' },
    { label: 'Win Rate', value: '68.2%' },
    { label: 'Profit Factor', value: '1.88', tone: 'accent', emphasized: true },
    { label: 'Total Trades', value: '1,248' },
];
