"""
Fetch Search Console query data for sc-domain:cashbackkollen.se.

Usage:
    python gsc_queries.py

Reads token.json from the same directory (created by gsc_auth.py).
Writes all results to gsc_queries.csv in the same directory.
Prints the top 50 queries by impressions to the terminal.
"""

import csv
import json
import os
import sys
from datetime import date, timedelta

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_FILE = os.path.join(SCRIPT_DIR, "token.json")
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "gsc_queries.csv")

PROPERTY = "sc-domain:cashbackkollen.se"
ROW_LIMIT = 25_000   # maximum the API allows per request
PRINT_TOP_N = 50


def load_credentials() -> Credentials:
    if not os.path.exists(TOKEN_FILE):
        print(f"Error: {TOKEN_FILE} not found. Run gsc_auth.py first.")
        sys.exit(1)

    creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(TOKEN_FILE, "w") as fh:
            fh.write(creds.to_json())

    return creds


def date_range() -> tuple[str, str]:
    end = date.today() - timedelta(days=1)
    start = end - timedelta(days=89)
    return start.isoformat(), end.isoformat()


def fetch_all_rows(service, start_date: str, end_date: str) -> list[dict]:
    rows = []
    start_row = 0

    print(f"Fetching data for {start_date} → {end_date} ...")

    while True:
        body = {
            "startDate": start_date,
            "endDate": end_date,
            "dimensions": ["query"],
            "orderBy": [{"fieldName": "impressions", "sortOrder": "DESCENDING"}],
            "rowLimit": ROW_LIMIT,
            "startRow": start_row,
        }

        try:
            response = (
                service.searchanalytics()
                .query(siteUrl=PROPERTY, body=body)
                .execute()
            )
        except HttpError as e:
            status = e.resp.status
            reason = e.reason if hasattr(e, "reason") else str(e)
            if status == 403:
                print(f"Error 403: Access denied for {PROPERTY}.")
                print("Check that your account has access to this property.")
            elif status == 429:
                print("Error 429: API quota exceeded. Try again later.")
            else:
                print(f"API error {status}: {reason}")
            sys.exit(1)

        page = response.get("rows", [])
        if not page:
            print("No rows returned. Full API response:")
            print(json.dumps(response, indent=2))
            break

        rows.extend(page)
        print(f"  Retrieved {len(rows)} rows so far...")

        if len(page) < ROW_LIMIT:
            break
        start_row += ROW_LIMIT

    return rows


def parse_rows(raw_rows: list[dict]) -> list[dict]:
    parsed = []
    for row in raw_rows:
        parsed.append({
            "query":       row["keys"][0],
            "clicks":      int(row.get("clicks", 0)),
            "impressions": int(row.get("impressions", 0)),
            "ctr":         round(row.get("ctr", 0.0) * 100, 2),   # stored as fraction
            "position":    round(row.get("position", 0.0), 1),
        })
    return parsed


def save_csv(rows: list[dict], path: str) -> None:
    fields = ["query", "clicks", "impressions", "ctr", "position"]
    with open(path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def print_table(rows: list[dict], n: int) -> None:
    subset = rows[:n]
    if not subset:
        print("No rows to display.")
        return

    col_q   = max(len(r["query"]) for r in subset)
    col_q   = min(max(col_q, 5), 60)
    header  = f"{'#':>4}  {'Query':<{col_q}}  {'Clicks':>7}  {'Impr':>7}  {'CTR':>6}  {'Pos':>6}"
    divider = "-" * len(header)

    print(f"\nTop {n} queries by impressions ({PROPERTY}):\n")
    print(header)
    print(divider)
    for i, row in enumerate(subset, 1):
        q = row["query"]
        if len(q) > col_q:
            q = q[: col_q - 1] + "…"
        print(
            f"{i:>4}  {q:<{col_q}}  {row['clicks']:>7}  {row['impressions']:>7}"
            f"  {row['ctr']:>5.2f}%  {row['position']:>6.1f}"
        )
    print(divider)


def main() -> None:
    creds = load_credentials()
    service = build("searchconsole", "v1", credentials=creds)

    start_date, end_date = date_range()
    raw_rows = fetch_all_rows(service, start_date, end_date)

    if not raw_rows:
        print("No data returned for the requested period.")
        sys.exit(0)

    rows = parse_rows(raw_rows)

    save_csv(rows, OUTPUT_FILE)
    print(f"\nAll {len(rows)} rows saved to {OUTPUT_FILE}")

    print_table(rows, PRINT_TOP_N)


if __name__ == "__main__":
    main()
