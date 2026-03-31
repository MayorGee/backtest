from __future__ import annotations

import pytest

from bar_split import bars_from_oos_start
from schemas import OhlcvBar


def _bars_three_days() -> list[OhlcvBar]:
    return [
        OhlcvBar(
            time="2024-01-01T00:00:00Z",
            open=100,
            high=100,
            low=100,
            close=100,
            volume=1,
        ),
        OhlcvBar(
            time="2024-01-02T00:00:00Z",
            open=100,
            high=100,
            low=100,
            close=100,
            volume=1,
        ),
        OhlcvBar(
            time="2024-01-03T00:00:00Z",
            open=100,
            high=100,
            low=100,
            close=100,
            volume=1,
        ),
    ]


def test_oos_from_jan3_one_bar_fails() -> None:
    bars = _bars_three_days()
    with pytest.raises(ValueError, match="at least two bars on or after"):
        bars_from_oos_start(bars, "01/03/2024")


def test_oos_from_jan2_two_bars() -> None:
    bars = _bars_three_days()
    oos = bars_from_oos_start(bars, "01/02/2024")
    assert len(oos) == 2
    assert oos[0].time.startswith("2024-01-02")


def test_oos_after_range_fails() -> None:
    bars = _bars_three_days()
    with pytest.raises(ValueError, match="after the last bar"):
        bars_from_oos_start(bars, "01/04/2024")
