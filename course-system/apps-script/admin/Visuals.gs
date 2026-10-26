/** Structured visual sections and authenticated media handling. Owner-only project. */
const VISUAL_FIELDS = {
  instructors: {name:'text',role:'pair',organisation:'pair',experience:'pair',bio:'pair',teaches:'pair',image:'asset'},
  tools: {name:'text',description:'pair',image:'asset'},
  projects: {title:'pair',description:'pair',weeks:'number',sessions:'number',hours:'number',credits:'number'},
  syllabus: {title:'pair',description:'pair',sessions:'number',hours:'number'},
  roadmap: {title:'pair',description:'pair'},
  workflow: {title:'pair',description:'pair'},
  benefits: {title:'pair',description:'pair'},
  outcomes: {title:'pair',description:'pair'},
  assessmentSteps: {title:'pair',description:'pair'},
  retakes: {title:'pair',description:'pair'},
  certificate: {title:'pair',description:'pair'},
  enrolment: {title:'pair',description:'pair'},
  gradeBands: {min:'number',max:'number',grade:'text',points:'number'},
  chart: {label:'pair',value:'number'}
};
function normalizeVisuals_(input) {
  const x=input||{}, out={version:1};
  Object.keys(VISUAL_FIELDS).forEach(key=>{
    const rows=x[key]||[];
    if(!Array.isArray(rows)||rows.length>40) throw new Error(key+': maximum 40 entries.');
    out[key]=rows.map(row=>{
      const clean={}; Object.keys(VISUAL_FIELDS[key]).forEach(field=>{
        const type=VISUAL_FIELDS[key][field],v=row[field];
        if(type==='pair')clean[field]={en:visualText_(v&&v.en,1800),bn:visualText_(v&&v.bn,1800)};
        else if(type==='number'){const n=Number(v==null||v===''?0:v);if(!isFinite(n)||n<0||n>100000)throw new Error(key+' / '+field+': enter a non-negative number.');clean[field]=n;}
        else if(type==='asset'){if(v&&v.id){if(!/^[A-Za-z0-9_-]{10,100}$/.test(v.id))throw new Error('Invalid image reference.');clean[field]={id:v.id,mime:visualText_(v.mime,40)};}else clean[field]=null;}
        else clean[field]=visualText_(v,200);
      }); return clean;
    });
  });
  out.chartTitle={en:visualText_(x.chartTitle&&x.chartTitle.en,160),bn:visualText_(x.chartTitle&&x.chartTitle.bn,160)};
  out.chartUnit=visualText_(x.chartUnit,60);out.chartType=x.chartType==='donut'?'donut':'bar';
  out.creditNote={en:visualText_(x.creditNote&&x.creditNote.en,1500),bn:visualText_(x.creditNote&&x.creditNote.bn,1500)};
  const bands=out.gradeBands.slice().sort((a,b)=>a.min-b.min);
  if(bands.length){
    if(bands[0].min!==0||bands[bands.length-1].max!==100)throw new Error('Grade bands must cover 0 through 100. Maximum is exclusive, except 100.');
    bands.forEach((b,i)=>{if(b.min>=b.max||b.max>100||b.points>4||!b.grade||(i&&bands[i-1].max!==b.min))throw new Error('Grade ranges must be contiguous without overlap; grade points must be 0–4.');});
    out.gradeBands=bands;
  }
  if(JSON.stringify(out).length>35000)throw new Error('Visual content is too large. Shorten the descriptions (35,000 character limit).');
  return out;
}
function visualText_(v,max){const t=String(v==null?'':v).trim();if(t.length>max)throw new Error('Text exceeds '+max+' characters.');return t;}
function mediaFolder_(){
  const props=PropertiesService.getScriptProperties();let id=props.getProperty('SCOPE_COURSE_MEDIA_FOLDER_ID');
  if(!id){const f=DriveApp.createFolder('SCOPE Course Media');id=f.getId();props.setProperty('SCOPE_COURSE_MEDIA_FOLDER_ID',id);}
  return DriveApp.getFolderById(id);
}
function mediaFile_(id){
  const file=DriveApp.getFileById(id),parents=file.getParents(),folder=mediaFolder_().getId();let valid=false;
  while(parents.hasNext())if(parents.next().getId()===folder)valid=true;
  if(!valid||file.isTrashed())throw new Error('This image is not in the course media folder.');
  return file;
}
function uploadCourseAsset(input){
  if(!input||!['image/png','image/jpeg','image/webp'].includes(input.mime)||typeof input.base64!=='string'||input.base64.length>250000)throw new Error('Upload a PNG, JPG or WebP image under 180 KB after compression.');
  const bytes=Utilities.base64Decode(input.base64),u=bytes.map(b=>(b+256)%256);
  if(!bytes.length||bytes.length>180000)throw new Error('Image exceeds 180 KB.');
  const png=[137,80,78,71,13,10,26,10].every((b,i)=>u[i]===b),jpg=u[0]===255&&u[1]===216&&u[2]===255,webp=u[0]===82&&u[1]===73&&u[2]===70&&u[3]===70&&u[8]===87&&u[9]===69&&u[10]===66&&u[11]===80;
  if(!(input.mime==='image/png'&&png||input.mime==='image/jpeg'&&jpg||input.mime==='image/webp'&&webp))throw new Error('Image content does not match its file type.');
  const ext=input.mime==='image/png'?'png':input.mime==='image/jpeg'?'jpg':'webp';
  const file=mediaFolder_().createFile(Utilities.newBlob(bytes,input.mime,'course-'+Utilities.getUuid()+'.'+ext));
  return {id:file.getId(),mime:input.mime};
}
function getCourseAsset(id){const f=mediaFile_(id),blob=f.getBlob();if(f.getSize()>180000)throw new Error('Image too large.');return {mime:blob.getContentType(),base64:Utilities.base64Encode(blob.getBytes())};}
function verifyVisualAssets_(visuals){['instructors','tools'].forEach(k=>(visuals[k]||[]).forEach(row=>{if(row.image)mediaFile_(row.image.id);}));}
function include_(file){return HtmlService.createHtmlOutputFromFile(file).getContent();}
