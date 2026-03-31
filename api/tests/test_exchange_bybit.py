from __future__ import annotations

from unittest.mock import MagicMock, patch

from exchange_bybit import fetch_bybit_spot_bars


def _ok_list(rows: list[list[str]]) -> dict:
    return {"retCode": 0, "result": {"list": rows}}


def test_bybit_paginates_newest_first_until_full_range() -> None:
    """Reverse-chron pages: must not stop after the first page of newest bars."""
    calls: list[dict] = []

    def fake_get(_url: str, params: dict | None = None) -> MagicMock:
        calls.append(dict(params or {}))
        start = int(params["start"])  # type: ignore[index]
        end = int(params["end"])  # type: ignore[index]

        r = MagicMock()
        r.status_code = 200

        # Three synthetic candles; page size forced to 2 via patch below.
        all_rows = [
            ["1000", "1", "1", "1", "1", "1"],
            ["2000", "2", "2", "2", "2", "2"],
            ["3000", "3", "3", "3", "3", "3"],
        ]
        in_win = [row for row in all_rows if start <= int(row[0]) <= end]
        in_win.sort(key=lambda row: int(row[0]), reverse=True)
        limit = 2
        page = in_win[:limit]

        r.json.return_value = _ok_list(page)
        return r

    mock_client = MagicMock()
    mock_client.get.side_effect = fake_get
    mock_cls = MagicMock()
    mock_cls.return_value.__enter__.return_value = mock_client
    mock_cls.return_value.__exit__.return_value = None

    with (
        patch("exchange_bybit.httpx.Client", mock_cls),
        patch("exchange_bybit.MAX_KLINES_PER_REQUEST", 2),
    ):
        bars = fetch_bybit_spot_bars("TEST/USDT", "1h", 500, 4000)

    opens = [b.open for b in bars]
    assert opens == [1.0, 2.0, 3.0]
    assert len(calls) == 2
    assert calls[0]["end"] == 4000
    assert calls[1]["end"] == 1999  # oldest in first page was 2000 ms


def test_bybit_single_short_chunk_no_extra_request() -> None:
    calls: list[dict] = []

    def fake_get(_url: str, params: dict | None = None) -> MagicMock:
        calls.append(dict(params or {}))
        r = MagicMock()
        r.status_code = 200
        r.json.return_value = _ok_list(
            [
                ["2000", "2", "2", "2", "2", "2"],
                ["1000", "1", "1", "1", "1", "1"],
            ]
        )
        return r

    mock_client = MagicMock()
    mock_client.get.side_effect = fake_get
    mock_cls = MagicMock()
    mock_cls.return_value.__enter__.return_value = mock_client
    mock_cls.return_value.__exit__.return_value = None

    with patch("exchange_bybit.httpx.Client", mock_cls):
        bars = fetch_bybit_spot_bars("X/USDT", "1h", 1000, 3000)

    assert len(bars) == 2
    assert len(calls) == 1
