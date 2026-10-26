/** SCOPE New Course System — private owner-only Admin Manager.
 * Deploy this Apps Script project as a web app accessible only to the owner.
 * Set Script Property SCOPE_NEW_COURSE_SPREADSHEET_ID to the new spreadsheet ID.
 */
const CATALOG_HEADERS = ['Course ID','Slug','Title (EN)','Title (বাংলা)','Status','Duration','BD Fee (BDT)','International Fee (USD)','Registration Deadline','BD Start Date','International Status','International Threshold','Course Data JSON','Created At','Published At'];
const BD_HEADERS = ['Submitted At','Registration ID','Course ID','Full Name','Email','Phone','Country','Organisation','Role','Education','Language','Payment Method','Payment Reference','Amount','Currency','Payment Status','Consent','Source','Admin Notes'];
const INT_HEADERS = ['Submitted At','Record ID','Course ID','Full Name','Email','Phone','Country','Organisation','Role','Education','Preferred Time Zone','Language','Payment Method','Payment Reference','Amount','Currency','Interest Status','Consent','Source','Admin Notes'];
const SHEET_ID_PROPERTY = 'SCOPE_NEW_COURSE_SPREADSHEET_ID';
const INTERNATIONAL_THRESHOLD = 100;

function doGet() {
  return HtmlService.createTemplateFromFile('Admin').evaluate().setTitle('SCOPE Course Admin Manager').addMetaTag('viewport','width=device-width, initial-scale=1');
}

function setupCourseSystem() {
  const ss = book_();
  ensureTab_(ss, 'Course Catalog', CATALOG_HEADERS);
  const caseData = starterCaseManagement_();
  const row = findCourseRow_(ss, caseData.slug);
  if (!row) {
    ensureCourseTabs_(ss, caseData);
    ss.getSheetByName('Course Catalog').appendRow(catalogRow_(caseData, 'draft', new Date(), ''));
  }
  return listCourses();
}

function listCourses() {
  const ss=book_(), sh=ensureTab_(ss,'Course Catalog',CATALOG_HEADERS), last=sh.getLastRow();
  if (last<2) return [];
  return sh.getRange(2,1,last-1,CATALOG_HEADERS.length).getValues().filter(r=>r[0]).map(r=>{
    let data={}; try { data=JSON.parse(String(r[12]||'{}')); } catch(e) {}
    const intlName=(data.sheets&&data.sheets.international)||sheetName_(data.slug,'International');
    const intl=ss.getSheetByName(intlName), count=intl&&intl.getLastRow()>1?intl.getRange(2,17,intl.getLastRow()-1,1).getDisplayValues().filter(x=>x[0]==='Interest').length:0;
    return {courseId:String(r[0]),slug:String(r[1]),titleEn:String(r[2]),titleBn:String(r[3]),status:String(r[4]),duration:String(r[5]),feeBdt:Number(r[6]||0),feeUsd:Number(r[7]||0),internationalStatus:String(r[10]||'interest'),threshold:Number(r[11]||INTERNATIONAL_THRESHOLD),interestCount:count,deadline:String(r[8]||''),start:String(r[9]||'')};
  });
}

function getCourse(slug) {
  const ss=book_(),row=findCourseRow_(ss,slug);if(!row)throw new Error('Course not found.');
  const r=ss.getSheetByName('Course Catalog').getRange(row,1,1,CATALOG_HEADERS.length).getValues()[0];
  return JSON.parse(String(r[12]||'{}'));
}

function saveCourse(payload) {
  const p=normalizePayload_(payload), ss=book_(), sh=ensureTab_(ss,'Course Catalog',CATALOG_HEADERS);
  let existing=findCourseRow_(ss,p.slug), createdAt=new Date(), courseId='SCOPE-'+Utilities.formatDate(createdAt,'Etc/UTC','yy')+'-'+p.slug.toUpperCase().replace(/[^A-Z0-9]+/g,'-').slice(0,24);
  let priorStatus='draft', publishedAt='';
  if(existing){const old=sh.getRange(existing,1,1,CATALOG_HEADERS.length).getValues()[0];let oldData={};try{oldData=JSON.parse(String(old[12]||'{}'));}catch(e){}courseId=String(old[0]);createdAt=old[13]||createdAt;priorStatus=String(old[4]||'draft');publishedAt=old[14]||'';p.international.status=oldData.international&&oldData.international.status||String(old[10]||'interest');p.sheets=oldData.sheets||p.sheets;}
  p.courseId=courseId;
  verifyVisualAssets_(p.visuals);
  if(JSON.stringify(p).length>45000)throw new Error('Course data exceeds the safe Sheet cell limit. Shorten the content.');
  ensureCourseTabs_(ss,p);
  const row=catalogRow_(p,priorStatus,createdAt,publishedAt);
  if(existing) sh.getRange(existing,1,1,row.length).setValues([row]); else sh.appendRow(row);
  return listCourses();
}

function publishCourse(slug) {
  const ss=book_(), sh=ss.getSheetByName('Course Catalog'), row=findCourseRow_(ss,slug);
  if(!row) throw new Error('Course not found. Save it first.');
  const v=sh.getRange(row,1,1,CATALOG_HEADERS.length).getValues()[0], d=JSON.parse(String(v[12]||'{}'));
  if(!v[2]||!v[3]||!d.sections||!d.sections.some(s=>s.title&&(s.title.en||s.title.bn))) throw new Error('Add both course titles and at least one titled course section before publishing.');
  ensureCourseTabs_(ss,d);
  sh.getRange(row,5).setValue('published');
  if(!v[14]) sh.getRange(row,15).setValue(new Date());
  return listCourses();
}

function launchInternationalBatch(slug) {
  const ss=book_(), sh=ss.getSheetByName('Course Catalog'), row=findCourseRow_(ss,slug);
  if(!row) throw new Error('Course not found.');
  const v=sh.getRange(row,1,1,CATALOG_HEADERS.length).getValues()[0], data=JSON.parse(String(v[12]||'{}'));
  const intl=ss.getSheetByName(data.sheets.international), count=intl&&intl.getLastRow()>1?intl.getRange(2,17,intl.getLastRow()-1,1).getDisplayValues().filter(x=>x[0]==='Interest').length:0, threshold=Number(v[11]||INTERNATIONAL_THRESHOLD);
  if(count<threshold) throw new Error('International batch requires '+threshold+' expressions of interest. Current count: '+count+'.');
  sh.getRange(row,11).setValue('open');
  data.international.status='open';
  sh.getRange(row,13).setValue(JSON.stringify(data));
  return listCourses();
}

function book_(){const id=PropertiesService.getScriptProperties().getProperty(SHEET_ID_PROPERTY);if(!id)throw new Error('Set Script Property '+SHEET_ID_PROPERTY+' before opening Admin Manager.');return SpreadsheetApp.openById(id);}
function ensureTab_(ss,name,headers){let sh=ss.getSheetByName(name);if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,headers.length).setValues([headers]);}else if(sh.getLastRow()===0){sh.getRange(1,1,1,headers.length).setValues([headers]);}if(sh.getFrozenRows()<1)sh.setFrozenRows(1);return sh;}
function ensureCourseTabs_(ss,d){const names=d.sheets||{bangladesh:sheetName_(d.slug,'Bangladesh'),international:sheetName_(d.slug,'International')};ensureTab_(ss,names.bangladesh,BD_HEADERS);ensureTab_(ss,names.international,INT_HEADERS);}
function findCourseRow_(ss,slug){const sh=ss.getSheetByName('Course Catalog');if(!sh||sh.getLastRow()<2)return 0;const i=sh.getRange(2,2,sh.getLastRow()-1,1).getDisplayValues().findIndex(r=>r[0]===slug);return i<0?0:i+2;}
function sheetName_(slug,region){let base=String(slug||'course').replace(/[^a-zA-Z0-9 _-]/g,'').replace(/[-_]+/g,' ').trim();base=base.split(/\s+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');return (base+' - '+region).slice(0,99);}
function catalogRow_(d,status,createdAt,publishedAt){return [d.courseId,d.slug,d.titleEn,d.titleBn,status,d.duration,d.fees.bangladesh.amount,d.fees.international.amount,d.registration.deadline,d.registration.bangladeshStart,d.international.status,d.international.threshold,JSON.stringify(d),createdAt,publishedAt||''];}
function normalizePayload_(x){
  if(!x||typeof x!=='object')throw new Error('Course details are required.');
  const slug=String(x.slug||'').trim().toLowerCase();if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw new Error('Use a URL-safe slug such as case-management.');
  const sections=Array.isArray(x.sections)?x.sections.map(s=>({title:{en:cut_(s.titleEn,120),bn:cut_(s.titleBn,120)},body:{en:cut_(s.bodyEn,5000),bn:cut_(s.bodyBn,5000)}})).filter(s=>s.title.en||s.title.bn||s.body.en||s.body.bn):[];
  const d={schemaVersion:1,courseId:'',slug:slug,category:cut_(x.category,80),titleEn:cut_(x.titleEn,160),titleBn:cut_(x.titleBn,160),summary:{en:cut_(x.summaryEn,1000),bn:cut_(x.summaryBn,1000)},duration:cut_(x.duration,80),fees:{bangladesh:{amount:number_(x.feeBdt),currency:'BDT'},international:{amount:number_(x.feeUsd),currency:'USD'}},registration:{deadline:cut_(x.deadline,30),bangladeshStart:cut_(x.start,30),bangladeshTime:cut_(x.bdTime,100),internationalTime:cut_(x.intTime,100)},international:{status:'interest',threshold:Math.max(1,Math.floor(number_(x.threshold)||INTERNATIONAL_THRESHOLD))},language:{bangladesh:cut_(x.languageBn,120),international:cut_(x.languageInt,120)},delivery:cut_(x.delivery,500),sessions:{perWeek:number_(x.sessionsPerWeek),total:number_(x.totalSessions)},assessment:{passMark:number_(x.passMark)||60,grading:cut_(x.grading,1200),retakePolicy:cut_(x.retakePolicy,1000)},policies:cut_(x.policies,2000),sections:sections};
  if(!d.titleEn||!d.titleBn)throw new Error('Enter course titles in English and Bangla.');
  if(!d.duration)throw new Error('Enter the course duration.');
  d.sheets={bangladesh:sheetName_(slug,'Bangladesh'),international:sheetName_(slug,'International')};
  d.visuals=normalizeVisuals_(x.visuals);
  return d;
}
function cut_(v,n){return String(v==null?'':v).trim().slice(0,n);}
function number_(v){const n=Number(v);return isFinite(n)&&n>=0?n:0;}

function starterCaseManagement_(){
 const slug='case-management';
 return {schemaVersion:1,courseId:'SCOPE-26-CASE-MANAGEMENT',slug:slug,category:'Humanitarian Protection',titleEn:'Humanitarian Case Management: Child Protection and GBV',titleBn:'মানবিক সহায়তা খাতে কেস ম্যানেজমেন্ট: Child Protection ও GBV',summary:{en:'A beginner-to-intermediate, two-month introduction to safe, ethical case management for child protection and gender-based violence in humanitarian settings. Practice uses fictional scenarios only.',bn:'মানবিক সহায়তা খাতে Child Protection ও Gender-Based Violence কেস ম্যানেজমেন্টের নিরাপদ ও নৈতিক ভিত্তি নিয়ে বিগিনার-টু-মিডিয়াম দুই মাসের কোর্স। অনুশীলনে শুধু কাল্পনিক scenario ব্যবহার হবে।'},duration:'2 months',fees:{bangladesh:{amount:650,currency:'BDT'},international:{amount:50,currency:'USD'}},registration:{deadline:'2026-12-15',bangladeshStart:'2026-12-20',bangladeshTime:'To be confirmed',internationalTime:'To be confirmed'},international:{status:'interest',threshold:100},language:{bangladesh:'Bangla and English',international:'English only'},delivery:'SCOPE custom platform, Zoom, Google Meet and Google Classroom',sessions:{perWeek:3,total:24},assessment:{passMark:60,grading:'A+ 80–100 (4.00); A 75–79 (3.75); A− 70–74 (3.50); B+ 65–69 (3.25); B 60–64 (3.00); F 0–59 (0.00).',retakePolicy:'One no-fee retake after 15 days. A second retake is available after another 15 days; fee BDT 100 or USD 10.'},policies:'Course registration is for learners only. Do not submit identifiable child, survivor, or case data. Read the course-specific fee and attendance terms before registering.',sheets:{bangladesh:'Case Mgmt - Bangladesh',international:'Case Mgmt - International'},sections:[
  {title:{en:'Course at a glance',bn:'একনজরে কোর্স'},body:{en:'Two months, three sessions per week, 24 sessions total. Month 1 covers child protection case management and CPIMS+. Month 2 covers GBV case management and GBVIMS+.',bn:'দুই মাসে সপ্তাহে তিনটি করে মোট ২৪টি session। প্রথম মাসে Child Protection case management ও CPIMS+। দ্বিতীয় মাসে GBV case management ও GBVIMS+।'}},
  {title:{en:'Learning pathway',bn:'শেখার ধাপ'},body:{en:'Sessions 1–9: child protection case management. Sessions 10–12: CPIMS+ concepts and a controlled demonstration. Sessions 13–21: GBV case management. Sessions 22–24: GBVIMS+ concepts and a controlled demonstration.',bn:'Session ১–৯: Child Protection case management। ১০–১২: CPIMS+ ধারণা ও নিয়ন্ত্রিত demo। ১৩–২১: GBV case management। ২২–২৪: GBVIMS+ ধারণা ও নিয়ন্ত্রিত demo।'}},
  {title:{en:'Practice and assessment',bn:'অনুশীলন ও মূল্যায়ন'},body:{en:'Guided practice uses fictional, de-identified scenarios. Assessment checks ethical decision-making, safe documentation, referral reasoning and correct use of training environments. No real case records are collected.',bn:'Guided practice-এ কাল্পনিক ও পরিচয়-মুক্ত scenario ব্যবহার হবে। মূল্যায়নে ethical decision-making, নিরাপদ documentation, referral reasoning এবং training environment-এর ব্যবহার দেখা হবে। বাস্তব case record সংগ্রহ করা হবে না।'}},
  {title:{en:'Assessment and certificate',bn:'মূল্যায়ন ও সনদ'},body:{en:'The pass mark is 60%. The certificate records the learner’s course result and grade. SCOPE is an independent training platform and does not claim external accreditation.',bn:'পাস মার্ক ৬০%। সনদে শিক্ষার্থীর ফল ও grade উল্লেখ থাকবে। SCOPE একটি স্বাধীন training platform; বাহ্যিক accreditation দাবি করে না।'}},
  {title:{en:'Retakes and fees',bn:'পুনঃপরীক্ষা ও ফি'},body:{en:'One retake is available without a fee after 15 days. A second retake may be taken after another 15 days for BDT 100 or USD 10. Course fees are non-refundable under the published course policy.',bn:'১৫ দিন পর একবার বিনা ফিতে retake দেওয়া যাবে। আরও ১৫ দিন পর দ্বিতীয় retake-এর ফি BDT ১০০ বা USD ১০। প্রকাশিত course policy অনুযায়ী course fee ফেরতযোগ্য নয়।'}},
  {title:{en:'Before you enrol',bn:'ভর্তির আগে'},body:{en:'This introductory course does not replace accredited case-management training, supervision, inter-agency SOPs, or specialist safeguarding guidance. Software demonstrations depend on authorized training access and use fictional records only.',bn:'এই introductory course স্বীকৃত case-management training, supervision, inter-agency SOP বা specialist safeguarding guidance-এর বিকল্প নয়। Software demo অনুমোদিত training access-এর ওপর নির্ভর করবে এবং শুধু কাল্পনিক record ব্যবহার করবে।'}}
 ]};
}
