/** SCOPE New Course System — public catalogue and learner-registration API.
 * Keep this project separate from the owner-only Admin Manager project.
 * Script Properties: SCOPE_NEW_COURSE_SPREADSHEET_ID, TURNSTILE_SECRET_KEY,
 * PUBLIC_HOSTNAME (default: scopeweb.github.io).
 */
const CAT_HEADERS=['Course ID','Slug','Title (EN)','Title (বাংলা)','Status','Duration','BD Fee (BDT)','International Fee (USD)','Registration Deadline','BD Start Date','International Status','International Threshold','Course Data JSON','Created At','Published At'];
const REG_HEADERS=['Submitted At','Registration ID','Course ID','Full Name','Email','Phone','Country','Organisation','Role','Education','Language','Payment Method','Payment Reference','Amount','Currency','Payment Status','Consent','Source','Admin Notes'];
const INT_HEADERS=['Submitted At','Record ID','Course ID','Full Name','Email','Phone','Country','Organisation','Role','Education','Preferred Time Zone','Language','Payment Method','Payment Reference','Amount','Currency','Interest Status','Consent','Source','Admin Notes'];
const PROP_ID='SCOPE_NEW_COURSE_SPREADSHEET_ID';

function doGet(e){
  const p=(e&&e.parameter)||{};
  if(p.catalog==='1')return json_({ok:true,courses:publicCourses_()});
  if(p.ping==='1')return json_({ok:true,service:'SCOPE new course registration'});
  return json_({ok:false,error:'not_found'});
}

function doPost(e){
  const p=(e&&e.parameter)||{};
  if(p.website)return json_({ok:true});
  const lock=LockService.getScriptLock();
  try{
    if(!verifyTurnstile_(p['cf-turnstile-response']))return json_({ok:false,error:'security_check'});
    lock.waitLock(15000);
    const course=findPublishedCourse_(String(p.slug||''));
    if(!course)return json_({ok:false,error:'course_unavailable'});
    const intl=String(p.audience||'')==='international';
    const intent=String(p.intent||'register');
    if(intent==='register'&&!course.registrationOpen)return json_({ok:false,error:'registration_closed'});
    if(intl&&course.data.international.status!=='open'&&intent!=='interest')return json_({ok:false,error:'interest_only'});
    if(intl&&!['interest','register'].includes(intent))return json_({ok:false,error:'invalid'});
    if(!intl&&intent!=='register')return json_({ok:false,error:'invalid'});
    const values=validateLearner_(p,intl);
    const ss=book_(),sheetName=intl?course.data.sheets.international:course.data.sheets.bangladesh;
    const sh=ensureSheet_(ss,sheetName,intl?INT_HEADERS:REG_HEADERS);
    const duplicate=duplicateEmail_(sh,values.email,intl,intent);
    if(duplicate)return json_({ok:false,error:'already_submitted'});
    const id=(intl?'SCOPE-I-':'SCOPE-R-')+Utilities.getUuid().replace(/-/g,'').slice(0,14).toUpperCase();
    if(intl&&intent==='interest'){
      sh.appendRow([new Date(),id,course.id,values.name,values.email,values.phone,values.country,values.org,values.role,'',values.timezone,values.language,'','',0,'','Interest',true,'Website','']);
      return json_({ok:true,id:id,type:'interest'});
    }
    const price=intl?course.data.fees.international:course.data.fees.bangladesh;
    if(intl)sh.appendRow([new Date(),id,course.id,values.name,values.email,values.phone,values.country,values.org,values.role,'',values.timezone,values.language,values.paymentMethod||'',values.paymentReference||'',price.amount,price.currency,'Registered',true,'Website','']);
    else sh.appendRow([new Date(),id,course.id,values.name,values.email,values.phone,values.country,values.org,values.role,values.education||'',values.language,values.paymentMethod||'',values.paymentReference||'',price.amount,price.currency,'Pending',true,'Website','']);
    return json_({ok:true,id:id,type:'registration'});
  }catch(err){return json_({ok:false,error:'server_error'});}
  finally{try{lock.releaseLock();}catch(x){}}
}

function courseRecords_(){
  const ss=book_(),sh=ss.getSheetByName('Course Catalog');if(!sh||sh.getLastRow()<2)return [];
  return sh.getRange(2,1,sh.getLastRow()-1,CAT_HEADERS.length).getValues().filter(r=>r[0]&&String(r[4])==='published').map(r=>{
    let d={};try{d=JSON.parse(String(r[12]||'{}'));}catch(e){return null;}
    const ish=d.sheets&&d.sheets.international?ss.getSheetByName(d.sheets.international):null;
    const interestCount=ish&&ish.getLastRow()>1?ish.getRange(2,17,ish.getLastRow()-1,1).getDisplayValues().filter(x=>x[0]==='Interest').length:0;
    const cutoff=d.registration&&d.registration.deadline?new Date(String(d.registration.deadline)+'T23:59:59+06:00'):null;
    const registrationOpen=!cutoff||isNaN(cutoff.getTime())||Date.now()<=cutoff.getTime();
    return {id:String(r[0]),slug:String(r[1]),title:{en:String(r[2]),bn:String(r[3])},status:String(r[4]),duration:String(r[5]),fees:d.fees,registration:Object.assign({},d.registration,{open:registrationOpen}),registrationOpen:registrationOpen,international:Object.assign({},d.international,{interestCount:interestCount}),language:d.language,sessions:d.sessions,delivery:d.delivery,assessment:d.assessment,policies:d.policies,category:d.category,summary:d.summary,sections:d.sections,sheets:d.sheets};
  }).filter(Boolean);
}
function publicCourses_(){return courseRecords_().map(c=>{const out=Object.assign({},c);delete out.sheets;return out;});}
function findPublishedCourse_(slug){return courseRecords_().find(c=>c.slug===slug)||null;}
function validateLearner_(p,intl){
  const name=text_(p.name,120),email=text_(p.email,190).toLowerCase(),phone=text_(p.phone,40),country=text_(p.country,80),org=text_(p.organisation,160),role=text_(p.role,120),language=text_(p.language,80);
  if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!country||!language||String(p.consent)!=='true')throw new Error('invalid');
  return {name:name,email:email,phone:phone,country:country,org:org,role:role,language:language,education:intl?'':text_(p.education,160),timezone:intl?text_(p.timezone,100):'',paymentMethod:intl?'':text_(p.paymentMethod,60),paymentReference:intl?'':text_(p.paymentReference,100)};
}
function duplicateEmail_(sh,email,intl,intent){if(sh.getLastRow()<2)return false;const rows=sh.getRange(2,1,sh.getLastRow()-1,intl?20:19).getDisplayValues();return rows.some(r=>String(r[4]).toLowerCase()===email&&(!intl||r[16]===(intent==='interest'?'Interest':'Registered')));}
function ensureSheet_(ss,name,headers){let sh=ss.getSheetByName(name);if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);sh.getRange(1,1,1,headers.length).setFontWeight('bold');}return sh;}
function book_(){const id=PropertiesService.getScriptProperties().getProperty(PROP_ID);if(!id)throw new Error('Spreadsheet is not configured.');return SpreadsheetApp.openById(id);}
function text_(v,n){v=String(v==null?'':v).trim().slice(0,n);return /^[=+\-@]/.test(v)?"'"+v:v;}
function verifyTurnstile_(token){
  const secret=PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET_KEY');if(!secret||!token)return false;
  try{const res=UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'post',payload:{secret:secret,response:token},muteHttpExceptions:true});const out=JSON.parse(res.getContentText());const host=PropertiesService.getScriptProperties().getProperty('PUBLIC_HOSTNAME')||'scopeweb.github.io';return out.success===true&&out.hostname===host;}catch(e){return false;}
}
function json_(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);}
