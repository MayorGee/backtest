import type { ExecutionLogRow } from '../types/backtest';

function escapeCell(value: string): string {
    if (/[",\n\r]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

/** Build CSV for the execution log table (UTF-8). */
export function executionLogToCsv(rows: ExecutionLogRow[]): string {
    const header = ['Asset', 'Side', 'Entry Price', 'Exit Price', 'P&L ($)', 'Status'];
    const body = rows.map((r) => [
        r.asset,
        r.side.toUpperCase(),
        r.entryPrice.toFixed(2),
        r.exitPrice.toFixed(2),
        r.pnlUsd.toFixed(2),
        r.status.toUpperCase(),
    ]);
    return [header, ...body].map((cols) => cols.map(escapeCell).join(',')).join('\r\n');
}

export function downloadExecutionLogCsv(rows: ExecutionLogRow[], filename = 'strategy-forge-executions.csv') {
    const csv = executionLogToCsv(rows);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
