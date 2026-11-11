/**
 * Poshan sign-ups → Google Sheet.
 *
 * Paste this into Extensions → Apps Script in the sheet that should collect
 * sign-ups, then deploy it as a web app (see README.md in this folder).
 * Each sign-up becomes one row. If the same email signs up again, their
 * existing row is updated instead of a duplicate being added.
 */

const SHEET_NAME = 'Sign-ups';

// Optional: an address to email on every new sign-up. Leave '' to turn off.
const NOTIFY_EMAIL = '';

const HEADERS = [
  'Signed up', 'First name', 'Email', 'Suburb', 'Mobile',
  'Goal', 'Goal (their words)', 'Blend to try',
  'Source', 'Page', 'Updated',
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p._gotcha) return reply({ ok: true }); // bot honeypot

    const email = String(p.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return reply({ ok: false, error: 'invalid-email' });
    if (!clean(p.first_name) || !clean(p.suburb)) return reply({ ok: false, error: 'missing-fields' });

    const sheet = getSheet();
    const now = new Date();
    const values = [
      now, clean(p.first_name), email, clean(p.suburb), clean(p.mobile),
      clean(p.goal_label || p.goal), clean(p.goal_other), clean(p.blend),
      clean(p.source), clean(p.page), now,
    ];

    const existingRow = findRowByEmail(sheet, email);
    if (existingRow) {
      values[0] = sheet.getRange(existingRow, 1).getValue(); // keep first sign-up date
      sheet.getRange(existingRow, 1, 1, values.length).setValues([values]);
    } else {
      sheet.appendRow(values);
      notify(values);
    }
    return reply({ ok: true, updated: Boolean(existingRow) });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the web app URL in a browser shows this, so you can check it's live.
function doGet() {
  return reply({ ok: true, service: 'poshan-signups' });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#e9f4d4');
  }
  return sheet;
}

function findRowByEmail(sheet, email) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const emails = sheet.getRange(2, 3, last - 1, 1).getValues();
  for (let i = 0; i < emails.length; i++) {
    if (String(emails[i][0]).trim().toLowerCase() === email) return i + 2;
  }
  return 0;
}

// Trim, cap length, and stop spreadsheet formula injection (=, +, -, @).
function clean(v) {
  const s = String(v == null ? '' : v).trim().slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function notify(values) {
  if (!NOTIFY_EMAIL) return;
  MailApp.sendEmail(
    NOTIFY_EMAIL,
    'New Poshan sample request: ' + values[1] + ', ' + values[3],
    HEADERS.slice(0, HEADERS.length - 1).map(function (h, i) { return h + ': ' + values[i]; }).join('\n'),
  );
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
