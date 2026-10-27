/** SCOPE New Course System — public catalogue and learner-registration API.
 * Keep this project separate from the owner-only Admin Manager project.
 * Script Properties: SCOPE_NEW_COURSE_SPREADSHEET_ID, TURNSTILE_SECRET_KEY,
 * PUBLIC_HOSTNAME (default: scopeweb.github.io).
 */
const CAT_HEADERS=['Course ID','Slug','Title (EN)','Title (বাংলা)','Status','Duration','BD Fee (BDT)','International Fee (USD)','Registration Deadline','BD Start Date','International Status','International Threshold','Course Data JSON','Created At','Published At'];
const REG_HEADERS=['Submitted At','Registration ID','Course ID','Full Name','Email','Phone','Country','Organisation','Role','Education','Language','Payment Method','Payment Reference','Amount','Currency','Payment Status','Consent','Source','Admin Notes','bKash Sender'];
const INT_HEADERS=['Submitted At','Record ID','Course ID','Full Name','Email','Phone','Country','Organisation','Role','Education','Preferred Time Zone','Language','Payment Method','Payment Reference','Amount','Currency','Interest Status','Consent','Source','Admin Notes','Calling Code','Fee and English Willingness','Laptop and Internet','Preferred Class Times','Learning Goals'];
const PROP_ID='SCOPE_NEW_COURSE_SPREADSHEET_ID';

function doGet(e){
  const p=(e&&e.parameter)||{};
  if(p.asset)return publicAsset_(String(p.asset));
  if(p.status)return registrationStatus_(String(p.slug||''),String(p.status),String(p.audience||''));
  if(p.catalog==='1')return json_({ok:true,courses:publicCourses_()});
  if(p.ping==='1')return json_({ok:true,service:'SCOPE new course registration',internationalFormVersion:2});
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
    const values=validateLearner_(p,intl,intent);
    const ss=book_(),sheetName=intl?course.data.sheets.international:course.data.sheets.bangladesh;
    const sh=ensureSheet_(ss,sheetName,intl?INT_HEADERS:REG_HEADERS);
    const duplicate=duplicateEmail_(sh,values.email,intl,intent);
    if(duplicate)return json_({ok:false,error:'already_submitted'});
    if(intent==='register'&&duplicatePaymentReference_(ss,values.paymentReference,intl))return json_({ok:false,error:'duplicate_payment_reference'});
    const id=(intl?'SCOPE-I-':'SCOPE-R-')+Utilities.getUuid().replace(/-/g,'').slice(0,14).toUpperCase();
    if(intl&&intent==='interest'){
      sh.appendRow([new Date(),id,course.id,values.name,values.email,values.phone,values.country,values.org,values.role,values.education,values.timezone,values.language,'','',0,'','Interest',true,'Website','',values.callingCode,values.feeEnglishWilling,values.learningSetup,values.preferredTimes,values.learningGoals]);
      return json_({ok:true,id:id,type:'interest'});
    }
    const price=intl?course.data.fees.international:course.data.fees.bangladesh;
    if(intl)sh.appendRow([new Date(),id,course.id,values.name,values.email,values.phone,values.country,values.org,values.role,values.education,values.timezone,values.language,values.paymentMethod||'',values.paymentReference||'',price.amount,price.currency,'Registered',true,'Website','',values.callingCode,values.feeEnglishWilling,values.learningSetup,values.preferredTimes,values.learningGoals]);
    else sh.appendRow([new Date(),id,course.id,values.name,values.email,values.phone,values.country,values.org,values.role,values.education||'',values.language,values.paymentMethod||'',values.paymentReference||'',price.amount,price.currency,'Pending',true,values.referralSource||'Website','',values.sender||'']);
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
    return {id:String(r[0]),slug:String(r[1]),title:{en:String(r[2]),bn:String(r[3])},status:String(r[4]),duration:String(r[5]),fees:d.fees,registration:Object.assign({},d.registration,{open:registrationOpen}),registrationOpen:registrationOpen,international:Object.assign({},d.international,{interestCount:interestCount}),language:d.language,sessions:d.sessions,delivery:d.delivery,assessment:d.assessment,policies:d.policies,category:d.category,summary:d.summary,sections:d.sections,visuals:d.visuals||{},sheets:d.sheets,data:d};
  }).filter(Boolean);
}
function publicCourses_(){return courseRecords_().map(c=>{const out=Object.assign({},c);delete out.sheets;delete out.data;return out;});}
function findPublishedCourse_(slug){return courseRecords_().find(c=>c.slug===slug)||null;}
function validateLearner_(p,intl,intent){
  const name=text_(p.name,120),email=text_(p.email,190).toLowerCase(),phone=text_(p.phone,40),country=text_(p.country,80),org=text_(p.organisation,160),role=text_(p.role,120),language=text_(p.language,80);
  if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||phone.replace(/[^0-9]/g,'').length<6||!country||!language||String(p.consent)!=='true'||String(p.confirmDetails)!=='true'||String(p.acceptPolicies)!=='true')throw new Error('invalid');
  let paymentMethod='',paymentReference='';
  if(intent==='register'){
    paymentMethod=text_(p.paymentMethod,60);paymentReference=text_(p.paymentReference,100).toUpperCase();
    if(String(p.paymentConfirmed)!=='true')throw new Error('invalid');
    if(intl){if(paymentMethod.length<2||paymentReference.length<2)throw new Error('invalid');}
    else if(paymentMethod!=='bKash Send Money'||!/^[A-Z0-9]{8,12}$/.test(paymentReference))throw new Error('invalid');
  }
  if(intl&&intent==='interest'&&String(p.internationalFormVersion)==='2'&&(!/^\+[1-9][0-9]{0,6}$/.test(String(p.callingCode||''))||!['Yes','No'].includes(p.feeEnglishWilling)||!['Yes','No'].includes(p.learningSetup)||!String(p.timezone||'').trim()||!role))throw new Error('invalid');
  const sender=intl?'':text_(p.sender,11);if(sender&&!/^01[0-9]{9}$/.test(sender))throw new Error('invalid');
  return {sender:sender,referralSource:text_(p.referralSource,80),name:name,email:email,phone:phone,country:country,org:org,role:role,language:language,education:text_(p.education,160),callingCode:text_(p.callingCode,8),feeEnglishWilling:text_(p.feeEnglishWilling,3),learningSetup:text_(p.learningSetup,3),preferredTimes:text_(p.preferredTimes,200),learningGoals:text_(p.learningGoals,1500),timezone:intl?text_(p.timezone,100):'',paymentMethod:paymentMethod,paymentReference:paymentReference};
}
function duplicatePaymentReference_(ss,reference,intl){
  const key=String(reference||'').trim().toUpperCase();if(!key)return false;
  const catalog=ss.getSheetByName('Course Catalog');if(!catalog||catalog.getLastRow()<2)return false;
  const courses=catalog.getRange(2,1,catalog.getLastRow()-1,CAT_HEADERS.length).getValues();
  for(const row of courses){
    if(!row[0]||String(row[4])!=='published')continue;
    let data={};try{data=JSON.parse(String(row[12]||'{}'));}catch(e){continue;}
    const name=data.sheets&&(intl?data.sheets.international:data.sheets.bangladesh);if(!name)continue;
    const sheet=ss.getSheetByName(name);if(!sheet||sheet.getLastRow()<2)continue;
    const column=intl?14:13,values=sheet.getRange(2,column,sheet.getLastRow()-1,1).getDisplayValues();
    if(values.some(v=>String(v[0]).trim().toUpperCase()===key))return true;
  }
  return false;
}
function registrationStatus_(slug,id,audience){
  if(!/^[a-z0-9][a-z0-9-]{1,79}$/.test(slug)||!/^SCOPE-[RI]-[A-F0-9]{14}$/.test(id)||!['bangladesh','international'].includes(audience))return json_({ok:true,supported:true,state:'pending',verified:false});
  const course=findPublishedCourse_(slug);if(!course)return json_({ok:true,supported:true,state:'pending',verified:false});
  const intl=audience==='international',sheetName=course.data.sheets&&(intl?course.data.sheets.international:course.data.sheets.bangladesh),sheet=sheetName?book_().getSheetByName(sheetName):null;
  if(!sheet||sheet.getLastRow()<2)return json_({ok:true,supported:true,state:'pending',verified:false});
  const found=sheet.getRange(2,2,sheet.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).findNext();
  if(!found)return json_({ok:true,supported:true,state:'pending',verified:false});
  const state=String(sheet.getRange(found.getRow(),intl?17:16).getDisplayValue()).trim().toLowerCase();
  if(['verified','confirmed','paid','approved'].includes(state))return json_({ok:true,supported:true,state:'verified',verified:true});
  if(['rejected','action required','needs correction','failed'].includes(state))return json_({ok:true,supported:true,state:'action_required',verified:false});
  return json_({ok:true,supported:true,state:'pending',verified:false});
}
function duplicateEmail_(sh,email,intl,intent){if(sh.getLastRow()<2)return false;const rows=sh.getRange(2,1,sh.getLastRow()-1,intl?20:19).getDisplayValues();return rows.some(r=>String(r[4]).toLowerCase()===email&&(!intl||r[16]===(intent==='interest'?'Interest':'Registered')));}
function ensureSheet_(ss,name,headers){let sh=ss.getSheetByName(name);if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);sh.getRange(1,1,1,headers.length).setFontWeight('bold');}if(sh.getLastColumn()<headers.length)sh.getRange(1,sh.getLastColumn()+1,1,headers.length-sh.getLastColumn()).setValues([headers.slice(sh.getLastColumn())]);return sh;}
function book_(){const id=PropertiesService.getScriptProperties().getProperty(PROP_ID);if(!id)throw new Error('Spreadsheet is not configured.');return SpreadsheetApp.openById(id);}
function text_(v,n){v=String(v==null?'':v).trim().slice(0,n);return /^[=+\-@]/.test(v)?"'"+v:v;}
function verifyTurnstile_(token){
  const secret=PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET_KEY');if(!secret||!token)return false;
  try{const res=UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'post',payload:{secret:secret,response:token},muteHttpExceptions:true});const out=JSON.parse(res.getContentText());const host=PropertiesService.getScriptProperties().getProperty('PUBLIC_HOSTNAME')||'scopeweb.github.io';return out.success===true&&out.hostname===host;}catch(e){return false;}
}
function json_(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);}

// Only image IDs referenced by a published course are available publicly.
function publicAsset_(id){
  if(!/^[A-Za-z0-9_-]{10,100}$/.test(id))return json_({ok:false,error:'not_found'});
  const allowed=courseRecords_().some(c=>['instructors','tools'].some(k=>(c.visuals[k]||[]).some(x=>x.image&&x.image.id===id)));
  if(!allowed)return json_({ok:false,error:'not_found'});
  try{const f=DriveApp.getFileById(id),b=f.getBlob(),mime=b.getContentType();if(f.isTrashed()||f.getSize()>180000||!['image/png','image/jpeg','image/webp'].includes(mime))return json_({ok:false,error:'not_found'});return json_({ok:true,mime:mime,base64:Utilities.base64Encode(b.getBytes())});}catch(e){return json_({ok:false,error:'not_found'});}
}

