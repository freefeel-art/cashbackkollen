"""
Google Search Console OAuth authentication and property listing.

Setup:
  1. Create client_secrets.json in the same directory as this script:

     {
       "installed": {
         "client_id": "YOUR_CLIENT_ID",
         "client_secret": "YOUR_CLIENT_SECRET",
         "redirect_uris": ["http://localhost"],
         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
         "token_uri": "https://oauth2.googleapis.com/token"
       }
     }

  2. Install dependencies:
     pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client

  3. Run:
     python gsc_auth.py
"""

import json
import os
import sys

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_FILE = os.path.join(SCRIPT_DIR, "token.json")
CLIENT_SECRETS_FILE = os.path.join(SCRIPT_DIR, "client_secrets.json")


def authenticate() -> Credentials:
    creds = None

    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired token...")
            creds.refresh(Request())
        else:
            if not os.path.exists(CLIENT_SECRETS_FILE):
                print(f"Error: {CLIENT_SECRETS_FILE} not found.")
                print("Create it with your OAuth Desktop Client ID and Secret.")
                print("See the file header for the required format.")
                sys.exit(1)

            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, SCOPES
            )
            # Opens the browser automatically; uses a random available port
            creds = flow.run_local_server(port=0, open_browser=True)

        with open(TOKEN_FILE, "w") as fh:
            fh.write(creds.to_json())
        print(f"Credentials saved to {TOKEN_FILE}")

    return creds


def list_properties(creds: Credentials) -> list[dict]:
    service = build("searchconsole", "v1", credentials=creds)
    response = service.sites().list().execute()
    return response.get("siteEntry", [])


def main() -> None:
    print("Authenticating with Google Search Console...")
    creds = authenticate()
    print("Authentication successful.\n")

    try:
        properties = list_properties(creds)
    except HttpError as e:
        print(f"API error: {e}")
        sys.exit(1)

    if not properties:
        print("No Search Console properties found for this account.")
        return

    print(f"Found {len(properties)} propert{'y' if len(properties) == 1 else 'ies'}:\n")
    for prop in properties:
        url = prop.get("siteUrl", "")
        level = prop.get("permissionLevel", "")
        print(f"  {url:<55} [{level}]")


if __name__ == "__main__":
    main()
