"""
Bybit **public** spot klines (v5) → canonical `OhlcvBar` list.

No API key: `GET /v5/market/kline` with category=spot.

Pagination: each page is sorted **newest first** (Bybit docs). We walk backward in time
by shrinking `end` to one ms before the oldest candle in the current page.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import httpx
from fastapi import HTTPException

from schemas import OhlcvBar

BYBIT_KLINE = "https://api.bybit.com/v5/market/kline"
MAX_KLINES_PER_REQUEST = 1000
MAX_BARS_PER_RUN = 20_000


def ui_symbol_to_bybit_pair(symbol: str) -> str:
    """`BTC/USDT` → `BTCUSDT` (Bybit query param)."""
    cleaned = "".join(c for c in symbol.upper().strip() if c.isalnum())
    if not cleaned:
        raise HTTPException(status_code=422, detail="Invalid empty symbol")
    return cleaned


def ui_interval_to_bybit(interval: str) -> str:
    """
    Forge interval (Binance-style labels) → Bybit `interval` enum.
    See https://bybit-exchange.github.io/docs/v5/market/kline
    """
    key = interval.strip().lower()
    mapping = {
        "5m": "5",
        "15m": "15",
        "1h": "60",
        "4h": "240",
        "1d": "D",
    }
    if key not in mapping:
        raise HTTPException(
            status_code=422,
            detail=f"Interval '{interval}' is not supported for Bybit spot. Use 5m, 15m, 1h, 4h, or 1d.",
        )
    return mapping[key]


def _list_row_to_bar(row: list[str]) -> OhlcvBar:
    open_ms = int(row[0])
    t = (
        datetime.fromtimestamp(open_ms / 1000.0, tz=timezone.utc)
        .isoformat()
        .replace("+00:00", "Z")
    )
    return OhlcvBar(
        time=t,
        open=float(row[1]),
        high=float(row[2]),
        low=float(row[3]),
        close=float(row[4]),
        volume=float(row[5]),
    )


def fetch_bybit_spot_bars(symbol: str, interval: str, start_ms: int, end_ms: int) -> list[OhlcvBar]:
    pair = ui_symbol_to_bybit_pair(symbol)
    iv = ui_interval_to_bybit(interval)

    # Bybit returns `list` sorted **newest first** (reverse by startTime). Binance is oldest-first.
    # We must page backward using the oldest open time in each chunk; advancing `start` from the
    # newest bar (the old bug) only kept ~one page (~1000 most recent candles).
    out: list[OhlcvBar] = []
    window_end = end_ms

    try:
        with httpx.Client(timeout=45.0) as client:
            while window_end >= start_ms and len(out) < MAX_BARS_PER_RUN:
                r = client.get(
                    BYBIT_KLINE,
                    params={
                        "category": "spot",
                        "symbol": pair,
                        "interval": iv,
                        "start": start_ms,
                        "end": window_end,
                        "limit": MAX_KLINES_PER_REQUEST,
                    },
                )
                if r.status_code != 200:
                    raise HTTPException(
                        status_code=502,
                        detail=f"Bybit kline HTTP {r.status_code}: {r.text[:300]}",
                    )
                payload: dict[str, Any] = r.json()
                if payload.get("retCode") != 0:
                    raise HTTPException(
                        status_code=502,
                        detail=f"Bybit kline error: {payload.get('retMsg', payload)}",
                    )
                result = payload.get("result") or {}
                chunk: list[list[str]] = result.get("list") or []
                if not chunk:
                    break

                chunk_out: list[OhlcvBar] = []
                min_open_ms: int | None = None
                for row in chunk:
                    if len(row) < 6:
                        continue
                    open_time = int(row[0])
                    if open_time < start_ms or open_time > end_ms:
                        continue
                    chunk_out.append(_list_row_to_bar(row))
                    min_open_ms = open_time if min_open_ms is None else min(min_open_ms, open_time)

                if not chunk_out:
                    break
                out.extend(chunk_out)

                if min_open_ms is None:
                    break
                if len(chunk) < MAX_KLINES_PER_REQUEST:
                    break
                next_end = min_open_ms - 1
                if next_end < start_ms:
                    break
                if next_end >= window_end:
                    break
                window_end = next_end
    except HTTPException:
        raise
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Could not reach Bybit: {exc}") from exc

    seen: set[str] = set()
    deduped: list[OhlcvBar] = []
    for b in sorted(out, key=lambda x: x.time):
        if b.time in seen:
            continue
        seen.add(b.time)
        deduped.append(b)

    if len(deduped) > MAX_BARS_PER_RUN:
        raise HTTPException(
            status_code=413,
            detail=f"Too many bars (>{MAX_BARS_PER_RUN}) for this MVP — narrow the date range or use a coarser interval.",
        )
    return deduped
