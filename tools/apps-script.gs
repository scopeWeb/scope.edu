// SCOPE form backend for Google Sheets. Paste into the Apps Script of the EXISTING connected Google Sheet
// (Sheet > Extensions > Apps Script). Credentials never go in the website.
const SHEET_ID = '';   // leave empty when the script is opened from the Sheet itself (recommended)
const COURSES = {
  meal: { title: 'Practical MEAL Training for NGO & Humanitarian Professionals', fee: 650, feeIntl: 80, sheet: 'MEAL Registrations' },
  mis: { title: 'MIS & Information Management: Excel, Power BI and Data Management', fee: 850, feeIntl: 100, sheet: 'MIS Registrations' }
};
const REGISTRATION_SHEETS = ['MEAL Registrations', 'MIS Registrations', 'Registrations']; // keep legacy rows working
const SCHOOL = 'SCOPE';
const MEET_LINK = '';  // optional: Google Meet link, added to the "payment verified" email
const STATUS = ['Pending', 'Verified', 'Rejected'];
const ENROL_HEAD = ['Time', 'Reference', 'Course', 'Name', 'Email', 'Phone', 'Organisation', 'Role', 'Education', 'Heard from', 'bKash sender', 'TrxID', 'Amount', 'Status', 'Verified email sent'];
const INT_HEAD = ['Time', 'Name', 'Email', 'Phone', 'Course interest'];
const INT_PAY_HEAD = ['Time','Payment ID','Interest Reference','Course slug','Course','Learner Name','Email','Country','Amount','Currency','Status','Verified email sent','Admin notes'];
const INT_PAY_STATUSES = ['Instructions sent','Pending','Verified','Rejected','Email failed'];

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
  const p = (e && e.parameter) || {};
  if (p.internationalPayments === '1') return json_({ok:true,open:internationalPaymentsOpen_()});
  const ref = p.status;
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
  if (['enrol','interest','international','payment_request'].indexOf(p.type) === -1) return json_({ok:false,error:'invalid_type'});
  if (p.website) return json_({ ok: true }); // honeypot: bots see success, nothing is saved
  if (!verifyTurnstile_(p['cf-turnstile-response'])) return json_({ ok: false, error: 'captcha' });
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    if (p.type === 'international') return international_(p);
    if (p.type === 'payment_request') return internationalPaymentRequest_(p);
    return p.type === 'enrol' ? enrol_(p) : interest_(p);
  } catch (err) {
    return json_({ ok: false, error: 'server' });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function verifyTurnstile_(token) {
  const secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET_KEY');
  if (!secret || !token) return false;
  try {
    const response = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'post', payload: { secret: secret, response: token }, muteHttpExceptions: true
    });
    const result = JSON.parse(response.getContentText());
    return result.success === true && result.hostname === 'scopeweb.github.io';
  } catch (err) { return false; }
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
  if (!e || !e.range || e.value !== 'Verified') return;
  const name = e.range.getSheet().getName();
  if (name === 'International Payments' && e.range.getColumn() === 11) {
    sendInternationalVerifiedRow_(e.range.getRow());
    return;
  }
  if (REGISTRATION_SHEETS.indexOf(name) !== -1 && e.range.getColumn() === 14) sendVerifiedRow_(name, e.range.getRow());
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
  const intl = book_().getSheetByName('International Payments');
  if (intl && intl.getLastRow() > 1) for (let row = 2; row <= intl.getLastRow(); row++) if (sendInternationalVerifiedRow_(row)) n++;
  SpreadsheetApp.getUi().alert(n + ' email(s) sent.');
}

function escapeHtml_(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function internationalPaymentsOpen_() {
  const props = PropertiesService.getScriptProperties();
  const required = ['SCOPE_PAYMENT_ADMIN_EMAIL','SCOPE_REMITTANCE_BANK_NAME','SCOPE_REMITTANCE_SWIFT','SCOPE_REMITTANCE_ROUTING','SCOPE_REMITTANCE_ACCOUNT_NUMBER','SCOPE_REMITTANCE_ACCOUNT_NAME'];
  return props.getProperty('SCOPE_INTL_PAYMENTS_OPEN') === 'true' && required.every(k => !!props.getProperty(k));
}

function internationalPaymentRequest_(p) {
  const reference = String(p.reference || '').trim();
  const email = String(p.email || '').trim().toLowerCase();
  const slug = String(p.course || '').trim();
  if (!/^[a-f0-9-]{36}$/.test(reference) || !/^.+@[^\s@]+\.[^\s@]+$/.test(email) || !['meal','mis'].includes(slug))
    return json_({ok:false,error:'validation'});
  const interest = book_().getSheetByName('International Interest');
  if (!interest || interest.getLastRow() < 2) return json_({ok:false,error:'interest_not_found'});
  const matches = interest.getRange(2,1,interest.getLastRow()-1,29).getDisplayValues();
  const learner = matches.find(r => r[1] === reference && r[2] === slug && String(r[5]).trim().toLowerCase() === email &&
    String(r[24]).trim().indexOf('Interested') === 0 && String(r[25]).trim() === 'Yes' && String(r[26]).trim() === 'Yes' && String(r[27]).trim() === 'Yes' && String(r[28]).trim() === 'Yes');
  if (!learner) return json_({ok:false,error:'interest_not_found'});
  const course = COURSES[slug];
  const props = PropertiesService.getScriptProperties();
  if (!internationalPaymentsOpen_()) return json_({ok:false,error:'payment_not_open'});
  const bank = {
    name: props.getProperty('SCOPE_REMITTANCE_BANK_NAME') || '',
    swift: props.getProperty('SCOPE_REMITTANCE_SWIFT') || '',
    routing: props.getProperty('SCOPE_REMITTANCE_ROUTING') || '',
    account: props.getProperty('SCOPE_REMITTANCE_ACCOUNT_NUMBER') || '',
    accountName: props.getProperty('SCOPE_REMITTANCE_ACCOUNT_NAME') || '',
    adminEmail: props.getProperty('SCOPE_PAYMENT_ADMIN_EMAIL') || ''
  };
  if (Object.keys(bank).some(k => !bank[k])) return json_({ok:false,error:'payment_not_configured'});
  const ss = book_();
  const sh = sheet_('International Payments', INT_PAY_HEAD, [2,3,4,7]);
  sh.getRange(1,1,1,INT_PAY_HEAD.length).setValues([INT_PAY_HEAD]);
  sh.getRange(2,11,Math.max(sh.getMaxRows()-1,1),1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(INT_PAY_STATUSES,true).build());
  let row = 0, paymentId = '';
  if (sh.getLastRow() > 1) {
    const existing = sh.getRange(2,1,sh.getLastRow()-1,INT_PAY_HEAD.length).getDisplayValues();
    const found = existing.findIndex(r => r[2] === reference);
    if (found >= 0) {
      row = found + 2;
      paymentId = existing[found][1];
      const state = existing[found][10];
      if (state === 'Verified') return json_({ok:false,error:'already_verified'});
      if (state !== 'Email failed') return json_({ok:true,type:'payment_instructions',paymentId:paymentId,alreadySent:true});
    }
  }
  if (!row) {
    paymentId = 'SCOPE-P-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd') + '-' + Utilities.getUuid().replace(/-/g,'').slice(0,8).toUpperCase();
    row = sh.getLastRow()+1;
    sh.appendRow([new Date(),paymentId,reference,slug,course.title,learner[4],email,learner[6],course.feeIntl,'USD','Pending','', '']);
  }
  const esc = escapeHtml_;
  const subject = 'SCOPE bank transfer instructions · ' + paymentId;
  const body = 'Dear ' + learner[4] + ',\n\nYou requested international bank transfer instructions for ' + course.title + '.\n\nPayment ID: ' + paymentId + '\nAmount: USD ' + course.feeIntl + '\nBank: ' + bank.name + '\nSWIFT/BIC: ' + bank.swift + '\nRouting number: ' + bank.routing + '\nAccount name: ' + bank.accountName + '\nAccount number: ' + bank.account + '\nPayment reference/purpose: SCOPE course fee · ' + slug.toUpperCase() + ' · ' + paymentId + '\n\nPlease check any sender/intermediary bank charges before transfer. A payment is not confirmed until SCOPE verifies that the funds have arrived. After sending, reply to this email with the transfer receipt or bank reference.\n\n— SCOPE';
  const htmlBody = '<p>Dear ' + esc(learner[4]) + ',</p><p>You requested international bank transfer instructions for <strong>' + esc(course.title) + '</strong>.</p><p><strong>Payment ID:</strong> ' + esc(paymentId) + '<br><strong>Amount:</strong> USD ' + course.feeIntl + '</p><p><strong>Bank:</strong> ' + esc(bank.name) + '<br><strong>SWIFT/BIC:</strong> ' + esc(bank.swift) + '<br><strong>Routing number:</strong> ' + esc(bank.routing) + '<br><strong>Account name:</strong> ' + esc(bank.accountName) + '<br><strong>Account number:</strong> ' + esc(bank.account) + '</p><p><strong>Payment reference/purpose:</strong> SCOPE course fee · ' + slug.toUpperCase() + ' · ' + esc(paymentId) + '</p><p>Please check any sender/intermediary bank charges before transfer. A payment is not confirmed until SCOPE verifies that the funds have arrived. After sending, reply to this email with the transfer receipt or bank reference.</p><p>— SCOPE</p>';
  try {
    MailApp.sendEmail({to:email,name:SCHOOL,subject:subject,body:body,htmlBody:htmlBody,replyTo:bank.adminEmail});
    sh.getRange(row,11).setValue('Pending');
    sh.getRange(row,13).setValue('Transfer instructions emailed');
  } catch (err) {
    sh.getRange(row,11).setValue('Email failed');
    sh.getRange(row,13).setValue('Email delivery failed; learner may retry.');
    return json_({ok:false,error:'email_failed'});
  }
  const admin = props.getProperty('SCOPE_PAYMENT_ADMIN_EMAIL');
  if (admin) {
    try { MailApp.sendEmail({to:admin,name:SCHOOL,subject:'International payment request · '+paymentId,body:'A learner requested bank transfer details.\nPayment ID: '+paymentId+'\nCourse: '+course.title+'\nAmount: USD '+course.feeIntl+'\nLearner: '+learner[4]+' <'+email+'>\nCountry: '+learner[6]+'\nStatus: Pending. Check the International Payments tab after funds arrive.'}); } catch (err) {}
  }
  return json_({ok:true,type:'payment_instructions',paymentId:paymentId});
}

function sendInternationalVerifiedRow_(row) {
  const sh = book_().getSheetByName('International Payments');
  if (!sh || row < 2) return false;
  const r = sh.getRange(row,1,1,INT_PAY_HEAD.length).getValues()[0];
  if (String(r[10]).trim() !== 'Verified' || r[11]) return false;
  try {
    const courseName = String(r[4]), paymentId = String(r[1]), learner = String(r[5]), email = String(r[6]);
    MailApp.sendEmail({to:email,name:SCHOOL,subject:SCHOOL+': payment verified · '+paymentId,
      body:'Dear '+learner+',\n\nSCOPE has verified receipt of your international course payment.\n\nCourse: '+courseName+'\nAmount: USD '+r[8]+'\nPayment ID: '+paymentId+'\nStatus: Payment verified. SCOPE will send any class/access details separately.\n\n— '+SCHOOL});
    sh.getRange(row,12).setValue(new Date()).setNote('Payment verification email sent.');
    return true;
  } catch (err) {
    sh.getRange(row,13).setNote('Verification email failed: '+String(err).slice(0,300));
    return false;
  }
}

function international_(p) {
 const titles = {"meal":"Practical MEAL Training for NGO & Humanitarian Professionals","office-skills":"Computer Skills for Office Work","mis":"MIS & Information Management: Excel, Power BI and Data Management","data-analytics":"Data Analytics: Excel and Power BI","medical-data-science":"Data Science for Medical Data: Breast Cancer Classification","public-health-ml-research":"Public Health Research with Machine Learning","medical-nlp-evidence-review":"Medical NLP: Clinical Evidence Review Assistant","python-sql":"Python and SQL for Data Analysis","research":"Research Methods: SPSS, R, Proposal and Report Writing"};
 const international=p.interestMode==='international'&&(p.course==='meal'||p.course==='mis');
 const mis=p.course==='mis';
 const readiness=["feeEnglishWilling","internetAccess","reliableInternet","laptopAccess"];
 if(readiness.some(k=>["Yes","No"].indexOf(p[k])===-1))return json_({ok:false,error:"validation"});
 if(p.interestMode!=='international'&&p.interestMode!=='general')return json_({ok:false,error:'validation'});
 const required=['name','email','country','callingCode','phone','occupation','timezone'];
 if(!titles[p.course]||required.some(k=>!p[k]||String(p[k]).length>200)||!/^.+@[^\s@]+\.[^\s@]+$/.test(p.email)||!/^\+[1-9][0-9]{0,6}$/.test(p.callingCode)||! /^[0-9 ()+.-]{4,25}$/.test(p.phone)||String(p.experience||'').length>1500||p.terms!=='on'||p.contactConsent!=='on'||! /^[a-f0-9-]{36}$/.test(p.reference||''))return json_({ok:false,error:'validation'});
 const keys=['name','email','country','callingCode','phone','occupation','organisation','university','universityCountry','qualification','experience','timezone','preferredTimes'];
 const head=['Timestamp','Reference','Course slug','Course title'].concat(keys,['Fee','Currency','Duration','Classes','Launch threshold','Terms','Contact consent','Status']);
 head.push.apply(head,readiness);
 const sh=sheet_(p.interestMode==='general'?'Course Interest':'International Interest',head,head.map((_,i)=>i+1));
 sh.getRange(1,1,1,head.length).setValues([head]);
 if(sh.getLastRow()>1&&sh.getRange(2,2,sh.getLastRow()-1,1).getValues().some(r=>r[0]===p.reference))return json_({ok:true,type:'international',schema:2,reference:p.reference});
 const safe=v=>{v=String(v||'').trim();return /^[=+\-@]/.test(v)?"'"+v:v;};
 sh.appendRow([new Date(),p.reference,p.course,titles[p.course]].concat(keys.map(k=>safe(p[k])),[international?(mis?100:80):'',international?'USD':'',international?'3 months':'',international?36:'',international?(mis?'At least 500 by 30 December 2026; conditional launch January 2027':'More than 500 by 25 November 2026; conditional start 5 December 2026'):'To be announced',true,true,'Interested — no payment'],readiness.map(k=>p[k])));
 SpreadsheetApp.flush();return json_({ok:true,type:'international',schema:2,reference:p.reference});
}
