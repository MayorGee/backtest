"""
Out-of-sample window: bars on or after oos_start_date (MM/DD/YYYY, UTC midnight).

Used for a second engine pass; equity curve stays full-sample.
"""

from __future__ import annotations

from datetime import datetime, timezone

from schemas import OhlcvBar


def _bar_open_ms(bar: OhlcvBar) -> int:
    t = bar.time.strip()
    if t.endswith("Z"):
        t = t[:-1] + "+00:00"
    dt = datetime.fromisoformat(t)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return int(dt.timestamp() * 1000)


def oos_start_ms_from_ui(mmddyyyy: str) -> int:
    try:
        s = datetime.strptime(mmddyyyy.strip(), "%m/%d/%Y").replace(tzinfo=timezone.utc)
    except ValueError as exc:
        raise ValueError("oosStartDate must be MM/DD/YYYY") from exc
    return int(s.timestamp() * 1000)


def bars_from_oos_start(bars: list[OhlcvBar], oos_mmddyyyy: str) -> list[OhlcvBar]:
    """Subset of bars with open time >= OOS start (UTC day start)."""
    if len(bars) < 2:
        raise ValueError("Need at least two bars")
    boundary = oos_start_ms_from_ui(oos_mmddyyyy)
    first_ms = _bar_open_ms(bars[0])
    last_ms = _bar_open_ms(bars[-1])
    if boundary > last_ms:
        raise ValueError("oosStartDate is after the last bar in the series")
    if boundary < first_ms:
        raise ValueError("oosStartDate is before the first bar in the series")
    out = [b for b in bars if _bar_open_ms(b) >= boundary]
    if len(out) < 2:
        raise ValueError("Out-of-sample needs at least two bars on or after oosStartDate.")
    return out
