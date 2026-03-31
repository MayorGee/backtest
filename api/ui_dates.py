"""Shared MM/DD/YYYY (UTC) parsing for exchange loaders and bar split."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException


def parse_ui_date_range_ms(start: str, end: str) -> tuple[int, int]:
    """
    UI dates are `MM/DD/YYYY` (see DataInput). Interpret as UTC day bounds:
    start = 00:00:00, end = end-of-day.
    """
    try:
        s = datetime.strptime(start.strip(), "%m/%d/%Y").replace(tzinfo=timezone.utc)
        e = datetime.strptime(end.strip(), "%m/%d/%Y").replace(tzinfo=timezone.utc)
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail="startDate/endDate must be MM/DD/YYYY",
        ) from exc
    if e < s:
        raise HTTPException(status_code=422, detail="endDate must be on or after startDate")
    end_ms = int(e.replace(hour=23, minute=59, second=59, microsecond=999_000).timestamp() * 1000)
    start_ms = int(s.timestamp() * 1000)
    return start_ms, end_ms
