# Google Sheets integration

[`Code.gs`](Code.gs) is a Google Apps Script that saves each free-sample request
from the website as a row in a Google Sheet. It also:

- updates the existing row when an email signs up again, instead of adding a
  duplicate;
- guards against spreadsheet formula injection;
- optionally emails `NOTIFY_EMAIL` on each new request.

**Setup, testing and troubleshooting steps are in
[docs/SETUP.md, part 2](../../docs/SETUP.md#2-collect-sample-requests-in-a-google-sheet).**

Columns written, in order: Signed up, First name, Email, Suburb, Mobile, Goal,
Goal (their words), Blend to try, Source, Page, Updated.
