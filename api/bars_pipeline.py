"""
Turn a `BacktestRequest` into a single `list[OhlcvBar]`.

- **exchange** + Binance / Bybit: server downloads klines (canonical bars).
- **csv**: client must send `bars` (same schema); validates non-empty.

One list type feeds the engine next — loaders differ, the pipeline does not.
"""

from fastapi import HTTPException

from exchange_binance import fetch_binance_spot_bars
from exchange_bybit import fetch_bybit_spot_bars
from schemas import BacktestRequest, OhlcvBar
from ui_dates import parse_ui_date_range_ms


def resolve_bars(body: BacktestRequest) -> list[OhlcvBar]:
    src = body.dataset.data_source
    if src == "csv":
        if not body.bars:
            raise HTTPException(
                status_code=422,
                detail="CSV mode requires `bars`: upload a file in the UI so the client can send parsed OHLCV.",
            )
        return body.bars

    ex = (body.dataset.exchange or "").strip().lower()
    start_ms, end_ms = parse_ui_date_range_ms(body.dataset.start_date, body.dataset.end_date)

    if ex == "binance":
        bars = fetch_binance_spot_bars(
            body.dataset.symbol,
            body.dataset.interval,
            start_ms,
            end_ms,
        )
        empty_msg = (
            "No candles returned — check symbol exists on Binance spot, interval, and dates "
            "(asset may not have traded in that window)."
        )
    elif ex == "bybit":
        bars = fetch_bybit_spot_bars(
            body.dataset.symbol,
            body.dataset.interval,
            start_ms,
            end_ms,
        )
        empty_msg = (
            "No candles returned — check symbol exists on Bybit spot, interval, and dates "
            "(pair may not trade in that window on spot)."
        )
    else:
        raise HTTPException(
            status_code=501,
            detail=f"Server-side fetch for '{body.dataset.exchange}' is not implemented yet. "
            "Choose Binance or Bybit (crypto spot), or use CSV upload.",
        )

    if not bars:
        raise HTTPException(status_code=422, detail=empty_msg)
    return bars
