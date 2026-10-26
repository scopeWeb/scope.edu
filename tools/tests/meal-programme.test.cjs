const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
function render(page,slug,lang,search=''){
 const ctx={URL,URLSearchParams,console,location:{href:'https://example.test/',search},localStorage:{getItem:()=>lang},document:{currentScript:{dataset:{root:'../'}},body:{dataset:{page,slug}}}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'assets/js/data.js'),'utf8'),ctx);
 const code=fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8');assert(code.includes('render()})();'));
 vm.runInContext(code.replace('render()})();','window.renderPageForTest=page;})();'),ctx);return ctx.renderPageForTest();
}
for(const lang of ['en','bn']){
 test(`${lang}: MEAL includes lead, syllabus, credits and assessment`,()=>{const html=render('course','meal',lang);assert.match(html,/Aspiring PhD Researcher/);assert.match(html,/Humanitarian Data Science/);assert.equal((html.match(/<table>/g)||[]).length,2);assert.equal((html.match(/<details /g)||[]).length,12);assert.match(html,/13.5/);assert.match(html,/27/);assert.match(html,/60%|৬০%/);assert.match(html,/US\$10|USD 10/);assert(!html.includes('<video'));assert(!html.includes('মোহাম্মদ আক্তার'));});
 test(`${lang}: refund route resolves with withdrawal and retake policy`,()=>{const html=render('refund','',lang);assert.match(html,/not refundable|ফেরত দেওয়া হবে না/);assert.match(html,/cancels|বাতিল/);assert.match(html,/15 days|১৫ দিন/);});
 test(`${lang}: local payment shows policy before instructions`,()=>{const html=render('register','',lang,'?mode=local&course=meal');assert(html.indexOf('meal-policy')<html.indexOf('id="bk"'));assert.match(html,/Read assessment|মূল্যায়ন, রিটেক/);assert.match(html,/I have read the MEAL|আমি MEAL/);});
 test(`${lang}: unrelated MIS course does not receive MEAL fees`,()=>{const html=render('register','',lang,'?mode=local&course=mis');assert(!html.includes('meal-policy'));assert(!html.includes('I have read the MEAL'));});
}
test('international interest policy has course-scoped visibility and no payment collection',()=>{const code=fs.readFileSync(path.join(root,'assets/js/international.js'),'utf8');assert.match(code,/policyNote.hidden=slug!=='meal'/);assert.match(code,/no payment is collected now/);assert.match(code,/const originalTerms=f.querySelector\('fieldset:last-child .intl-help'\)/);});
