// SCOPE form backend for Google Sheets. Paste into the Apps Script of a NEW Google Sheet
// (Sheet > Extensions > Apps Script). Credentials never go in the website.
const SHEET_ID = '';   // leave empty when the script is opened from the Sheet itself (recommended)
const COURSES = {
  meal: { title: 'Practical MEAL Training for NGO & Humanitarian Professionals', fee: 650, sheet: 'MEAL Registrations' },
  mis: { title: 'MIS & Information Management: Excel, Power BI and Data Management', fee: 850, sheet: 'MIS Registrations' }
};
const REGISTRATION_SHEETS = ['MEAL Registrations', 'MIS Registrations', 'Registrations']; // keep legacy rows working
const SCHOOL = 'SCOPE';
const MEET_LINK = '';  // optional: Google Meet link, added to the "payment verified" email
const STATUS = ['Pending', 'Verified', 'Rejected'];
const ENROL_HEAD = ['Time', 'Reference', 'Course', 'Name', 'Email', 'Phone', 'Organisation', 'Role', 'Education', 'Heard from', 'bKash sender', 'TrxID', 'Amount', 'Status', 'Verified email sent'];
const INT_HEAD = ['Time', 'Name', 'Email', 'Phone', 'Course interest'];

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function s_(v) { v = String(v == null ? '' : v).trim().slice(0, 200); return /^[=+\-@]/.test(v) ? "'" + v : v; } // blocks spreadsheet formula injection
function book_() { return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet(); }
function sheet_(name, head, textCols) {
  const ss = book_(); let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name); sh.appendRow(head); sh.setFrozenRows(1); sh.getRange(1, 1, 1, head.length).setFontWeight('bold');
    textCols.forEach(function (c) { sh.getRange(1, c, sh.getMaxRows(), 1).setNumberFormat('@'); }); // keep 01XXXXXXXXX and TrxID as text
    if (REGISTRATION_SHEETS.indexOf(name) !== -1) sh.getRange(2, 14, 1000, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUS, true).build());
  }
  return sh;
}

function doGet(e) {
  const ref = e && e.parameter && e.parameter.status;
  if (!ref) return json_({ ok: true, service: 'SCOPE form endpoint' });
  const ss = book_();
  for (let s = 0; s < REGISTRATION_SHEETS.length; s++) {
    const sh = ss.getSheetByName(REGISTRATION_SHEETS[s]);
    if (!sh || sh.getLastRow() < 2) continue;
    const rows = sh.getRange(2, 2, sh.getLastRow() - 1, 14).getValues();
    for (let i = 0; i < rows.length; i++) if (String(rows[i][0]) === ref)
      return json_({ ok: true, verified: rows[i][12] === 'Verified' });
  }
  return json_({ ok: false });
} // exposes only the public status for an unguessable registration reference

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return json_({ ok: true }); // honeypot: bots see success, nothing is saved
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    return p.type === 'enrol' ? enrol_(p) : interest_(p);
  } catch (err) {
    return json_({ ok: false, error: 'server' });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function enrol_(p) {
  const name = s_(p.name), email = s_(p.email).toLowerCase(), phone = s_(p.phone), sender = s_(p.sender), trx = s_(p.trxid).toUpperCase(), ref = s_(p.ref);
  const course = COURSES[p.courseSlug];
  const mob = /^01[3-9]\d{8}$/;
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || !mob.test(phone) || !mob.test(sender) || !/^[A-Z0-9]{8,12}$/.test(trx) ||
      !/^SCOPE-[A-Z]{1,6}-\d{6}-[A-Z0-9]{4}$/.test(ref) || !p.consent || !course ||
      s_(p.course) !== course.title || Number(p.amount) !== course.fee) return json_({ ok: false, error: 'invalid' });
  const ss = book_();
  for (let i = 0; i < REGISTRATION_SHEETS.length; i++) {
    const prior = ss.getSheetByName(REGISTRATION_SHEETS[i]);
    if (!prior || prior.getLastRow() < 2) continue;
    const rows = prior.getRange(2, 1, prior.getLastRow() - 1, 12).getValues();
    for (let j = 0; j < rows.length; j++) {
      if (String(rows[j][1]) === ref) return json_({ ok: true, ref: ref }); // idempotent retry
      if (String(rows[j][11]).toUpperCase() === trx) return json_({ ok: false, error: 'duplicate_trx' });
    }
  }
  const sh = sheet_(course.sheet, ENROL_HEAD, [6, 11, 12]);
  sh.appendRow([new Date(), ref, course.title, name, email, phone, s_(p.org), s_(p.role), s_(p.edu), s_(p.src), sender, trx, course.fee, 'Pending', '']);
  const bn = p.lang === 'bn';
  try {
    MailApp.sendEmail({ to: email, name: SCHOOL, subject: SCHOOL + (bn ? ' নিবন্ধন পাওয়া গেছে: ' : ' registration received: ') + ref,
      body: bn
        ? 'প্রিয় ' + name + ',\n\nআপনার নিবন্ধন পাওয়া গেছে।\nরেফারেন্স: ' + ref + '\nTrxID: ' + trx + '\nস্ট্যাটাস: পেমেন্ট যাচাইয়ের অপেক্ষায়\n\nস্কোপ বিকাশের রেকর্ডের সাথে আপনার পেমেন্ট মিলিয়ে দেখবে। যাচাই শেষ হলে আপনি আরেকটি ইমেইল পাবেন।\n\n— ' + SCHOOL
        : 'Dear ' + name + ',\n\nWe have received your registration.\nReference: ' + ref + '\nTrxID: ' + trx + '\nStatus: payment pending verification\n\n' + SCHOOL + ' will check your payment against the bKash record. You will receive another email once it is verified.\n\n— ' + SCHOOL });
  } catch (err) {} // email problems (daily quota) must never lose a saved registration
  return json_({ ok: true, ref: ref });
}

function interest_(p) {
  const name = s_(p.name), email = s_(p.email);
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || !p.consent) return json_({ ok: false, error: 'invalid' });
  sheet_('Interest', INT_HEAD, [4]).appendRow([new Date(), name, email, s_(p.phone), s_(p.course)]);
  return json_({ ok: true });
}

// Create an installable spreadsheet On edit trigger for statusChanged (MailApp needs authorization).
function statusChanged(e) {
  if (!e || !e.range || REGISTRATION_SHEETS.indexOf(e.range.getSheet().getName()) === -1 ||
      e.range.getColumn() !== 14 || e.value !== 'Verified') return;
  sendVerifiedRow_(e.range.getSheet().getName(), e.range.getRow());
}
function sendVerifiedRow_(sheetName, row) {
  const sh = book_().getSheetByName(sheetName);
  if (!sh || row < 2) return false;
  const r = sh.getRange(row, 1, 1, 15).getValues()[0];
  if (r[13] !== 'Verified' || r[14]) return false;
  try {
    MailApp.sendEmail({ to: r[4], name: SCHOOL, subject: SCHOOL + ': your seat is confirmed (' + r[1] + ')',
      body: 'Dear ' + r[3] + ',\n\nYour payment is verified and your seat in "' + r[2] + '" is confirmed.\nReference: ' + r[1] + '\n' + (MEET_LINK ? 'Class link (Google Meet): ' + MEET_LINK + '\n' : '') + '\n— ' + SCHOOL });
    sh.getRange(row, 15).setValue(new Date()).setNote('Payment verification email sent.');
    return true;
  } catch (err) {
    sh.getRange(row, 15).setNote('Email send failed: ' + String(err).slice(0, 300));
    return false;
  }
}
// Menu remains as a manual retry for rows where email delivery previously failed.
function onOpen() { SpreadsheetApp.getUi().createMenu('SCOPE').addItem('Retry unsent verification emails', 'sendVerified').addToUi(); }
function sendVerified() {
  const ss = book_(); let n = 0;
  for (let i = 0; i < REGISTRATION_SHEETS.length; i++) {
    const sh = ss.getSheetByName(REGISTRATION_SHEETS[i]);
    if (!sh || sh.getLastRow() < 2) continue;
    for (let row = 2; row <= sh.getLastRow(); row++)
      if (sendVerifiedRow_(REGISTRATION_SHEETS[i], row)) n++;
  }
  SpreadsheetApp.getUi().alert(n + ' email(s) sent.');
}
