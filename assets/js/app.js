(()=>{"use strict";const R=document.currentScript.dataset.root,S=SCOPE,B=document.body,$=(s,r=document)=>r.querySelector(s);
let L="en";try{L=localStorage.getItem("scope-lang")||"en"}catch(e){}if(!S.t[L])L="en";
const T=()=>S.t[L],esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])),P=u=>R+u;
const PH=/^01[3-9]\d{8}$/,clean=v=>v.replace(/[\s-]/g,"").replace(/^\+?88/,""),open=()=>S.courses.find(c=>c.st==="current");
let enrolC=null,saved=null;
const icon=k=>{const i=S.icons[k];return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${i.p}" pathLength="1"/>${i.d?`<path class="dt" d="${i.d}"/>`:""}</svg>`};
const badge=s=>`<span class="badge b-${s}"><i aria-hidden="true">${{current:"●",soon:"◔",planned:"◇"}[s]}</i>${T()[s]}</span>`;
const curl=c=>P(`courses/${c.slug}/index.html`),regUrl=c=>P("register/index.html"+(c?"?course="+c.slug:"?mode=interest")),interestUrl=c=>P("register/index.html?mode=interest"+(c?"&course="+c.slug:""));
const liveArt=c=>c.slug==="mis"?`<div class="live-art mis-art" aria-hidden="true"><span class="art-kicker">SCOPE · MIS</span><div class="art-logos"><img src="${P("assets/img/excel-logo.svg")}" alt=""><img src="${P("assets/img/power-bi-logo.svg")}" alt=""></div><div class="art-chart"><i></i><i></i><i></i><i></i><i></i><span>DATA → INSIGHT</span></div><b class="live-pulse">LIVE COURSE</b></div>`:`<div class="live-art meal-art" aria-hidden="true"><span class="art-kicker">SCOPE · MEAL</span><div class="meal-orbit"><i class="orbit-dot"></i><b>MEAL</b><span>FIELD</span><span>DATA</span><span>IMPACT</span></div><b class="live-pulse">LIVE COURSE</b></div>`;
const researchArt=c=>{const label=c.slug==="medical-nlp-evidence-review"?"MEDICAL NLP":c.slug==="public-health-ml-research"?"PUBLIC HEALTH":c.slug==="medical-data-science"?"MEDICAL DATA":"RESEARCH METHODS",tags=c.slug==="medical-nlp-evidence-review"?"PICO · EVIDENCE":c.slug==="public-health-ml-research"?"ML · DIABETES":c.slug==="medical-data-science"?"PYTHON · ML":"SPSS · R";return `<div class="research-art" aria-hidden="true"><span class="art-kicker">SCOPE · RESEARCH</span><div class="research-visual"><svg viewBox="0 0 220 78"><path d="M22 56 70 25l40 24 42-34 42 24"/><circle cx="22" cy="56" r="5"/><circle cx="70" cy="25" r="5"/><circle cx="110" cy="49" r="5"/><circle cx="152" cy="15" r="5"/><circle cx="194" cy="39" r="5"/></svg><b>${label}</b></div><span class="research-tags">${tags}</span></div>`};
const card=c=>`<a class="card course-card rv${c.st==="current"?" live-card":""}" style="--h:${c.hue}" href="${curl(c)}">${c.st==="current"?liveArt(c):c.cat==="research"?researchArt(c):icon(c.cat)}${badge(c.st)}<h3>${esc(c[L][0])}</h3><p>${esc(c[L][1])}</p><span class="more">${T().more}</span></a>`;
const cta=(cl="",c=open())=>c?`<a class="btn ${cl}" href="${regUrl(c)}">${T().reg}</a>`:"";
const facts=ks=>`<dl class="facts">${S.facts.filter(f=>!ks||ks.includes(f[0])).map(f=>`<div${f[0]==="dl"?' class="deadline"':''}><dt>${T().f[f[0]]}</dt><dd>${f[L==="bn"?2:1]}</dd></div>`).join("")}</dl>`;
const factsFor=c=>S.courseFacts[c.slug]||S.facts,feeFor=c=>factsFor(c).find(f=>f[0]==="fee")[L==="bn"?2:1],factsHtml=(c,ks)=>`<dl class="facts">${factsFor(c).filter(f=>!ks||ks.includes(f[0])).map(f=>`<div${f[0]==="dl"?" class=deadline":""}><dt>${T().f[f[0]]}</dt><dd>${f[L==="bn"?2:1]}</dd></div>`).join("")}</dl>`;
const sec=(c,h,b)=>`<section class="sec ${c}">${h?`<h2 class="rv">${h}</h2>`:""}${b}</section>`,sub=(h,p,hue)=>`<section class="phero" style="--h:${hue||205}"><h1>${h}</h1>${p?`<p>${p}</p>`:""}</section>`;
const norm=u=>new URL(u,location.href).pathname.replace(/index\.html$/,"");
function shell(){const t=T(),nav=[["home","index.html"],["meal","courses/index.html"],["about","about/index.html"],["learn","learn/index.html"],["contact","contact/index.html"]],here=norm(location.href);
$("#hdr").innerHTML=`<header class="hd"><a class="brand" href="${P("index.html")}"><img src="${P("assets/img/logo-trim.png")}" alt="SCOPE: School for Career-Oriented Professional Education" width="140" height="48"></a><button class="bg" aria-expanded="false" aria-controls="nv">${t.menu}</button><nav id="nv" aria-label="Main">${nav.map(n=>`<a href="${P(n[1])}"${norm(P(n[1]))===here?' aria-current="page"':""}>${t[n[0]]}</a>`).join("")}<button class="lg" type="button">${t.lang}</button></nav></header>`;
$("#ftr").innerHTML=`<footer class="ft"><div class="ft-glass"><div class="ft-top"><a class="ft-logo" href="${P("index.html")}" aria-label="SCOPE home"><img src="${P("assets/img/logo-trim.png")}" alt="SCOPE: School for Career-Oriented Professional Education" width="140" height="48"></a><nav class="ft-nav" aria-label="Footer">${nav.map(n=>`<a href="${P(n[1])}">${t[n[0]]}</a>`).join("")}</nav><button class="mo" type="button">${t.mo}: ${t.ml[FX.level()]}</button></div><div class="ft-bottom"><span>© ${new Date().getFullYear()} SCOPE · ${t.foot}</span><a href="${P("refund/index.html")}">${L==="bn"?"MEAL ফি ও নীতিমালা":"MEAL fees & policy"}</a></div></div></footer>`;
$(".bg").onclick=e=>{e.currentTarget.setAttribute("aria-expanded",$("#nv").classList.toggle("open"))};
$(".lg").onclick=()=>{saved=snap();L=L==="en"?"bn":"en";try{localStorage.setItem("scope-lang",L)}catch(e){}render()};$(".mo").onclick=FX.cycle}
/* ---------- registration (enrolment with bKash) ---------- */
function interestPage(){const t=T(),chosen=new URLSearchParams(location.search).get("course");return sub(t.form)+sec("light","",`<form id="rf" novalidate><input type="hidden" name="type" value="interest"><input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">${[["n","name","text"],["e","email","email"],["p","phone","tel"]].map(f=>`<label>${t[f[0]]}<input name="${f[1]}" type="${f[2]}" required aria-describedby="er-${f[1]}"><small id="er-${f[1]}" class="er"></small></label>`).join("")}<label>${t.ci}<select name="course">${S.courses.filter(c=>c.st!=="current").map(c=>`<option value="${esc(c[L][0])}"${chosen===c.slug?" selected":""}>${esc(c[L][0])}</option>`).join("")}</select></label><label class="ck"><input type="checkbox" name="consent" required> ${t.cons}</label><div class="cf-turnstile" data-sitekey="${esc(S.turnstileSiteKey)}" data-theme="light"></div><button class="btn" type="submit">${t.send}</button><p id="st" role="status" tabindex="-1"></p></form>`)}
function enrolPage(c){const t=T(),r=t.r,fee=feeFor(c);
const fld=(k,lab,type,req,ac,hint)=>`<label>${lab}${req?"":` <small class="opt">(${r.opt})</small>`}<input name="${k}" type="${type}"${req?" required":""}${ac?` autocomplete="${ac}"`:""} aria-describedby="er-${k}">${hint?`<small class="hl">${hint}</small>`:""}<small id="er-${k}" class="er"></small></label>`;
const selc=(k,lab,o)=>`<label>${lab} <small class="opt">(${r.opt})</small><select name="${k}"><option value="">${r.pick}</option>${o.map(x=>`<option value="${esc(x[0])}">${x[L==="bn"?1:0]}</option>`).join("")}</select></label>`;
const nav=(b,n,last)=>`<p class="row">${b!=null?`<button class="btn ghost-d" type="button" data-go="${b}">${r.back}</button>`:""}${last?`<button class="btn" id="go" type="submit">${r.go}</button>`:`<button class="btn" type="button" data-go="${n}">${r.next}</button>`}</p>`;
return sub(r.h,r.sub,c.hue)+sec("light","",`<div class="reg" style="--h:${c.hue}"><div class="regmain"><ol class="stepper" aria-label="${esc(r.steps.join(" / "))}">${r.steps.map((s,i)=>`<li data-i="${i}"${i?"":' aria-current="step"'}><b>${i+1}</b><span>${s}</span></li>`).join("")}</ol>
<form id="ef" novalidate data-step="0"><input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
<fieldset class="stp" data-s="0"><legend tabindex="-1">${r.steps[0]}</legend><label>${r.lc}<select name="courseSlug" id="courseSelect" required>${S.courses.filter(x=>x.st==="current").map(x=>`<option value="${x.slug}"${x.slug===c.slug?" selected":""}>${esc(x[L][0])}</option>`).join("")}</select><small id="er-courseSlug" class="er"></small></label>${fld("name",r.nm,"text",1,"name")}${fld("email",t.e,"email",1,"email")}${fld("phone",r.ph,"tel",1,"tel",r.phh)}${fld("org",r.org,"text",0,"organization")}${fld("role",r.role,"text",0,"organization-title")}${selc("edu",r.edu,S.opts.edu)}${selc("src",r.src,S.opts.src)}${nav(null,1)}</fieldset>
<fieldset class="stp" data-s="1" hidden><legend tabindex="-1">${r.payh}</legend><div class="paybox">${c.slug==="meal"?mealPolicy()+`<p><a href="${P("courses/meal/index.html")}" target="_blank" rel="noopener">${L==="bn"?"মূল্যায়ন, রিটেক ও সনদের শর্ত পড়ুন":"Read assessment, retake and certificate requirements"}</a></p>`:""}<dl class="facts"><div><dt>${r.amt}</dt><dd id="courseFee">${fee}</dd></div><div><dt>${r.to}</dt><dd><span class="num" id="bk">${S.pay.to}</span> <button class="btn sm ghost-d" type="button" id="cp">${r.copy}</button></dd></div></dl><ol class="how">${r.how.map(h=>`<li>${h}</li>`).join("")}</ol><p class="note">${r.manual}</p><p class="safe">${r.safe}</p></div>${fld("sender",r.snd,"tel",1,"tel",r.phh)}${fld("trxid",r.trx,"text",1,"off",r.trxh)}<label class="ck"><input type="checkbox" name="sent" required> ${r.sent}</label>${nav(0,2)}</fieldset>
<fieldset class="stp" data-s="2" hidden><legend tabindex="-1">${r.revh}</legend><dl class="facts" id="rv"></dl><label class="ck"><input type="checkbox" name="ok2" required> ${r.conf}${c.slug==="meal"?(L==="bn"?" আমি MEAL-এর ৬০% পাসের শর্ত, রিটেক ও ফেরত নীতি পড়েছি।":" I have read the MEAL 60% pass requirement, retake and refund policy."):""}</label><label class="ck"><input type="checkbox" name="consent" required> ${t.cons}</label><div class="cf-turnstile" data-sitekey="${esc(S.turnstileSiteKey)}" data-theme="light"></div>${nav(1,null,1)}</fieldset>
<p id="st" role="status" tabindex="-1"></p></form><p class="note"><a href="${regUrl()}">${r.int}</a></p></div>
<aside class="sum"><h2>${r.sum}</h2><h3 id="sumCourse">${esc(c[L][0])}</h3><div id="sumFacts">${factsHtml(c,["fee","dl","start","days","time","del","cert"])}</div></aside></div>`)}

const MEAL_PROGRAMME={
  "sections": [
    [
      "Your programme lead",
      "আপনার প্রোগ্রাম লিড",
      [
        [
          "Nayeem Sarker · Programme Lead & Instructor",
          "নাইম সরকার · প্রোগ্রাম লিড ও প্রশিক্ষক"
        ],
        [
          "Nayeem holds bachelor’s and master’s degrees in Statistics from Shahjalal University of Science and Technology. He previously worked as Information Management Specialist, Information Management Manager and Senior Officer–Information Management with CODEC’s UNHCR-funded EPRC project.",
          "নাইম সরকার শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় থেকে পরিসংখ্যানে স্নাতক ও স্নাতকোত্তর সম্পন্ন করেছেন। CODEC-এর UNHCR-funded EPRC প্রকল্পে Information Management Specialist, Information Management Manager এবং Senior Officer–Information Management হিসেবে তাঁর কাজের অভিজ্ঞতা রয়েছে।"
        ],
        [
          "His experience includes humanitarian information management, data quality assurance, indicator monitoring, Excel and Power BI dashboards, reporting and staff training. He leads programme delivery and assessment oversight and teaches indicator trackers, performance trackers and Excel dashboards and reporting.",
          "তাঁর অভিজ্ঞতার মধ্যে রয়েছে মানবিক সহায়তা কার্যক্রমের তথ্য ব্যবস্থাপনা, ডেটার মান যাচাই, ইন্ডিকেটর পর্যবেক্ষণ, Excel ও Power BI dashboard, reporting এবং কর্মীদের প্রশিক্ষণ। তিনি প্রোগ্রাম পরিচালনা ও মূল্যায়ন তত্ত্বাবধানের পাশাপাশি indicator tracker, performance tracker এবং Excel dashboard ও reporting শেখাবেন।"
        ],
        [
          "Aspiring PhD Researcher in Humanitarian Data Science. This describes a research goal, not current doctoral enrolment or an awarded qualification.",
          "Humanitarian Data Science-এ PhD গবেষণায় আগ্রহী (Aspiring PhD Researcher)। এটি গবেষণার লক্ষ্য; বর্তমানে PhD-তে ভর্তি বা অর্জিত ডিগ্রির পরিচয় নয়।"
        ],
        [
          "Additional instructors or teaching assistants may join according to cohort size and support needs. Profiles and session responsibilities will be published once confirmed. Previous employment does not imply institutional endorsement of SCOPE.",
          "শিক্ষার্থীর সংখ্যা ও সহায়তার প্রয়োজন অনুযায়ী অতিরিক্ত প্রশিক্ষক বা teaching assistant যুক্ত হতে পারেন। নিশ্চিত হলে তাঁদের পরিচয় ও session-এর দায়িত্ব জানানো হবে। পূর্ববর্তী কর্ম-অভিজ্ঞতা SCOPE-এর প্রতি সংশ্লিষ্ট প্রতিষ্ঠানের অনুমোদন বোঝায় না।"
        ]
      ]
    ],
    [
      "What you will be able to do",
      "কোর্স শেষে যা করতে পারবেন",
      [
        [
          "Define indicators, baselines, targets and disaggregation; build a structured monitoring workbook.",
          "ইন্ডিকেটর, baseline, target ও disaggregation নির্ধারণ করে monitoring workbook তৈরি।"
        ],
        [
          "Compare planned and actual results, check data quality and document follow-up actions.",
          "পরিকল্পনা ও অর্জিত ফল তুলনা, ডেটার মান যাচাই এবং follow-up action নথিবদ্ধ করা।"
        ],
        [
          "Build and refresh an Excel dashboard, explain findings and prepare a reporting pack.",
          "Excel dashboard তৈরি ও refresh, ফলাফলের ব্যাখ্যা এবং reporting pack প্রস্তুত করা।"
        ],
        [
          "Practice field-assessment planning through online scenarios and simulated data. No field visit is included.",
          "অনলাইন scenario ও simulated data দিয়ে field assessment planning অনুশীলন। মাঠপর্যায়ের ভ্রমণ অন্তর্ভুক্ত নয়।"
        ]
      ]
    ],
    [
      "Assessment and certification",
      "মূল্যায়ন ও সনদ",
      [
        [
          "Each project: submission 50 marks, individual practical task 30 marks, presentation/viva 20 marks. Each project must independently score at least 60/100. A high overall average cannot compensate for a failed project.",
          "প্রতি প্রজেক্টে: জমা দেওয়া কাজ ৫০, individual practical task ৩০ এবং presentation/viva ২০ নম্বর। প্রতিটি প্রজেক্টে আলাদাভাবে অন্তত ৬০/১০০ পেতে হবে। অন্য প্রজেক্টের বেশি নম্বর দিয়ে ফেল করা প্রজেক্টের শর্ত পূরণ হবে না।"
        ],
        [
          "Incomplete submissions remain Incomplete until assessed. Project briefs specify deadlines, permitted collaboration and AI use; learners must explain their own work.",
          "অসম্পূর্ণ কাজ মূল্যায়ন না হওয়া পর্যন্ত Incomplete থাকবে। Project brief-এ সময়সীমা, সহযোগিতা ও AI ব্যবহারের নিয়ম থাকবে; শিক্ষার্থীকে নিজের কাজ ব্যাখ্যা করতে হবে।"
        ],
        [
          "Overall grade point = (Indicator GP × 2 + Performance GP × 2 + Dashboard GP × 4) ÷ 8. Certificate eligibility requires a pass in all three projects.",
          "সামগ্রিক grade point = (Indicator GP × ২ + Performance GP × ২ + Dashboard GP × ৪) ÷ ৮। সনদের জন্য তিনটি প্রজেক্টেই পাস করতে হবে।"
        ],
        [
          "A SCOPE Certificate of Achievement records the learner’s name, course, batch, dates, final grade point, eight internal assessment credits, certificate ID and issue date. An accompanying assessment record lists project results.",
          "SCOPE Certificate of Achievement-এ নাম, কোর্স, batch, সময়কাল, final grade point, আটটি internal assessment credit, certificate ID ও issue date থাকবে। সঙ্গে project-wise ফলাফলের assessment record থাকবে।"
        ]
      ]
    ],
    [
      "Retake opportunities",
      "রিটেকের সুযোগ",
      [
        [
          "First retake: 15 days after the final assessment, free of charge. Second retake: a further 15 days after the first retake, BDT 100 for Bangladesh learners or USD 10 for international learners.",
          "প্রথম রিটেক: final assessment-এর ১৫ দিন পরে, বিনা ফিতে। দ্বিতীয় রিটেক: প্রথম রিটেকের আরও ১৫ দিন পরে; বাংলাদেশি শিক্ষার্থীর জন্য ১০০ টাকা, আন্তর্জাতিক শিক্ষার্থীর জন্য US$10।"
        ],
        [
          "Only unsuccessful projects require reassessment. The second-retake fee covers one assessment round, not each failed project. The pass mark remains 60%. Feedback and confirmed dates will be provided; dates may be adjusted if results are delayed to preserve preparation time.",
          "শুধু পাস না করা প্রজেক্টে পুনর্মূল্যায়ন হবে। দ্বিতীয় রিটেকের ফি একটি assessment round-এর জন্য, প্রতি প্রজেক্টের জন্য আলাদা নয়। পাস নম্বর ৬০%। Feedback ও নির্দিষ্ট তারিখ জানানো হবে; ফলাফল প্রকাশে দেরি হলে প্রস্তুতির সময় বজায় রেখে তারিখ সমন্বয় হবে।"
        ],
        [
          "The latest reassessment result becomes the final result for that project; attempt history is retained. Learners who do not meet the requirements after the second retake do not receive the achievement certificate. No third retake is currently offered.",
          "পুনর্মূল্যায়নের সর্বশেষ ফল সংশ্লিষ্ট প্রজেক্টের final result হবে; attempt history সংরক্ষিত থাকবে। দ্বিতীয় রিটেকের পরও শর্ত পূরণ না হলে achievement certificate দেওয়া হবে না। বর্তমানে তৃতীয় রিটেকের সুযোগ নেই।"
        ]
      ]
    ],
    [
      "What the certificate means",
      "সনদের অর্থ ও যাচাই",
      [
        [
          "SCOPE is an independent professional-training platform with no external affiliation or accreditation. This certificate records achievement in SCOPE’s assessments; it is not a university degree, diploma or professional licence. Recognition by an employer or institution is their decision.",
          "SCOPE একটি স্বাধীন পেশাগত প্রশিক্ষণ প্ল্যাটফর্ম; বাহ্যিক affiliation বা accreditation নেই। এই সনদ SCOPE-এর মূল্যায়নে অর্জিত ফল নথিভুক্ত করে; এটি বিশ্ববিদ্যালয়ের degree, diploma বা professional licence নয়। গ্রহণযোগ্যতা সংশ্লিষ্ট নিয়োগকারী বা প্রতিষ্ঠানের সিদ্ধান্ত।"
        ],
        [
          "Online certificate verification is planned and is not yet available. Once launched, a certificate ID or QR will identify an issued record and its status. Public result details will follow learner consent; contact and payment information will not be public. Until then, contact SCOPE for certificate enquiries.",
          "অনলাইন certificate verification পরিকল্পিত; এখনো চালু হয়নি। চালু হলে certificate ID বা QR দিয়ে ইস্যু করা সনদ ও তার অবস্থা দেখা যাবে। শিক্ষার্থীর সম্মতি অনুযায়ী ফলাফলের তথ্য প্রকাশ হবে; যোগাযোগ ও পেমেন্টের তথ্য প্রকাশ হবে না। আপাতত সনদ-সংক্রান্ত প্রশ্নে SCOPE-এর সঙ্গে যোগাযোগ করুন।"
        ]
      ]
    ],
    [
      "Before you enrol",
      "ভর্তির আগে জেনে নিন",
      [
        [
          "Use a laptop or desktop with a suitable version of Microsoft Excel and reliable internet. This course teaches Excel dashboards; Power BI is not a separate module. Software licences are not included. Confirm software compatibility with SCOPE before paying.",
          "উপযোগী Microsoft Excel-সহ laptop/desktop ও নির্ভরযোগ্য internet প্রয়োজন। এই কোর্সে Excel dashboard শেখানো হবে; Power BI আলাদা module নয়। Software licence অন্তর্ভুক্ত নয়। পেমেন্টের আগে SCOPE-এর সঙ্গে software compatibility নিশ্চিত করুন।"
        ],
        [
          "Bangladesh delivery is in Bangla. International delivery follows the separately confirmed English-language batch and timetable. An English website does not by itself confirm an international batch. Recordings and a sample video are not currently promised.",
          "বাংলাদেশি batch-এর ভাষা বাংলা ও ইংরেজি। আন্তর্জাতিক batch-এর ভাষা শুধু ইংরেজি। আপাতত recording বা sample video-এর প্রতিশ্রুতি দেওয়া হচ্ছে না।"
        ]
      ]
    ]
  ],
  "weeks": [
    [
      "MEAL foundations, results chains, Theory of Change and logframes",
      "MEAL-এর ভিত্তি, results chain, Theory of Change ও logframe"
    ],
    [
      "SMART indicators, reference sheets, baselines, targets and collection plans",
      "SMART indicator, reference sheet, baseline, target ও collection plan"
    ],
    [
      "Excel structure, validation and Project 1: Indicator Monitoring Tracker",
      "Excel structure, validation ও Project 1: Indicator Monitoring Tracker"
    ],
    [
      "Monitoring plans, field-assessment scenarios, sampling basics and tools",
      "Monitoring plan, field assessment scenario, sampling-এর ভিত্তি ও tools"
    ],
    [
      "Data quality, consent, safe handling, feedback and accountability",
      "ডেটার মান, consent, নিরাপদ তথ্য ব্যবস্থাপনা, feedback ও accountability"
    ],
    [
      "Variance, follow-up, learning and Project 2: Performance Monitoring Tracker",
      "Variance, follow-up, learning ও Project 2: Performance Monitoring Tracker"
    ],
    [
      "Excel cleaning, structured tables and essential formulas",
      "Excel cleaning, structured table ও প্রয়োজনীয় formula"
    ],
    [
      "PivotTables, KPIs, disaggregation and reconciliation",
      "PivotTable, KPI, disaggregation ও reconciliation"
    ],
    [
      "Chart choice, dashboard layout and accessible presentation",
      "Chart নির্বাচন, dashboard layout ও accessible presentation"
    ],
    [
      "Refresh workflows, filters, error checks and dashboard testing",
      "Refresh workflow, filter, error check ও dashboard testing"
    ],
    [
      "Reporting packs, interpretation, limitations and recommendations",
      "Reporting pack, ফলাফলের ব্যাখ্যা, সীমাবদ্ধতা ও recommendations"
    ],
    [
      "Project 3: Excel Dashboard & Donor Reporting; final practical and viva",
      "Project 3: Excel Dashboard & Donor Reporting; final practical ও viva"
    ]
  ],
  "refund": [
    [
      "MEAL course and retake fees are not refundable if a learner chooses not to attend, withdraws, does not complete the course, or fails an assessment. Payment does not guarantee a certificate.",
      "শিক্ষার্থী নিজে কোর্স না করলে, ছেড়ে দিলে, অসম্পূর্ণ রাখলে বা মূল্যায়নে ফেল করলে MEAL course ও retake fee ফেরত দেওয়া হবে না। পেমেন্ট সনদ পাওয়ার নিশ্চয়তা নয়।"
    ],
    [
      "This learner-withdrawal policy does not determine the remedy if SCOPE cancels the programme or cannot deliver it. Contact SCOPE before payment for those arrangements. Any applicable statutory rights remain unaffected.",
      "এই শিক্ষার্থী-প্রত্যাহার নীতি SCOPE নিজে প্রোগ্রাম বাতিল করলে বা পরিচালনা করতে না পারলে কী ব্যবস্থা হবে তা নির্ধারণ করে না। পেমেন্টের আগে সে বিষয়ে SCOPE-এর সঙ্গে যোগাযোগ করুন। প্রযোজ্য আইনগত অধিকার অপরিবর্তিত থাকবে।"
    ]
  ]
};

const mpPick=x=>x[L==="bn"?1:0];
const mpEmphasis=text=>{
const bold=[];let out=esc(text).replace(/&lt;strong&gt;([\s\S]*?)&lt;\/strong&gt;/g,(_,value)=>{const token=`MEALBOLDTOKEN${bold.length}END`;bold.push(value);return token});
const tokens=L==="bn"?["US\\$10","১৫ দিন","১০০ টাকা","৬০%","বিনা ফিতে","ফেরত দেওয়া হবে না","বাহ্যিক affiliation বা accreditation নেই","বিশ্ববিদ্যালয়ের degree","এখনো চালু হয়নি","আলাদা module নয়","লাইসেন্স অন্তর্ভুক্ত নয়","নিশ্চয়তা নয়","বাংলায়","ইংরেজি batch","মাঠপর্যায়ের ভ্রমণ অন্তর্ভুক্ত নয়"]:["SCOPE Certificate of Achievement","15 days","BDT 100","USD 10","60%","50 marks","30 marks","20 marks","free of charge","not refundable","no external affiliation or accreditation","not a university degree","not currently available","not a separate module","licences are not included","does not guarantee","Bangla","English-language batch","No field visit"];
const re=new RegExp(`(${tokens.map(x=>`${L==="en"&&/^[A-Za-z0-9]/.test(x)?"(?<![A-Za-z0-9])":""}${x.replace(/[.*+?^${}()|[\\]\\]/g,"\\$&")}${L==="en"&&/[A-Za-z0-9]$/.test(x)?"(?![A-Za-z0-9])":""}`).join("|")})`,L==="bn"?"g":"gi");
out=out.replace(re,'<strong class="meal-emphasis">$1</strong>');
return out.replace(/MEALBOLDTOKEN(\d+)END/g,(_,index)=>`<strong class="meal-emphasis">${bold[Number(index)]}</strong>`)
};
const mpParagraphs=xs=>xs.map(x=>`<p>${mpEmphasis(mpPick(x))}</p>`).join("");
function mealPolicy(){return `<div class="meal-policy">${mpParagraphs(MEAL_PROGRAMME.refund)}</div>`}
function mealGuideCards(items,trusted=false){return `<div class="meal-guide-grid">${items.map((x,i)=>`<article class="meal-guide-card glass-tile"><span class="meal-guide-number">${String(i+1).padStart(2,"0")}</span><div>${x[0]?`<h3>${x[0]}</h3>`:""}<p>${trusted?x[1]:mpEmphasis(x[1])}</p></div></article>`).join("")}</div>`}
function programmeSection(index){const s=MEAL_PROGRAMME.sections[index],bn=L==="bn",title=s[bn?1:0];let cards;
if(index===2)cards=bn?[
["প্রজেক্টের নম্বর ও পাসের শর্ত","প্রতিটি প্রজেক্টে মোট <strong>১০০</strong> নম্বর: জমা কাজ <strong>৫০</strong> + individual practical task <strong>৩০</strong> + presentation/viva <strong>২০</strong>। তিনটি project-এর <strong>প্রতিটিতে আলাদাভাবে অন্তত ৬০/১০০</strong> পেতে হবে; অন্য project-এর বেশি নম্বর দিয়ে ফেল করা project-এর ঘাটতি পূরণ হবে না।"],
["সামগ্রিক grade point","Indicator GP × <strong>২</strong> + Performance GP × <strong>২</strong> + Dashboard GP × <strong>৪</strong>; মোট ওজন <strong>৮</strong> দিয়ে ভাগ হবে।"],
["সনদে যা থাকবে","SCOPE Certificate of Achievement-এ নাম, course, batch, সময়কাল, final grade point, <strong>৮টি internal assessment credit</strong>, certificate ID ও issue date থাকবে। Project-wise ফল আলাদা assessment record-এ থাকবে।"],
["কাজের স্বচ্ছতা","অসম্পূর্ণ submission মূল্যায়ন না হওয়া পর্যন্ত Incomplete থাকবে। Project brief-এ deadline, collaboration ও AI ব্যবহারের নিয়ম থাকবে; শিক্ষার্থীকে নিজের কাজ ব্যাখ্যা করতে হবে।"]
]:[
["Project scoring and pass standard","Each project is assessed out of <strong>100</strong>: submission <strong>50</strong> + individual practical task <strong>30</strong> + presentation/viva <strong>20</strong>. Learners must score <strong>at least 60/100 in each project</strong>; a higher score in another project cannot offset a failed project."],
["Overall grade point","Indicator GP × <strong>2</strong> + Performance GP × <strong>2</strong> + Dashboard GP × <strong>4</strong>, divided by a total weight of <strong>8</strong>."],
["What the certificate records","The SCOPE Certificate of Achievement lists the learner’s name, course, batch, dates, final grade point, <strong>8 internal assessment credits</strong>, certificate ID and issue date. Project results appear in an accompanying assessment record."],
["Work and assessment rules","Incomplete submissions remain Incomplete until assessed. Project briefs set deadlines, collaboration and AI-use rules; learners must explain their own work."]
];
else if(index===3)cards=bn?[
["প্রথম রিটেক · বিনা ফিতে","Final assessment-এর <strong>১৫ দিন পরে</strong> প্রথম রিটেক দেওয়া যাবে।"],
["দ্বিতীয় রিটেক · ফি প্রযোজ্য","প্রথম রিটেকের আরও <strong>১৫ দিন পরে</strong> দ্বিতীয় রিটেক। বাংলাদেশি শিক্ষার্থীর জন্য <strong>১০০ টাকা</strong>, আন্তর্জাতিক শিক্ষার্থীর জন্য <strong>US$10</strong>।"],
["কোন কাজ আবার হবে","শুধু পাস না করা project-এর পুনর্মূল্যায়ন হবে। দ্বিতীয় রিটেকের ফি একটি assessment round-এর জন্য—প্রতি project-এর জন্য আলাদা নয়। <strong>পাস নম্বর ৬০%</strong>।"],
["ফল ও প্রচেষ্টা","Feedback ও তারিখ জানানো হবে। সর্বশেষ reassessment result-ই ওই project-এর final result; attempt history রাখা হবে। দ্বিতীয় রিটেকেও শর্ত পূরণ না হলে সনদ হবে না। <strong>তৃতীয় রিটেক নেই</strong>।"]
]:[
["First retake · free","The first retake is available <strong>15 days after the final assessment</strong>, at no charge."],
["Second retake · fee applies","The second retake is available <strong>a further 15 days later</strong>: <strong>BDT 100</strong> for Bangladesh learners or <strong>USD 10</strong> for international learners."],
["What is reassessed","Only unsuccessful projects are reassessed. The second-retake fee covers one assessment round, not each failed project. The pass mark remains <strong>60%</strong>."],
["Results and attempts","Feedback and dates will be provided. The latest reassessment result is final for that project, and attempt history is retained. No certificate follows a second unsuccessful retake. <strong>No third retake is offered</strong>."]
];
else if(index===4)cards=bn?[
["সনদ কী নিশ্চিত করে","এটি SCOPE-এর assessment-এ অর্জিত ফল নথিভুক্ত করে। এটি <strong>বিশ্ববিদ্যালয়ের degree, diploma বা professional licence নয়</strong>; কোনো নিয়োগকারী বা প্রতিষ্ঠানের স্বীকৃতি তাদের নিজস্ব সিদ্ধান্ত।"],
["স্বীকৃতি ও affiliation","SCOPE একটি স্বাধীন professional-training platform; এর <strong>বাহ্যিক affiliation বা accreditation নেই</strong>।"],
["Online verification","Certificate ID বা QR-ভিত্তিক যাচাই <strong>পরিকল্পিত, এখনো চালু হয়নি</strong>। চালু হলে learner consent অনুযায়ী ফল দেখা যাবে; যোগাযোগ ও payment তথ্য public হবে না। আপাতত সনদ যাচাইয়ে SCOPE-এর সঙ্গে যোগাযোগ করুন।"]
]:[
["What the certificate confirms","It records achievement in SCOPE assessments. It is <strong>not a university degree, diploma or professional licence</strong>; recognition by an employer or institution is their decision."],
["Recognition and affiliation","SCOPE is an independent professional-training platform with <strong>no external affiliation or accreditation</strong>."],
["Online verification","Certificate ID or QR verification is <strong>planned and not currently available</strong>. When launched, public results will follow learner consent; contact and payment information will remain private. Contact SCOPE for enquiries until then."]
];
else if(index===5)cards=bn?[
["যা লাগবে","ক্লাস ও কাজের জন্য laptop/desktop-এ উপযোগী Microsoft Excel এবং নির্ভরযোগ্য internet প্রয়োজন।"],
["Software ও tools","কোর্সে Excel dashboard শেখানো হবে; <strong>Power BI আলাদা module নয়</strong>। Software licence অন্তর্ভুক্ত নয়। পেমেন্টের আগে compatibility নিশ্চিত করুন।"],
["ভাষা ও আন্তর্জাতিক batch","বাংলাদেশি batch-এর ভাষা বাংলা ও ইংরেজি। আন্তর্জাতিক batch-এর ভাষা শুধু ইংরেজি।"],
["Recording ও sample","এ মুহূর্তে class recording বা sample video-এর প্রতিশ্রুতি দেওয়া হচ্ছে না।"]
]:[
["What you need","Use a laptop or desktop with a suitable version of Microsoft Excel and reliable internet."],
["Software and tools","The course teaches Excel dashboards; <strong>Power BI is not a separate module</strong>. Software licences are not included. Confirm compatibility before paying."],
["Language and international batch","Bangladesh batch: Bangla and English. International batch: English only."],
["Recordings and sample","Class recordings and a sample video are not currently promised."]
];
else if(index===0)cards=bn?[
["শিক্ষাগত পটভূমি ও একাডেমিক কোর্সওয়ার্ক","<strong>নাইম সরকার · Programme Lead & Instructor.</strong> শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়, সিলেট, বাংলাদেশ থেকে পরিসংখ্যানে স্নাতক ও স্নাতকোত্তর; Computer Science & Engineering-এ postgraduate coursework করেছেন। Coursework-এর মধ্যে statistical inference, time series, biostatistics, econometrics, data mining, NLP, machine learning, Deep Learning এবং Statistical Research (qualitative ও quantitative methods) রয়েছে। <span class=\"lead-aspiration\">Aspiring PhD Researcher in Humanitarian Data Science</span>"],
["অভিজ্ঞতা ও প্রযুক্তিগত দক্ষতা","CODEC-এর UNHCR-funded EPRC প্রকল্পে Information Management Specialist, Manager ও Senior Officer—IM (২০২৪–২৬); SRAC-এ IM Officer (২০২০–২২); Leading University-তে Research Intern (২০২২–২৪)। ২৬টি ক্যাম্পে কাজের অভিজ্ঞতা। <span class=\"lead-skills\" aria-label=\"Technical skills\"><strong class=\"lead-skill\">Excel</strong> <strong class=\"lead-skill\">Power BI / DAX</strong> <strong class=\"lead-skill\">SQL / MySQL</strong> <strong class=\"lead-skill\">Python</strong> <strong class=\"lead-skill\">R</strong> <strong class=\"lead-skill\">SPSS</strong> <strong class=\"lead-skill\">STATA</strong> <strong class=\"lead-skill\">SAS</strong> <strong class=\"lead-skill\">ArcGIS / QGIS</strong> <strong class=\"lead-skill\">KoboToolbox / XLSForms</strong> <strong class=\"lead-skill\">CPIMS+</strong> <strong class=\"lead-skill\">ActivityInfo</strong> <strong class=\"lead-skill\">5W Reporting</strong></span> Indicator/performance tracker, dashboard, digital form, reporting workflow ও web-based information system তৈরি/পরিচালনা; programme delivery, assessment oversight ও staff training-ও করেন।"]
]:[
["Education & Academic Coursework","<strong>Nayeem Sarker · Programme Lead & Instructor.</strong> B.Sc. and M.Sc. in Statistics from Shahjalal University of Science and Technology, Sylhet, Bangladesh; postgraduate coursework in Computer Science & Engineering. Coursework includes statistical inference, time series, biostatistics, econometrics, data mining, NLP, machine learning, Deep Learning, and Statistical Research including qualitative and quantitative methods. <span class=\"lead-aspiration\">Aspiring PhD Researcher in Humanitarian Data Science</span>"],
["Experience & Technical Skills","Information Management Specialist, Manager and Senior Officer—IM with CODEC’s UNHCR-funded EPRC project (2024–26); IM Officer at SRAC (2020–22); Research Intern at Leading University (2022–24). Experience supporting work across 26 camps. <span class=\"lead-skills\" aria-label=\"Technical skills\"><strong class=\"lead-skill\">Excel</strong> <strong class=\"lead-skill\">Power BI / DAX</strong> <strong class=\"lead-skill\">SQL / MySQL</strong> <strong class=\"lead-skill\">Python</strong> <strong class=\"lead-skill\">R</strong> <strong class=\"lead-skill\">SPSS</strong> <strong class=\"lead-skill\">STATA</strong> <strong class=\"lead-skill\">SAS</strong> <strong class=\"lead-skill\">ArcGIS / QGIS</strong> <strong class=\"lead-skill\">KoboToolbox / XLSForms</strong> <strong class=\"lead-skill\">CPIMS+</strong> <strong class=\"lead-skill\">ActivityInfo</strong> <strong class=\"lead-skill\">5W Reporting</strong></span> Builds indicator/performance trackers, dashboards, digital forms, reporting workflows and web-based information systems; also supports programme delivery, assessment oversight and staff training."]
];
else cards=s[2].map(x=>["",mpPick(x)]);
if(index===0)cards=cards.map((card,i)=>[`<span class="lead-card-icon" aria-hidden="true">${i===0?"▱":"⌘"}</span> ${card[0]}`,card[1]]);
const body=(index===0?'<div class="lead-profile-cards">':"")+mealGuideCards(cards,index===0)+(index===0?"</div>":"")+(index===0?`<p class="meal-profile-link"><a href="https://nayeememolin.github.io/Nayeem-Sarker.Professional_Portfolio/" target="_blank" rel="noopener noreferrer">${bn?"পেশাগত পরিচয় ও কাজ দেখুন":"View professional portfolio"} ↗</a></p>`:"");
return sec("light meal-guides",title,body)}
function mealVisualJourney(bn){
const projects=[["Indicator Monitoring Tracker","ইন্ডিকেটর মনিটরিং ট্র্যাকার","Indicators · Baselines · Targets","সপ্তাহ ১–৩","WEEKS 1–3",9,13.5],["Performance Monitoring Tracker","পারফরম্যান্স মনিটরিং ট্র্যাকার","Plan · Actual · Follow-up","সপ্তাহ ৪–৬","WEEKS 4–6",9,13.5],["Excel Dashboard & Donor Reporting","Excel ড্যাশবোর্ড ও ডোনার রিপোর্টিং","Dashboard · Insights · Reporting","সপ্তাহ ৭–১২","WEEKS 7–12",18,27]];
return `<section class="sec light meal-overview"><div class="meal-metrics">${[["3","৩",bn?"মাস":"Months"],["36","৩৬",bn?"লাইভ ক্লাস":"Live classes"],["54","৫৪",bn?"লাইভ ঘণ্টা":"Live hours"],["3","৩",bn?"মূল্যায়িত প্রজেক্ট":"Assessed projects"]].map(x=>`<article class="glass-tile meal-metric"><strong>${x[bn?1:0]}</strong><span>${x[2]}</span></article>`).join("")}</div><h2>${bn?"আপনি যা তৈরি করবেন":"What you will build"}</h2><div class="meal-project-grid">${projects.map((p,i)=>`<article class="glass-tile meal-project"><span>PROJECT 0${i+1}</span><h3>${p[bn?1:0]}</h3><p>${p[2]}</p><small>${p[bn?3:4]}</small></article>`).join("")}</div></section>
<section class="sec dark meal-road-section"><h2>${bn?"শেখা থেকে বাস্তব কাজ—আপনার যাত্রা":"From learning to practical achievement"}</h2><div class="meal-road"><svg viewBox="0 0 1000 210" role="img" aria-label="MEAL learning roadmap"><path id="meal-learning-path" class="road-path" pathLength="1" d="M35 178 C170 178 145 143 265 143 S365 110 475 110 S575 74 690 74 S815 34 965 34"/>${[[35,178],[265,143],[475,110],[690,74],[965,34]].map(p=>`<circle class="road-dot${p[0]===965?" road-finish":""}" cx="${p[0]}" cy="${p[1]}" r="${p[0]===965?13:8}"/>`).join("")}<circle class="road-progress meal-traveller" r="7"><animateMotion dur="12s" repeatCount="indefinite"><mpath href="#meal-learning-path"/></animateMotion></circle></svg><ol class="road-labels">${(bn?["ভিত্তি","ইন্ডিকেটর ট্র্যাকার","পারফরম্যান্স ট্র্যাকার","ড্যাশবোর্ড ও রিপোর্ট","মূল্যায়ন ও অর্জন"]:["Foundations","Indicator tracker","Performance tracker","Dashboard & reporting","Assessment & achievement"]).map((x,i)=>`<li><small>${(bn?["সপ্তাহ ১","সপ্তাহ ১–৩","সপ্তাহ ৪–৬","সপ্তাহ ৭–১২","সপ্তাহ ১২"]:["WEEK 1","WEEKS 1–3","WEEKS 4–6","WEEKS 7–12","WEEK 12"])[i]}</small><b>${x}</b>${i===4?`<span class="achievement-badge">✦ ${bn?"Portfolio প্রস্তুত":"PORTFOLIO READY"}</span>`:""}</li>`).join("")}</ol></div></section>
<section class="sec light mis-workflow"><h2>${bn?"৩৬টি ক্লাসের প্রজেক্ট পরিকল্পনা":"Your 36-class project plan"}</h2><div class="meal-allocation glass-tile">${projects.map((p,i)=>`<div class="meal-allocation-row"><span>0${i+1} · ${p[bn?1:0]}</span><div class="meal-allocation-track"><i style="--allocation:${p[5]/36*100}%"></i></div><b>${p[5]} ${bn?"ক্লাস":"classes"} · ${p[6]} ${bn?"ঘণ্টা":"hours"}</b></div>`).join("")}<p>${bn?"মোট ৫৪ লাইভ ঘণ্টা · প্রতি ক্লাস ৯০ মিনিট":"54 live hours total · 90 minutes per class"}</p></div><article class="glass-tile mis-flow-card"><h3>${bn?"MEAL workflow":"The MEAL workflow"}</h3><ol>${(bn?["ইন্ডিকেটর","ডেটা সংগ্রহ","মান যাচাই","বিশ্লেষণ","রিপোর্ট ও শিখন"]:["Define indicators","Collect data","Check quality","Analyze","Report & learn"]).map((x,i)=>`<li><span>0${i+1}</span><b>${x}</b></li>`).join("")}</ol></article></section>`;
}
function mealPage(t,c){const bn=L==="bn",pick=mpPick;
const table=(heads,rows)=>`<div class="programme-table" tabindex="0" role="region" aria-label="${esc(heads[0])}"><table><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>i?`<td>${v}</td>`:`<th scope="row">${v}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const projects=[["Indicator Monitoring Tracker","3 / 9","13.5","2"],["Performance Monitoring Tracker","3 / 9","13.5","2"],["Excel Dashboard & Donor Reporting","6 / 18","27","4"],[bn?"মোট":"Total","12 / 36","54","8"]];
const grade=[["80–100","A+","4.00"],["75–<80","A","3.75"],["70–<75","A−","3.50"],["65–<70","B+","3.25"],["60–<65","B","3.00"],["0–<60","F","0.00"]];
const glanceRows=bn?[
["ফি",["বাংলাদেশি শিক্ষার্থী ব্যাচ: <strong>BDT 650</strong>","আন্তর্জাতিক শিক্ষার্থী ব্যাচ: <strong>USD 80</strong>"]],
["নিবন্ধন ও ক্লাস শুরু",["<strong class=\"meal-deadline\">নিবন্ধনের শেষ তারিখ: ২৫ নভেম্বর ২০২৬</strong>","ক্লাস শুরু: ৫ ডিসেম্বর ২০২৬"]],
["ক্লাসের দিন",["বুধবার, শুক্রবার, শনিবার"]],
["সময়",["বাংলাদেশ সময় (UTC+6): রাত ১০:০০–১১:৩০","EST (UTC−5): সকাল ১১:০০–দুপুর ১২:৩০","আস্তানা সময় (UTC+5): রাত ৯:০০–১০:৩০"]],
["ডেলিভারি via",["SCOPE Custom Platform · Zoom · Google Meet · Google Classroom","এই প্ল্যাটফর্মগুলোর মাধ্যমে ক্লাস, মূল্যায়ন ও প্রোগ্রামের কার্যক্রম পরিচালিত হবে।"]],
["ভাষা",["বাংলাদেশি ব্যাচ: বাংলা ও ইংরেজি","আন্তর্জাতিক ব্যাচ: শুধু ইংরেজি"]]
]:[
["Fee",["Bangladeshi learners batch: <strong>BDT 650</strong>","International learners batch: <strong>USD 80</strong>"]],
["Registration & class start",["<strong class=\"meal-deadline\">Registration deadline: 25 November 2026</strong>","Classes start: 5 December 2026"]],
["Class days",["Wednesday, Friday, Saturday"]],
["Time",["Bangladesh time (UTC+6): 10:00 PM–11:30 PM","EST (UTC−5): 11:00 AM–12:30 PM","Astana time (UTC+5): 9:00 PM–10:30 PM"]],
["Delivery via",["SCOPE Custom Platform · Zoom · Google Meet · Google Classroom","Classes, assessments and programme activities are delivered via these platforms."]],
["Language",["Bangladesh batch: Bangla and English","International batch: English only"]]
];
const glance=`<dl class="facts meal-facts">${glanceRows.map(([label,lines])=>`<div class="glass-tile meal-fact-card"><dt>${label}</dt><dd>${lines.map(line=>`<span>${line}</span>`).join("<br>")}</dd></div>`).join("")}</dl>`;
return `<section class="phero meal-cover meal-motion-cover" style="--h:${c.hue}"><span class="meal-kicker">3 MONTHS · PRACTICAL MEAL</span><h1>${esc(c[L][0])}</h1><p>${bn?"৩ মাস · ১২ সপ্তাহ · ৩৬টি লাইভ ক্লাস · ৩টি মূল্যায়িত প্রজেক্ট":"3 months · 12 teaching weeks · 36 live classes · 3 assessed projects"}</p><div class="meal-cover-actions">${cta("",c)}<span>Indicators · Monitoring · Excel · Reporting</span></div><div class="mis-tools"><span>MEAL</span><span>Excel</span><span>Donor Reporting</span></div></section>`+
sec("light",bn?"কোর্সের তথ্য":"Course at a glance",glance+`<p>${cta("",c)} <a class="btn ghost-d" href="${S.fb}" target="_blank" rel="noopener noreferrer">${bn?"কোর্স সম্পর্কে প্রশ্ন করুন":"Ask about the course"}</a></p>`)+mealVisualJourney(bn)+programmeSection(0)+programmeSection(1)+
sec("light",bn?"প্রজেক্ট, সময় ও ক্রেডিট":"Projects, time and credits",table(bn?["প্রজেক্ট","সপ্তাহ / ক্লাস","লাইভ ঘণ্টা","Internal credits"]:["Project","Weeks / classes","Live hours","Internal credits"],projects)+`<p>${bn?"প্রতি ক্লাস ৯০ মিনিট; সপ্তাহে ৪.৫ ঘণ্টা। প্রতি চার সপ্তাহে ১৮ ঘণ্টা। ১ internal credit = ৬.৭৫ নির্ধারিত লাইভ ঘণ্টা; বাসায় অনুশীলনের সময় আলাদা। এই ক্রেডিট SCOPE-এর নিজস্ব মূল্যায়নের ওজন—বিশ্ববিদ্যালয়ের academic বা transferable credit নয়।":"Each class is 90 minutes: 4.5 hours weekly, or 18 hours per four teaching weeks. One internal credit represents 6.75 scheduled live hours; independent practice is additional. Credits are SCOPE’s internal assessment weights, not university academic or transferable credits."}</p>`)+
sec("light meal-syllabus-section",bn?"১২ সপ্তাহের syllabus":"12-week syllabus",`<p class="meal-syllabus-intro">${mpEmphasis(bn?"প্রতি সপ্তাহে ৩টি ক্লাস ও ৪.৫ ঘণ্টার guided learning। প্রতিটি module-এ ধারণা, অনুশীলন এবং build/review activity থাকবে।":"Each week includes 3 live classes and 4.5 hours of guided learning, combining concepts, practice and build/review activities.")}</p><div class="syllabus-grid">${MEAL_PROGRAMME.weeks.map((w,i)=>`<details class="meal-module glass-tile"><summary><span class="module-week">${bn?"সপ্তাহ":"WEEK"} ${String(i+1).padStart(2,"0")}</span><b>${esc(pick(w))}</b><span class="module-count">${bn?"৩ ক্লাস · ৪.৫ ঘণ্টা":"3 classes · 4.5 hours"}</span></summary><p>${bn?"<strong>৩টি ক্লাস · ৪.৫ ঘণ্টা</strong>। ধারণা, guided practice ও build/review activity।":"<strong>3 classes · 4.5 hours</strong>. Concepts, guided practice and build/review activities."}</p></details>`).join("")}</div>`)+programmeSection(2)+
sec("light",bn?"Grade ও পাসের শর্ত":"Grades and pass requirement",table(bn?["নম্বর (%)","Grade","Grade point"]:["Mark (%)","Grade","Grade point"],grade)+`<p><strong>${bn?"প্রতিটি প্রজেক্টে পাস: অন্তত ৬০%। ০–৬০-এর কম নম্বরের গ্রেড F (০.০০); ৬০ থেকে পাস।":"Pass each project with at least 60%. Marks from 0 to below 60 receive F (0.00); 60 is the pass mark."}</strong></p><p>${bn?"প্রচলিত ৪.০০ scale ব্যবহার SCOPE-এর UGC অনুমোদন বোঝায় না।":"Using a conventional 4.00 scale does not imply UGC approval of SCOPE."}</p>`)+programmeSection(3)+programmeSection(4)+programmeSection(5)+
sec("light",bn?"ফি ও ফেরত নীতি":"Fees and refund policy",mealPolicy()+`<p><a href="${P("refund/index.html")}">${bn?"নীতিমালা দেখুন":"Read the policy"}</a></p><p>${cta("",c)}</p>`);
}

function publicHealthResearchPage(t,c){
const bn=L==="bn",title=bn?"৪ সপ্তাহ · ৮টি হাতে-কলমে ক্লাস":"4 WEEKS · 8 HANDS-ON CLASSES",weeks=bn?[
["সপ্তাহ ১","গবেষণা প্রশ্ন ও ডেটাসেট","Research question, literature search, diabetes dataset ও codebook বোঝা।"],
["সপ্তাহ ২","ডেটা প্রস্তুতি ও EDA","Google Colab-এ data quality, descriptive statistics ও visualization অনুশীলন।"],
["সপ্তাহ ৩","মেশিন লার্নিং মডেল","Logistic regression, decision tree ও random forest train করে performance তুলনা।"],
["সপ্তাহ ৪","ফল ব্যাখ্যা ও রিপোর্ট","Sensitivity, subgroup performance, bias ও সীমাবদ্ধতা দেখে mini research report তৈরি।"]]:[
["WEEK 1","Research question & dataset","Frame a research question, do a focused literature search, and understand the diabetes dataset and codebook."],
["WEEK 2","Data preparation & EDA","Practice data quality checks, descriptive statistics and visualisation in Google Colab."],
["WEEK 3","Machine learning models","Train logistic regression, decision tree and random forest models; compare their performance."],
["WEEK 4","Interpretation & mini report","Review sensitivity, subgroup performance, bias and limitations; prepare a short research report."]],
facts=bn?[["মেয়াদ","৪ সপ্তাহ"],["লাইভ ক্লাস","৮টি · প্রতিটি ৯০ মিনিট"],["ডেটাসেট","উন্মুক্ত CDC diabetes survey dataset"],["টুল","Google Colab · Python"],["চূড়ান্ত কাজ","Colab notebook ও mini research report"]]:[["Duration","4 weeks"],["Live classes","8 · 90 minutes each"],["Dataset","Open CDC diabetes survey dataset"],["Tools","Google Colab · Python"],["Final output","Colab notebook and mini research report"]],interest=bn?"আগ্রহ নিবন্ধন করুন":"Register your interest";
return `<section class="phero meal-cover" style="--h:${c.hue}"><span class="meal-kicker">${title}</span><h1>${esc(c[L][0])}</h1><p>${esc(c[L][1])}</p><div class="meal-cover-actions"><a class="btn" href="${interestUrl(c)}">${interest}</a><span>${bn?"Diabetes dataset · Public health · Research practice":"Diabetes dataset · Public health · Research practice"}</span></div></section>`+
`<section class="sec light mis-details"><div class="glass-tile meal-final-card"><h2>${bn?"কোর্সের সংক্ষিপ্ত তথ্য":"Course at a glance"}</h2><dl class="facts">${facts.map(x=>`<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join("")}</dl><p><a href="https://archive.ics.uci.edu/dataset/891/cdc+diabetes+health+indicators" target="_blank" rel="noopener noreferrer">${bn?"UCI diabetes dataset দেখুন ও ডাউনলোড করুন ↗":"View and download the UCI diabetes dataset ↗"}</a></p></div></section>`+
`<section class="meal-overview sec light"><h2>${bn?"৪ সপ্তাহের research journey":"Your four-week research journey"}</h2><div class="meal-project-grid">${weeks.map((w,i)=>`<article class="glass-tile meal-project"><span>${w[0]}</span><h3>${w[1]}</h3><p>${w[2]}</p></article>`).join("")}</div></section>`+
`<section class="sec dark meal-why"><h2>${bn?"কোর্স শেষে আপনার হাতে থাকবে":"Your hands-on outcome"}</h2><div class="meal-why-grid"><article class="glass-tile"><span>01</span><h3>${bn?"গবেষণা workflow":"A complete research workflow"}</h3><p>${bn?"প্রশ্ন তৈরি থেকে analysis ও interpretation পর্যন্ত প্রতিটি ধাপ অনুশীলন।":"Practice each step from framing a question to analysis and interpretation."}</p></article><article class="glass-tile"><span>02</span><h3>${bn?"নিজস্ব mini project":"A mini research project"}</h3><p>${bn?"একটি reproducible Colab notebook ও সংক্ষিপ্ত research report তৈরি করুন।":"Create a reproducible Colab notebook and a concise research report."}</p></article></div><p class="chart-note">${bn?"এটি গবেষণা অনুশীলনের কোর্স; publication বা clinical prediction-এর নিশ্চয়তা নয়।":"This is a research-practice course; publication or clinical prediction is not guaranteed."}</p><p><a class="btn" href="${interestUrl(c)}">${interest}</a></p></section>`;
}
function medicalDataSciencePage(t,c){
const bn=L==="bn",dataset="https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic",interest=bn?"আগ্রহ নিবন্ধন করুন":"Register your interest",weeks=bn?[
["সপ্তাহ ১","ডেটা ও গবেষণা প্রশ্ন","Breast Cancer Wisconsin dataset, feature ও diagnosis target বোঝা; Python/Colab শুরু।"],
["সপ্তাহ ২","ডেটা বিশ্লেষণ ও visualization","Data quality, descriptive statistics, feature distribution ও plot তৈরি।"],
["সপ্তাহ ৩","Classification model","Logistic regression, decision tree ও random forest train এবং তুলনা।"],
["সপ্তাহ ৪","Evaluation ও ব্যাখ্যা","Sensitivity, specificity, confusion matrix, feature interpretation ও সীমাবদ্ধতা।"]]:[
["WEEK 1","Dataset & question","Understand the Breast Cancer Wisconsin dataset, its features and diagnosis target; start Python in Colab."],
["WEEK 2","Data analysis & visualisation","Check data quality, calculate descriptive statistics and explore feature patterns with plots."],
["WEEK 3","Classification models","Train and compare logistic regression, decision tree and random forest."],
["WEEK 4","Evaluation & interpretation","Use sensitivity, specificity and confusion matrix; interpret features and explain limitations."]],
facts=bn?[["মেয়াদ","৪ সপ্তাহ"],["লাইভ ক্লাস","৮টি · প্রতিটি ৯০ মিনিট"],["ডেটাসেট","UCI Breast Cancer Wisconsin (Diagnostic)"],["টুল","Google Colab · Python"],["চূড়ান্ত কাজ","Notebook ও mini project report"]]:[["Duration","4 weeks"],["Live classes","8 · 90 minutes each"],["Dataset","UCI Breast Cancer Wisconsin (Diagnostic)"],["Tools","Google Colab · Python"],["Final output","Notebook and mini project report"]];
return `<section class="phero meal-cover" style="--h:${c.hue}"><span class="meal-kicker">${bn?"৪ সপ্তাহ · ৮টি hands-on live class":"4 WEEKS · 8 HANDS-ON LIVE CLASSES"}</span><h1>${esc(c[L][0])}</h1><p>${esc(c[L][1])}</p><div class="meal-cover-actions"><a class="btn" href="${interestUrl(c)}">${interest}</a><span>Medical data · Python · Machine learning</span></div></section>`+
`<section class="sec light mis-details"><div class="glass-tile meal-final-card"><h2>${bn?"কোর্সের সংক্ষিপ্ত তথ্য":"Course at a glance"}</h2><dl class="facts">${facts.map(x=>`<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join("")}</dl><p><a href="${dataset}" target="_blank" rel="noopener noreferrer">${bn?"UCI dataset দেখুন ও ডাউনলোড করুন ↗":"View and download the UCI dataset ↗"}</a></p></div></section>`+
`<section class="meal-overview sec light"><h2>${bn?"৪ সপ্তাহের hands-on plan":"Four-week hands-on plan"}</h2><div class="meal-project-grid">${weeks.map(w=>`<article class="glass-tile meal-project"><span>${w[0]}</span><h3>${w[1]}</h3><p>${w[2]}</p></article>`).join("")}</div></section>`+
`<section class="sec dark meal-why"><h2>${bn?"চূড়ান্ত project":"Final mini project"}</h2><div class="meal-why-grid"><article class="glass-tile"><span>01</span><h3>${bn?"Reproducible notebook":"Reproducible notebook"}</h3><p>${bn?"ডেটা প্রস্তুতি থেকে model evaluation পর্যন্ত Colab notebook-এ সাজানো কাজ।":"Document the work from data preparation through model evaluation in Colab."}</p></article><article class="glass-tile"><span>02</span><h3>${bn?"সংক্ষিপ্ত medical-data report":"A concise medical-data report"}</h3><p>${bn?"প্রশ্ন, পদ্ধতি, ফলাফল ও সীমাবদ্ধতা নিয়ে ছোট report তৈরি করুন।":"Summarise the question, methods, results and limitations in a short report."}</p></article></div><p class="chart-note">${bn?"শুধু শেখার জন্য: এই dataset বা model clinical diagnosis-এর বিকল্প নয়।":"For learning only: this dataset and model are not a substitute for clinical diagnosis."}</p><p><a class="btn" href="${interestUrl(c)}">${interest}</a></p></section>`;
}
function medicalNlpPage(t,c){
const bn=L==="bn",dataset="https://github.com/bepnye/EBM-NLP",interest=bn?"আগ্রহ নিবন্ধন করুন":"Register your interest",weeks=bn?[
["সপ্তাহ ১","PICO ও evidence review","Clinical question, PICO framework এবং annotated trial abstract dataset বোঝা।"],
["সপ্তাহ ২","টেক্সট প্রস্তুতি ও baseline","Abstract clean/tokenize করে simple baseline দিয়ে PICO span খোঁজা।"],
["সপ্তাহ ৩","Biomedical NLP extraction","Population, intervention ও outcome span extraction-এর model তৈরি ও পরীক্ষা।"],
["সপ্তাহ ৪","Google Sheets evidence log","PICO extraction-গুলো Google Sheets-এ export করে source ও confidence-সহ সাজান; researcher হিসেবে প্রতিটি row review ও validate করুন।"]]:[
["WEEK 1","PICO & evidence review","Understand clinical questions, the PICO framework and annotated trial abstracts."],
["WEEK 2","Text preparation & baseline","Clean and tokenize abstracts; build a simple baseline for locating PICO spans."],
["WEEK 3","Biomedical NLP extraction","Build and evaluate a model to extract population, intervention and outcome spans."],
["WEEK 4","Google Sheets evidence log","Export extracted PICO fields to Google Sheets with source and confidence; review and validate each row."]],
facts=bn?[["মেয়াদ","৪ সপ্তাহ"],["লাইভ ক্লাস","৮টি · প্রতিটি ৯০ মিনিট"],["ডেটাসেট","প্রায় ৫,০০০ annotated trial abstract"],["টুল","Google Colab · Python · Google Sheets"],["চূড়ান্ত কাজ","PICO extraction ও Google Sheets evidence log"]]:[["Duration","4 weeks"],["Live classes","8 · 90 minutes each"],["Dataset","About 5,000 annotated trial abstracts"],["Tools","Google Colab · Python · Google Sheets"],["Final output","PICO extraction and Google Sheets evidence log"]];
return `<section class="phero meal-cover" style="--h:${c.hue}"><span class="meal-kicker">${bn?"৪ সপ্তাহ · ৮টি হাতে-কলমে ক্লাস":"4 WEEKS · 8 HANDS-ON CLASSES"}</span><h1>${esc(c[L][0])}</h1><p>${esc(c[L][1])}</p><div class="meal-cover-actions"><a class="btn" href="${interestUrl(c)}">${interest}</a><span>Medical NLP · PICO · Evidence synthesis</span></div></section>`+
`<section class="sec light mis-details"><div class="glass-tile meal-final-card"><h2>${bn?"কোর্সের সংক্ষিপ্ত তথ্য":"Course at a glance"}</h2><dl class="facts">${facts.map(x=>`<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join("")}</dl><p><a href="${dataset}" target="_blank" rel="noopener noreferrer">${bn?"EBM-NLP dataset দেখুন ↗":"View the EBM-NLP dataset ↗"}</a></p></div></section>`+
`<section class="meal-overview sec light"><h2>${bn?"বাস্তব research workflow":"A practical research workflow"}</h2><div class="meal-project-grid">${weeks.map(w=>`<article class="glass-tile meal-project"><span>${w[0]}</span><h3>${w[1]}</h3><p>${w[2]}</p></article>`).join("")}</div></section>`+
`<section class="sec dark meal-why"><h2>${bn?"চূড়ান্ত project: Evidence Review Assistant":"Final project: Evidence Review Assistant"}</h2><div class="meal-why-grid"><article class="glass-tile"><span>01</span><h3>${bn?"Abstract থেকে PICO":"PICO from abstracts"}</h3><p>${bn?"Clinical trial abstract থেকে Population, Intervention ও Outcome অংশগুলো চিহ্নিত করে দেখাবে।":"Highlight Population, Intervention and Outcome spans from clinical-trial abstracts."}</p></article><article class="glass-tile"><span>02</span><h3>${bn?"Google Sheets evidence log":"Google Sheets evidence log"}</h3><p>${bn?"PICO field, abstract reference ও confidence-সহ ফল Google Sheets-এ export করুন; researcher প্রতিটি row যাচাই করবেন।":"Export PICO fields, abstract references and confidence to a reviewable Google Sheet; the researcher verifies each row."}</p></article></div><p class="chart-note">${bn?"এটি evidence review-এ সহায়ক শিক্ষামূলক prototype; চিকিৎসা-সিদ্ধান্তের tool নয়।":"An educational evidence-review prototype; not a clinical decision tool."}</p><p><a class="btn" href="${interestUrl(c)}">${interest}</a></p></section>`;
}
function misGuidance(bn){
const cards=(en,b)=>mealGuideCards(bn?b:en);
const quality=cards([
["Reliable data","Build a data dictionary, stable record IDs, duplicate checks and validation rules. Reconcile dashboard totals with source records."],
["Repeatable refresh","Document Power Query steps, refresh checks, error handling and a handover checklist."],
["Responsible reporting","Use synthetic or anonymised practice data; apply minimum access, clear KPI definitions and accessible chart labels."],
["Portfolio evidence","Package the workbook, data model, dashboard, test checklist and short user guide; explain limitations and decisions."]
],[
["বিশ্বস্ত ডেটা","Data dictionary, স্থায়ী record ID, duplicate check ও validation rule তৈরি করুন। Dashboard-এর মোট ফল source record-এর সঙ্গে মিলিয়ে নিন।"],
["পুনর্ব্যবহারযোগ্য refresh","Power Query step, refresh check, error handling ও handover checklist নথিভুক্ত করুন।"],
["দায়িত্বশীল reporting","কাল্পনিক বা পরিচয়মুক্ত practice data, প্রয়োজনমাফিক access, স্পষ্ট KPI definition ও পাঠযোগ্য chart label ব্যবহার করুন।"],
["Portfolio evidence","Workbook, data model, dashboard, test checklist ও সংক্ষিপ্ত user guide সাজান; সীমাবদ্ধতা ও সিদ্ধান্ত ব্যাখ্যা করুন।"]
]);
const assessment=cards([
["Project assessment","Each project: submission 50 + individual practical 30 + presentation/viva 20 = 100 marks. Pass each project with at least 60%; another project cannot offset a failed result."],
["Grades","80–100: A+ (4.00); 75–<80: A (3.75); 70–<75: A− (3.50); 65–<70: B+ (3.25); 60–<65: B (3.00); below 60: F (0.00)."],
["Assessment record","Project results accompany the SCOPE Certificate of Achievement. MIS project weights and any internal credit allocation will be specified in the project briefs before assessment; MEAL credit allocations do not apply automatically."],
["Academic integrity","Explain your own work. Briefs specify submission deadlines, permitted collaboration and AI use. Incomplete work remains Incomplete until assessed."]
],[
["প্রজেক্ট মূল্যায়ন","প্রতি project: submission ৫০ + individual practical ৩০ + presentation/viva ২০ = ১০০ নম্বর। প্রতিটিতে অন্তত ৬০ পেয়ে পাস করতে হবে; অন্য project-এর নম্বর দিয়ে ফেল পূরণ হবে না।"],
["গ্রেড","৮০–১০০: A+ (4.00); ৭৫–<৮০: A (3.75); ৭০–<৭৫: A− (3.50); ৬৫–<৭০: B+ (3.25); ৬০–<৬৫: B (3.00); ৬০-এর নিচে: F (0.00)।"],
["মূল্যায়ন রেকর্ড","SCOPE Certificate of Achievement-এর সঙ্গে project-wise ফল থাকবে। MIS project-এর weight ও internal credit থাকলে তা assessment-এর আগে brief-এ জানানো হবে; MEAL-এর credit স্বয়ংক্রিয়ভাবে প্রযোজ্য নয়।"],
["কাজের স্বচ্ছতা","নিজের কাজ ব্যাখ্যা করতে হবে। Deadline, collaboration ও AI ব্যবহারের নিয়ম project brief-এ থাকবে। মূল্যায়নের আগে অসম্পূর্ণ কাজ Incomplete থাকবে।"]
]);
return sec("light",bn?"পেশাদার MIS কাজের মান":"Professional MIS working standards",quality)+
sec("light",bn?"মূল্যায়ন ও সনদ":"Assessment and certification",assessment)+programmeSection(3)+programmeSection(4)+
sec("light",bn?"ভর্তির আগে জেনে নিন":"Before you enrol",cards([
["Software readiness","Bring a Windows laptop/desktop compatible with Power BI Desktop, a suitable Excel version and reliable internet. Software licences are not included; confirm compatibility before payment."],
["Learning support","Delivery via SCOPE Custom Platform, Zoom, Google Meet and Google Classroom. Bangladesh batch: Bangla and English; international batch: English only. Confirm international availability and fee with SCOPE."],
["Samples and recordings","A sample video and class recordings are not currently promised."]
],[
["Software প্রস্তুতি","Power BI Desktop-এর উপযোগী Windows laptop/desktop, উপযুক্ত Excel ও নির্ভরযোগ্য internet প্রয়োজন। Software licence অন্তর্ভুক্ত নয়; পেমেন্টের আগে compatibility নিশ্চিত করুন।"],
["শেখার ব্যবস্থা","Delivery via SCOPE Custom Platform, Zoom, Google Meet ও Google Classroom। বাংলাদেশি batch: বাংলা ও ইংরেজি; আন্তর্জাতিক batch: শুধু ইংরেজি। আন্তর্জাতিক batch-এর সুযোগ ও ফি SCOPE-এর কাছে নিশ্চিত করুন।"],
["Sample ও recording","এখন sample video বা class recording-এর প্রতিশ্রুতি দেওয়া হচ্ছে না।"]
]))+sec("light",bn?"ফি ও ফেরত নীতি":"Fees and refund policy",mealPolicy().replaceAll("MEAL","MIS"));
}
function misPage(t,c){
const bn=L==="bn",pick=x=>x[bn?1:0],projects=[
[["PROJECT 1","প্রজেক্ট ১"],["Excel Information Tracker","Excel তথ্য ট্র্যাকার"],["Build a structured tracker with clean tables, validation, lookup formulas and management summaries.","পরিচ্ছন্ন টেবিল, validation, lookup formula ও summary-সহ একটি ব্যবহারযোগ্য তথ্য ট্র্যাকার তৈরি করুন।"]],
[["PROJECT 2","প্রজেক্ট ২"],["Data Management Workflow","Data Management workflow"],["Create a repeatable process for collection, cleaning, quality checks, documentation and handover.","ডেটা সংগ্রহ, পরিষ্কার, quality check, documentation ও handover-এর পুনর্ব্যবহারযোগ্য প্রক্রিয়া তৈরি করুন।"]],
[["PROJECT 3","প্রজেক্ট ৩"],["Power BI Management Dashboard","Power BI Management Dashboard"],["Model prepared data and build an interactive KPI dashboard with clear, decision-ready reporting.","প্রস্তুত ডেটা model করে KPI-সহ interactive dashboard ও সিদ্ধান্ত-উপযোগী report তৈরি করুন।"]]],
modules=[["MIS & information management foundations","MIS ও information management-এর ভিত্তি"],["Data collection, sources & structure","ডেটা সংগ্রহ, উৎস ও কাঠামো"],["Excel tables & formula workflows","Excel table ও formula workflow"],["Data cleaning, validation & quality","ডেটা পরিষ্কার, validation ও quality"],["Excel tracker and management summaries","Excel tracker ও management summary"],["Power Query: import, transform & refresh","Power Query: import, transform ও refresh"],["Data management workflow project","Data management workflow project"],["Governance, access & documentation","Governance, access ও documentation"],["Power BI data model & relationships","Power BI data model ও relationship"],["Measures, KPIs & meaningful comparisons","Measure, KPI ও কার্যকর তুলনা"],["Interactive Power BI dashboard project","Interactive Power BI dashboard project"],["Capstone, quality review & presentation","Capstone, quality review ও উপস্থাপনা"]],
road=bn?["শুরু","ডেটা গুছানো","তথ্য পরিচালনা","Power BI রিপোর্ট","Portfolio সম্পন্ন"]:["Start","Structure data","Manage information","Power BI reporting","Portfolio complete"],weeks=bn?["সপ্তাহ ১","সপ্তাহ ১–৩","সপ্তাহ ৪–৬","সপ্তাহ ৭–১০","সপ্তাহ ১১–১২"]:["WEEK 1","WEEKS 1–3","WEEKS 4–6","WEEKS 7–10","WEEKS 11–12"],
why=[["Connected tools","Excel, Power Query and Power BI form a practical end-to-end workflow.","সংযুক্ত tools","Excel, Power Query ও Power BI মিলে একটি পূর্ণাঙ্গ ব্যবহারিক workflow তৈরি করে।"],["Data quality habits","Practice validation, duplicate checks, documentation and responsible access.","ডেটার মান","Validation, duplicate check, documentation ও দায়িত্বশীল access অনুশীলন করুন।"],["Build while learning","Use guided projects to turn concepts into working trackers and reports.","শিখতে শিখতে তৈরি","Guided project-এ ধারণাকে কার্যকর tracker ও report-এ রূপ দিন।"],["Show your work","Finish with portfolio pieces you can explain in an interview or at work.","কাজ দেখানোর portfolio","কাজে বা interview-তে ব্যাখ্যা করতে পারবেন এমন portfolio তৈরি করুন।"]],
courseFacts=bn?[["মেয়াদ","৩ মাস"],["কোর্স ফি","৳ ৮৫০"],["নিবন্ধনের শেষ তারিখ","২৫ ডিসেম্বর ২০২৬"],["ক্লাস শুরু","৩০ ডিসেম্বর ২০২৬"],["ক্লাসের দিন","শুক্রবার, শনিবার, সোমবার"],["ক্লাসের সময়","রাত ৮:০০–৯:৩০"],["প্রধান tools","Excel · Power BI"]]:[["Duration","3 months"],["Course fee","BDT 850"],["Registration deadline","25 December 2026"],["Classes start","30 December 2026"],["Class days","Friday, Saturday, Monday"],["Class time","Night, 8:00 PM–9:30 PM"],["Core tools","Excel · Power BI"]],interest=bn?"এখন নিবন্ধন করুন":"Register now",mods=modules.map((m,i)=>`<details class="meal-module glass-tile"><summary><span class="module-week">${bn?"সপ্তাহ":"WEEK"} ${String(i+1).padStart(2,"0")}</span><b>${pick(m)}</b><span class="module-count">${bn?"বিষয়":"MODULE"}</span></summary><p>${bn?"Guided practice, workbook exercise এবং একটি build বা review activity থাকবে।":"Guided practice, workbook exercises and a build or review activity."}</p></details>`).join("");
const roadSvg=`<svg viewBox="0 0 1000 210" role="img" aria-label="${bn?"শেখার roadmap":"Learning roadmap"}"><path id="mis-road-path" class="road-path" pathLength="1" d="M35 178 C170 178 145 143 265 143 S365 110 475 110 S575 74 690 74 S815 34 965 34"/>${[[35,178],[265,143],[475,110],[690,74],[965,34]].map((p,i)=>`<circle class="road-dot${i===4?" road-finish":""}" cx="${p[0]}" cy="${p[1]}" r="${i===4?13:8}"/>`).join("")}<circle class="road-progress" r="7"><animateMotion dur="11s" repeatCount="indefinite"><mpath href="#mis-road-path"/></animateMotion></circle></svg>`,courseInfo=`<section class="sec light mis-details"><div class="glass-tile meal-final-card"><h2>${bn?"কোর্সের তথ্য":"Course details"}</h2><dl class="facts meal-facts">${courseFacts.map((x,i)=>`<div class="glass-tile meal-fact-card"${i===2?' style="color:#b42338;font-weight:800"':""}><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join("")}</dl><p><a class="btn" href="${regUrl(c)}">${interest}</a></p></div></section>`;
return `<section class="phero meal-cover mis-cover" style="--h:${c.hue}"><span class="meal-kicker">${bn?"৩ মাস · MIS & INFORMATION MANAGEMENT":"3 MONTHS · MIS & INFORMATION MANAGEMENT"}</span><h1>${esc(c[L][0])}</h1><p>${bn?"৩ মাসে Excel, Power BI ও information management-এর ব্যবহারিক দক্ষতা গড়ুন—ডেটা সংগ্রহ থেকে সিদ্ধান্ত-উপযোগী reporting পর্যন্ত।":"Build practical Excel, Power BI and information-management skills over three months, from data capture to decision-ready reporting."}</p><div class="meal-cover-actions"><a class="btn" href="${regUrl(c)}">${interest}</a><span>Excel · Power BI · Data Management</span></div><div class="mis-tools"><span><img src="${P("assets/img/excel-logo.svg")}" alt="">Microsoft Excel</span><span><img src="${P("assets/img/power-bi-logo.svg")}" alt="">Microsoft Power BI</span></div></section>`+
courseInfo+
`<section class="meal-overview sec light"><div class="meal-metrics">${[["3 months","৩ মাস"],["3 projects","৩টি"],["Excel","Excel"],["Power BI","Power BI"]].map((x,i)=>`<article class="glass-tile meal-metric" style="--h:${["#16b8a6","#1769c2","#8a6be8"][i%3]}"><strong>${pick(x)}</strong><span>${bn?["কোর্সের মেয়াদ","বাস্তবভিত্তিক প্রজেক্ট","ডেটা ওয়ার্কফ্লো","ইন্টারঅ্যাকটিভ রিপোর্টিং"][i]:["Course duration","Applied projects","Data workflows","Interactive reporting"][i]}</span></article>`).join("")}</div><h2>${bn?"আপনি যা তৈরি করবেন":"What you will build"}</h2><div class="meal-project-grid">${projects.map(p=>`<article class="glass-tile meal-project"><span>${pick(p[0])}</span><h3>${pick(p[1])}</h3><p>${pick(p[2])}</p></article>`).join("")}</div></section>`+
`<section class="sec dark meal-road-section"><h2>${bn?"তথ্য থেকে সিদ্ধান্ত—শেখার যাত্রা":"From information to decisions"}</h2><div class="meal-road rv">${roadSvg}<ol class="road-labels">${road.map((x,i)=>`<li><small>${weeks[i]}</small><b>${x}</b>${i===4?`<span class="achievement-badge">✦ ${bn?"Portfolio সম্পন্ন":"PORTFOLIO READY"}</span>`:""}</li>`).join("")}</ol></div></section>`+
`<section class="sec light mis-workflow"><h2>${bn?"একটি পূর্ণাঙ্গ information workflow":"A complete information workflow"}</h2><article class="glass-tile mis-flow-card"><h3>${bn?"ডেটার যাত্রা":"How data moves"}</h3><ol>${(bn?["সংগ্রহ","পরিষ্কার ও যাচাই","সংরক্ষণ ও পরিচালনা","বিশ্লেষণ","রিপোর্ট ও সিদ্ধান্ত"]:["Collect","Clean & validate","Store & manage","Analyze","Report & decide"]).map((x,i)=>`<li><span>0${i+1}</span><b>${x}</b></li>`).join("")}</ol></article></section>`+
programmeSection(0)+`<section class="sec dark meal-why"><h2>${bn?"কেন এই কোর্সটি ব্যবহারিক":"Why this course is practical"}</h2><div class="meal-why-grid">${why.map((x,i)=>`<article class="glass-tile"><span>0${i+1}</span><h3>${x[bn?2:0]}</h3><p>${x[bn?3:1]}</p></article>`).join("")}</div></section>`+
`<section class="sec light meal-syllabus"><h2>${bn?"১২ সপ্তাহের syllabus":"12-week syllabus"}</h2><p class="lead">${bn?"ভিত্তি থেকে guided practice, তিনটি project build এবং শেষের portfolio review পর্যন্ত ধারাবাহিক শেখা।":"A guided path from foundations and practice to three project builds and a final portfolio review."}</p><div class="syllabus-grid">${mods}</div></section>`+misGuidance(bn);
}
function page(){const p=B.dataset.page,t=T(),m=open();
if(p==="home"){const research=S.courses.filter(c=>c.st!=="current"&&c.cat==="research"),up=S.courses.filter(c=>c.st!=="current"&&c.cat!=="research"),w=t.words;
return `<section class="hero"><div class="hcopy"><h1 class="scope-full">SCOPE — School for Career-Oriented Professional Education</h1><p class="eye">${t.eye}</p><h2 class="kin"><span>${w[0]}</span><span>${w[1]}</span><span>${w[2]}</span></h2><p class="btns"><a class="btn" href="${P("courses/index.html")}">${t.c1}</a><a class="btn ghost" href="${curl(m)}">${t.c2}</a><a class="btn ghost" href="${P("tools/map-studio/index.html")}">${t.mapStudio}</a></p></div><div class="hstage"><canvas id="orbit" role="img" aria-label="${t.orb}"></canvas><p class="hint">${t.hint}</p></div></section>
<div class="band" aria-hidden="true"><div class="trk"><span>${t.mqt.repeat(3)}</span><span>${t.mqt.repeat(3)}</span></div></div>`+
sec("light",t.fh,`<div class="cards home-live-grid">${S.courses.filter(c=>c.st==="current").map(card).join("")}</div>`)+
sec("dark",t.jt,`<div class="jr rv"><svg viewBox="0 0 600 70" aria-hidden="true"><path d="M10 58C150 58 150 14 300 14S450 58 590 14" pathLength="1"/></svg><ol>${t.j.map(j=>`<li><b>${j[0]}</b><span>${j[1]}</span></li>`).join("")}</ol></div>`)+
sec("light",t.cats,`<div class="chips rv">${Object.keys(t.cat).map(k=>`<a href="${P("courses/index.html?cat="+k)}">${t.cat[k]}</a>`).join("")}</div>`)+
sec("light",t.up,`<p class="note">${t.upn}</p>${research.length?`<section class="course-group research-group"><h2>${L==="bn"?"গবেষণা কোর্স":"Research courses"}</h2><div class="cards">${research.map(card).join("")}</div></section>`:""}${up.length?`<section class="course-group upcoming-group"><h2>${L==="bn"?"অন্যান্য আসন্ন কোর্স":"Other upcoming courses"}</h2><div class="cards">${up.map(card).join("")}</div></section>`:""}`)}
if(p==="courses")return sub(t.courses)+sec("light","",`<input id="q" type="search" aria-label="${t.search}" placeholder="${t.search}"><div class="chips" id="fl"></div><section class="course-group live-group" id="liveGroup"><h2>${L==="bn"?"● চলমান কোর্স":"● Live courses"}</h2><div class="cards" id="liveGrid"></div></section><section class="course-group research-group" id="researchGroup"><h2>${L==="bn"?"গবেষণা কোর্স":"Research courses"}</h2><div class="cards" id="researchGrid"></div></section><section class="course-group upcoming-group" id="upcomingGroup"><h2>${L==="bn"?"অন্যান্য আসন্ন কোর্স":"Other upcoming courses"}</h2><div class="cards" id="upcomingGrid"></div></section><p id="em" class="note" role="status" hidden>${t.none}</p>`);
if(p==="course"){const c=S.courses.find(x=>x.slug===B.dataset.slug),cur=c.st==="current";
return c.slug==="meal"?mealPage(t,c):c.slug==="mis"?misPage(t,c):c.slug==="public-health-ml-research"?publicHealthResearchPage(t,c):c.slug==="medical-data-science"?medicalDataSciencePage(t,c):c.slug==="medical-nlp-evidence-review"?medicalNlpPage(t,c):`<section class="phero" style="--h:${c.hue}">${icon(c.cat)}${badge(c.st)}<h1>${esc(c[L][0])}</h1><p>${esc(c[L][1])}</p>${cur?cta("",c):`<a class="btn ghost" href="${regUrl()}">${t.form}</a>`}</section>`+sec("light",t.cat[c.cat],cur?`${facts()}<p class="note">${t.sep}</p>${cta("",c)}<p class="note">${t.ext}</p>`:`<p>${t.tba}</p><p class="note">${t.upn}</p>`)}
if(p==="about")return sub(t.about)+sec("light","",`<p class="lead">${t.aboutP}</p>`)+programmeSection(0);
if(p==="refund")return sub(L==="bn"?"MEAL ফি ও ফেরত নীতি":"MEAL fees and refund policy")+sec("light","",mealPolicy())+programmeSection(3);
if(p==="learn")return sub(t.learn)+sec("light","",`<ul class="lead">${t.lP.map(x=>`<li>${x}</li>`).join("")}</ul>`);
if(p==="contact")return sub(t.contact)+sec("light","",`<p>${t.cP}</p><p><a class="btn" href="${S.fb}" target="_blank" rel="noopener noreferrer">${t.fb}</a> <a class="btn ghost-d" href="${regUrl()}">${t.form}</a></p>`+t.faq.map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join(""));
if(p==="register"){const q=new URLSearchParams(location.search),slug=q.get("course");enrolC=null;
if(q.get("mode")==="interest"||(q.get("mode")==="local"&&S.courses.some(c=>c.slug===slug&&c.st!=="current")))return "";
if(q.get("mode")!=="local")return `<section class="sec light"><h1>Are you Bangladeshi or an international learner?</h1><p><a class="btn" href="?mode=local&course=${encodeURIComponent(slug||"meal")}">Bangladesh</a> <a class="btn" href="?mode=international&course=${encodeURIComponent(slug||"meal")}">International</a></p></section>`;
if(q.get("mode")!=="interest")enrolC=slug?S.courses.find(x=>x.slug===slug&&x.st==="current") :m||open();
return enrolC?enrolPage(enrolC):interestPage()}
return sub(t.nf,t.nfp)+sec("light","",`<a class="btn" href="${P("index.html")}">${t.home}</a>`)}
/* ---------- form behaviour ---------- */
function snap(){const f=$("#ef");return f?{s:+f.dataset.step||0,v:[...f.elements].filter(e=>e.name).map(e=>[e.name,e.type==="checkbox"?e.checked:e.value])}:null}
const mkref=c=>{const a="ABCDEFGHJKMNPQRSTUVWXYZ23456789",u=crypto.getRandomValues(new Uint8Array(4)),d=new Date(),z=n=>String(n).padStart(2,"0");return `SCOPE-${c.slug.replace(/[^a-z]/g,"").slice(0,4).toUpperCase()}-${String(d.getFullYear()).slice(2)}${z(d.getMonth()+1)}${z(d.getDate())}-${[...u].map(b=>a[b%a.length]).join("")}`};
const RULES={name:e=>e.value.trim().length>=2,email:e=>e.checkValidity(),phone:e=>PH.test(clean(e.value)),sender:e=>PH.test(clean(e.value)),trxid:e=>/^[A-Za-z0-9]{8,12}$/.test(e.value.trim())};
function mountTurnstile(form,attempt=0){if(!form||!S.turnstileSiteKey)return;const box=form.querySelector(".cf-turnstile");if(!box||box.dataset.widgetId)return;if(!window.turnstile){if(attempt<80)setTimeout(()=>mountTurnstile(form,attempt+1),250);return}box.dataset.widgetId=window.turnstile.render(box,{sitekey:S.turnstileSiteKey,theme:"light"})}
function enrolForms(){const f=$("#ef");if(!f)return;const t=T(),r=t.r,st=$("#st"),steps=[...f.querySelectorAll(".stp")],dots=[...document.querySelectorAll(".stepper li")];let cur=0,c=enrolC;
const check=i=>{let ok=true;steps[i].querySelectorAll("[required]").forEach(el=>{const empty=el.type==="checkbox"?!el.checked:!el.value.trim(),bad=empty?"req":(RULES[el.name]&&!RULES[el.name](el)?"fmt":""),er=$("#er-"+el.name);if(er)er.textContent=bad==="req"?t.req:bad==="fmt"?r.fmt:"";el.setAttribute("aria-invalid",!!bad);if(bad)ok=false});st.textContent=ok?"":t.bad;st.className=ok?"":"err";return ok};
const review=()=>{const v=n=>f.elements[n].value.trim(),rows=[[r.lc,c[L][0]],[t.n,v("name")],[t.e,v("email")],[t.p,clean(v("phone"))],[r.amt,feeFor(c)],[r.lp,clean(v("sender"))],["TrxID",v("trxid").toUpperCase()]];$("#rv").innerHTML=rows.map(x=>`<div><dt>${esc(x[0])}</dt><dd>${esc(x[1])}</dd></div>`).join("")};
const go=n=>{if(n>cur&&!check(cur))return;cur=n;f.dataset.step=n;steps.forEach((s,i)=>s.hidden=i!==n);dots.forEach((d,i)=>i===n?d.setAttribute("aria-current","step"):d.removeAttribute("aria-current"));if(n===2){review();mountTurnstile(f)}st.textContent="";const lg=steps[n].querySelector("legend");lg.focus({preventScroll:true});$(".regmain").scrollIntoView({block:"start"})};
f.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(+b.dataset.go));
$("#cp").onclick=async()=>{const b=$("#cp");try{await navigator.clipboard.writeText(S.pay.to);b.textContent=r.copied;setTimeout(()=>b.textContent=r.copy,1800)}catch(e){}};
const syncCourse=()=>{const selected=S.courses.find(x=>x.slug===$("#courseSelect").value&&x.st==="current");if(!selected)return;c=selected;enrolC=selected;$("#sumCourse").textContent=selected[L][0];$("#courseFee").textContent=feeFor(selected);$("#sumFacts").innerHTML=factsHtml(selected,["fee","dl","start","days","time","del","cert"])};$("#courseSelect").onchange=syncCourse;
if(saved){saved.v.forEach(([n,v])=>{const el=f.elements[n];if(!el)return;if(el.type==="checkbox")el.checked=v;else el.value=v});syncCourse();const s=saved.s;saved=null;if(s)go(s)}
f.onsubmit=async e=>{e.preventDefault();if(cur<2){go(cur+1);return}if(!check(2))return;if(f.website.value)return;
if(!S.endpoint){st.textContent=t.nocfg;st.className="err";st.focus();return}if(!f.elements["cf-turnstile-response"]||!f.elements["cf-turnstile-response"].value){st.textContent=L==="bn"?"নিরাপত্তা যাচাই সম্পন্ন করুন।":"Please complete the security check.";st.className="err";st.focus();return}
const btn=$("#go"),ref=mkref(c),data=new URLSearchParams(new FormData(f));btn.disabled=true;st.textContent=t.sending;st.className="";
data.set("type","enrol");data.set("ref",ref);data.set("course",c.en[0]);data.set("courseSlug",c.slug);data.set("amount",c.fee);data.set("phone",clean(f.phone.value));data.set("sender",clean(f.sender.value));data.set("trxid",f.trxid.value.trim().toUpperCase());data.set("lang",L);
let res=null,unsure=false;try{const x=await fetch(S.endpoint,{method:"POST",body:data});res=await x.json()}catch(x){unsure=true}
if(res&&res.ok===false){btn.disabled=false;const dup=res.error==="duplicate_trx";if(dup){go(1);f.trxid.setAttribute("aria-invalid","true");$("#er-trxid").textContent=r.dup}st.textContent=dup?r.dup:r.srv;st.className="err";st.focus();return}
const good=!unsure&&res&&res.ok===true,box=$(".regmain");
box.innerHTML=`<div class="done" role="status" tabindex="-1"><h2>${r.doneh}</h2><p class="refl">${r.ref}</p><p class="refn">${ref}</p><p><span class="badge b-soon"><i aria-hidden="true">◔</i>${r.stt}</span></p>${good?"":`<p class="err">${r.unk}</p>`}<h3>${r.nxh}</h3><ol class="how">${r.nx.map(x=>`<li>${x}</li>`).join("")}</ol><p class="note">${r.keep}</p><p><a class="btn" href="${P("index.html")}">${t.home}</a> <a class="btn ghost-d" href="${S.fb}" target="_blank" rel="noopener noreferrer">${t.fb}</a></p></div>`;
const dn=$(".done");dn.focus();dn.scrollIntoView({block:"start"});
if(good){let tries=0;const poll=async()=>{if(++tries>240||!dn.isConnected)return;try{const q=new URL(S.endpoint);q.searchParams.set("status",ref);const x=await fetch(q,{cache:"no-store"}),v=await x.json();if(v.ok&&v.verified){const badge=dn.querySelector(".badge");badge.className="badge b-verified";badge.innerHTML=`<i aria-hidden="true">✓</i>${r.stv}`;return}}catch(e){}setTimeout(poll,15000)};setTimeout(poll,12000)}}}
function forms(){enrolForms();const f=$("#rf");if(f){mountTurnstile(f);const st=$("#st");f.onsubmit=async e=>{e.preventDefault();let ok=true;f.querySelectorAll("[required]").forEach(i=>{const bad=i.type==="checkbox"?!i.checked:!i.value.trim()||!i.checkValidity(),er=$("#er-"+i.name);if(er)er.textContent=bad?T().req:"";i.setAttribute("aria-invalid",bad);if(bad)ok=false});
if(!ok){st.textContent=T().bad;st.className="err";return}if(f.website.value)return;if(!S.endpoint){st.textContent=T().nocfg;st.className="err";st.focus();return}if(!f.elements["cf-turnstile-response"]||!f.elements["cf-turnstile-response"].value){st.textContent=L==="bn"?"নিরাপত্তা যাচাই সম্পন্ন করুন।":"Please complete the security check.";st.className="err";st.focus();return}
st.textContent=T().sending;st.className="";try{const x=await fetch(S.endpoint,{method:"POST",body:new URLSearchParams(new FormData(f))}),v=await x.json();if(!v.ok)throw new Error(v.error||"request");st.textContent=T().ok;st.className="ok";f.reset();const box=f.querySelector(".cf-turnstile");if(box&&box.dataset.widgetId)window.turnstile.reset(box.dataset.widgetId)}catch(x){st.textContent=x.message==="captcha"?(L==="bn"?"নিরাপত্তা যাচাই ব্যর্থ হয়েছে। আবার চেষ্টা করুন।":"Security check failed. Please try again."):T().fail;st.className="err";const box=f.querySelector(".cf-turnstile");if(box&&box.dataset.widgetId)window.turnstile.reset(box.dataset.widgetId)}st.focus()}}
const q=$("#q");if(q){let cat=new URLSearchParams(location.search).get("cat")||"all";const draw=()=>{$("#fl").innerHTML=["all",...Object.keys(T().cat)].map(k=>`<button type="button" data-k="${k}" aria-pressed="${k===cat}">${k==="all"?T().all:T().cat[k]}</button>`).join("");$("#fl").querySelectorAll("button").forEach(b=>b.onclick=()=>{cat=b.dataset.k;draw()});
const v=q.value.toLowerCase(),l=S.courses.filter(c=>(cat==="all"||c.cat===cat)&&(c.en.join(" ")+c.bn.join(" ")).toLowerCase().includes(v)),live=l.filter(c=>c.st==="current"),research=l.filter(c=>c.st!=="current"&&c.cat==="research"),upcoming=l.filter(c=>c.st!=="current"&&c.cat!=="research");$("#liveGrid").innerHTML=live.map(card).join("");$("#researchGrid").innerHTML=research.map(card).join("");$("#upcomingGrid").innerHTML=upcoming.map(card).join("");$("#liveGroup").hidden=!live.length;$("#researchGroup").hidden=!research.length;$("#upcomingGroup").hidden=!upcoming.length;$("#em").hidden=l.length>0;FX.init(T(),R)};q.oninput=draw;draw()}}
function render(){document.documentElement.lang=L;shell();$("#app").innerHTML=page();const c=S.courses.find(x=>x.slug===B.dataset.slug),p=B.dataset.page;
document.title=(c?c[L][0]:p==="home"?"SCOPE":p==="register"?(enrolC?T().r.h:T().form):T()[p]||T().form)+" | SCOPE";forms();FX.init(T(),R);if(window.renderInternationalInterest)window.renderInternationalInterest()}
render()})();
