'use strict';
const FIELDS=[
{k:'nameBn',l:'নাম বাংলা',t:'text',req:1},
{k:'nameEn',l:'নাম ইংরেজি',t:'text'},
{k:'father',l:'পিতার নাম',t:'text'},
{k:'mother',l:'মাতার নাম',t:'text'},
{k:'nid',l:'NID No.',t:'text',m:'numeric',ph:'১০, ১৩ বা ১৭ ডিজিট'},
{k:'dob',l:'জন্ম তারিখ',t:'date'},
{k:'center',l:'কেন্দ্রের ঠিকানা',t:'text'},
{k:'bank',l:'ব্যাংকের নাম',t:'text'},
{k:'acc',l:'ব্যাংক হিসাব নম্বর',t:'text',m:'numeric'},
{k:'routing',l:'রাউটিং নম্বর',t:'text',m:'numeric',ph:'৯ ডিজিট'},
{k:'branch',l:'ব্যাংক ও শাখার নাম',t:'text'},
{k:'mobile',l:'মোবাইল নম্বর',t:'text',m:'tel',ph:'01XXXXXXXXX'},
{k:'amount',l:'সম্মানীর পরিমান',t:'text',m:'decimal',ph:'টাকা'},
{k:'other',l:'অন্যান্য তথ্য',t:'textarea'},
{k:'remark',l:'মন্তব্য',t:'textarea'}];
const KEY='deRecords_v1';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const en=s=>String(s==null?'':s).replace(/[০-৯]/g,d=>'০১২৩৪৫৬৭৮৯'.indexOf(d));
const money=n=>'৳ '+(+n||0).toLocaleString('en-IN',{maximumFractionDigits:2});
const fdate=v=>{if(!v)return '';const p=String(v).split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:v};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const stamp=()=>{const d=new Date(),z=n=>String(n).padStart(2,'0');return d.getFullYear()+z(d.getMonth()+1)+z(d.getDate())+'-'+z(d.getHours())+z(d.getMinutes())};
const DB={
 all(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}},
 save(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true}catch(e){toast('সংরক্ষণ করা যায়নি! ব্রাউজারের স্টোরেজ পূর্ণ বা বন্ধ।');return false}}
};
const SVG={chart:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',plus:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',download:'<path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M4 17v3h16v-3"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',x:'<path d="M18 6L6 18M6 6l12 12"/>',sheet:'<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5M8 13h8M8 17h8M12 11v8"/>',doc:'<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5M8 13h8M8 17h5"/>',users:'<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7M17 4a4 4 0 010 8M22 21c0-3-2-5-4-6"/>',wallet:'<path d="M3 7a2 2 0 012-2h13v4"/><path d="M3 7v11a2 2 0 002 2h15V9H5a2 2 0 01-2-2z"/><circle cx="16.5" cy="14.5" r="1"/>',bank:'<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18"/>',check:'<path d="M5 12l5 5 9-10"/>',upload:'<path d="M12 16V4m0 0L8 8m4-4l4 4"/><path d="M4 17v3h16v-3"/>',shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',avg:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'};
const ic=(n,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${SVG[n]||''}</svg>`;
function toast(m){$$('.toast').forEach(e=>e.remove());const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2800)}
function modal(html){const o=document.createElement('div');o.className='ov';o.innerHTML=`<div class="md" role="dialog">${html}</div>`;
 const close=()=>{o.remove();document.removeEventListener('keydown',k)};const k=e=>{if(e.key==='Escape')close()};
 o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-x]'))close()});document.addEventListener('keydown',k);document.body.appendChild(o);o.close=close;return o}
const empty=(t,l)=>`<div class="empty">${ic('list')}<p>${t}</p>${l?`<a class="btn" href="${l}">${ic('plus')} নতুন এন্ট্রি</a>`:''}</div>`;
function shell(){const p=document.body.dataset.page;
 const tabs=[['summary','index.html','chart','Summary'],['entry','entry.html','plus','Entry'],['records','records.html','list','Records'],['export','export.html','download','Export']];
 document.body.insertAdjacentHTML('afterbegin',`<header class="top"><div><span class="logo">${ic('users')}</span><span><b>ডেটা এন্ট্রি</b><small>সম্মানী ব্যবস্থাপনা সফটওয়্যার</small></span></div></header>`);
 document.body.insertAdjacentHTML('beforeend',`<nav class="nav"><div>${tabs.map(t=>`<a href="${t[1]}" class="${t[0]===p?'on':''}">${ic(t[2])}${t[3]}</a>`).join('')}</div></nav>`);
 const m=$('#app');({summary,entry,records,exportPage})[p==='export'?'exportPage':p](m)}

function summary(m){const r=DB.all(),tot=r.reduce((s,x)=>s+(+x.amount||0),0),bk={};
 r.forEach(x=>{const b=(x.bank||'').trim()||'অনির্দিষ্ট';bk[b]=bk[b]||{n:0,a:0};bk[b].n++;bk[b].a+=+x.amount||0});
 const bl=Object.entries(bk).sort((a,b)=>b[1].a-a[1].a),mx=Math.max(1,...bl.map(b=>b[1].a));
 const rec=r.slice(-5).reverse();
 m.innerHTML=`<h1>সারসংক্ষেপ</h1><div class="stats">
 <div class="stat">${ic('users')}<span>মোট এন্ট্রি</span><strong>${r.length}</strong></div>
 <div class="stat">${ic('wallet')}<span>মোট সম্মানী</span><strong>${money(tot)}</strong></div>
 <div class="stat">${ic('bank')}<span>ব্যাংক সংখ্যা</span><strong>${r.length?bl.length:0}</strong></div>
 <div class="stat">${ic('avg')}<span>গড় সম্মানী</span><strong>${money(r.length?tot/r.length:0)}</strong></div></div>
 <div class="grid2"><div class="card"><h2>ব্যাংকভিত্তিক সারসংক্ষেপ</h2>${bl.length?bl.map(([n,v])=>`<div class="bar"><p><span>${esc(n)} (${v.n})</span><b>${money(v.a)}</b></p><i><s style="width:${Math.round(v.a/mx*100)}%"></s></i></div>`).join(''):empty('এখনও কোনো ডেটা নেই','entry.html')}</div>
 <div class="card"><h2>সর্বশেষ এন্ট্রি</h2>${rec.length?rec.map(x=>`<div class="li"><span>${esc(x.nameBn)}<small>${esc(x.mobile||'—')}</small></span><b>${money(x.amount)}</b></div>`).join(''):empty('কোনো এন্ট্রি নেই')}</div></div>`}

function entry(m){const id=new URLSearchParams(location.search).get('edit'),all=DB.all(),rec=id?all.find(x=>x.id===id):null;
 if(id&&!rec){m.innerHTML=empty('রেকর্ড পাওয়া যায়নি','entry.html');return}
 const sn=()=>rec?all.findIndex(x=>x.id===id)+1:DB.all().length+1;
 m.innerHTML=`<h1>${rec?'এন্ট্রি সম্পাদনা':'নতুন এন্ট্রি'}</h1><form class="card form" id="f" novalidate>
 <div class="fg"><label>ক্রম (অটোমেটিক)</label><input id="sn" readonly value="${sn()}"></div><div class="fg"></div>
 ${FIELDS.map(f=>`<div class="fg ${f.t==='textarea'?'full':''}"><label for="f_${f.k}">${f.l}${f.req?'<b>*</b>':''}</label>${f.t==='textarea'?`<textarea id="f_${f.k}"></textarea>`:`<input id="f_${f.k}" type="${f.t}" ${f.m?`inputmode="${f.m}"`:''} placeholder="${f.ph||''}" autocomplete="off">`}<small class="err" id="e_${f.k}"></small></div>`).join('')}
 <div class="fg full acts"><button class="btn" type="submit">${ic('check')} ${rec?'আপডেট করুন':'সংরক্ষণ করুন'}</button><button class="btn o" type="button" id="rs">${ic('x')} ${rec?'বাতিল':'রিসেট'}</button></div></form>`;
 const set=o=>FIELDS.forEach(f=>$('#f_'+f.k).value=o?o[f.k]||'':'');set(rec);
 const dob=$('#f_dob');dob.max=new Date().toISOString().slice(0,10);
 $('#rs').onclick=()=>{if(rec)location.href='records.html';else{set(null);$$('.err').forEach(e=>e.textContent='')}};
 $('#f').onsubmit=e=>{e.preventDefault();const v={},er={};
  FIELDS.forEach(f=>{let x=$('#f_'+f.k).value.trim();if(['nid','acc','routing','mobile','amount'].includes(f.k))x=en(x).replace(/[\s,-]/g,'');v[f.k]=x});
  if(v.mobile)v.mobile=v.mobile.replace(/^\+?88(?=01)/,'');
  if(!v.nameBn)er.nameBn='নাম (বাংলা) আবশ্যক';
  if(v.nid&&!/^(\d{10}|\d{13}|\d{17})$/.test(v.nid))er.nid='NID ১০, ১৩ বা ১৭ ডিজিটের হতে হবে';
  if(v.acc&&!/^\d{5,30}$/.test(v.acc))er.acc='হিসাব নম্বর শুধু সংখ্যা (৫-৩০ ডিজিট)';
  if(v.routing&&!/^\d{9}$/.test(v.routing))er.routing='রাউটিং নম্বর ৯ ডিজিটের হতে হবে';
  if(v.mobile&&!/^01\d{9}$/.test(v.mobile))er.mobile='সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন';
  if(v.amount&&!/^\d+(\.\d{1,2})?$/.test(v.amount))er.amount='সঠিক টাকার পরিমাণ দিন';
  if(v.dob&&v.dob>dob.max)er.dob='ভবিষ্যতের তারিখ গ্রহণযোগ্য নয়';
  const cur=DB.all();if(v.nid&&cur.some(x=>x.nid===v.nid&&x.id!==id))er.nid='এই NID ইতিমধ্যে এন্ট্রি করা আছে';
  FIELDS.forEach(f=>{$('#e_'+f.k).textContent=er[f.k]||'';$('#f_'+f.k).classList.toggle('bad',!!er[f.k])});
  const ks=Object.keys(er);if(ks.length){$('#f_'+ks[0]).focus();toast('ফর্মের ত্রুটি সংশোধন করুন');return}
  if(rec){const i=cur.findIndex(x=>x.id===id);if(i<0){toast('রেকর্ড পাওয়া যায়নি');return}cur[i]=Object.assign({},cur[i],v,{updated:Date.now()});
   if(DB.save(cur)){toast('আপডেট হয়েছে');setTimeout(()=>location.href='records.html',700)}}
  else{cur.push(Object.assign({id:uid(),created:Date.now()},v));if(DB.save(cur)){toast('সংরক্ষণ হয়েছে ✓');set(null);$('#sn').value=cur.length+1;$('#f_nameBn').focus()}}}}

function records(m){const S={q:'',sort:'sn',bank:'',min:'',max:''};
 m.innerHTML=`<h1>রেকর্ডস</h1><div class="tools"><div class="sb">${ic('search')}<input id="q" type="search" placeholder="নাম, NID, মোবাইল, হিসাব নম্বর… দিয়ে খুঁজুন"></div>
 <select id="so"><option value="sn">ক্রম: পুরনো আগে</option><option value="snd">ক্রম: নতুন আগে</option><option value="name">নাম (অ-হ)</option><option value="ah">সম্মানী: বেশি→কম</option><option value="al">সম্মানী: কম→বেশি</option><option value="dob">জন্ম তারিখ</option></select>
 <select id="bk"></select><input id="mn" inputmode="decimal" placeholder="সর্বনিম্ন টাকা"><input id="mx" inputmode="decimal" placeholder="সর্বোচ্চ টাকা"></div>
 <p class="cnt" id="cn"></p><div id="out"></div>`;
 const draw=()=>{const all=DB.all().map((x,i)=>Object.assign({},x,{s:i+1}));
  const banks=[...new Set(all.map(x=>(x.bank||'').trim()).filter(Boolean))].sort();
  $('#bk').innerHTML='<option value="">সব ব্যাংক</option>'+banks.map(b=>`<option ${b===S.bank?'selected':''} value="${esc(b)}">${esc(b)}</option>`).join('');
  const q=en(S.q).toLowerCase().trim(),mn=S.min===''?null:+en(S.min),mx=S.max===''?null:+en(S.max);
  let r=all.filter(x=>(!q||(x.s+' '+FIELDS.map(f=>x[f.k]).join(' ')).toLowerCase().includes(q))&&(!S.bank||(x.bank||'').trim()===S.bank)&&(mn==null||isNaN(mn)||(+x.amount||0)>=mn)&&(mx==null||isNaN(mx)||(+x.amount||0)<=mx));
  const A=(x)=>+x.amount||0,so={sn:(a,b)=>a.s-b.s,snd:(a,b)=>b.s-a.s,name:(a,b)=>(a.nameBn||'').localeCompare(b.nameBn||'','bn'),ah:(a,b)=>A(b)-A(a),al:(a,b)=>A(a)-A(b),dob:(a,b)=>(a.dob||'9').localeCompare(b.dob||'9')};
  r.sort(so[S.sort]);const tot=r.reduce((s,x)=>s+A(x),0);
  $('#cn').textContent=`${r.length} টি রেকর্ড (মোট ${all.length}) · মোট সম্মানী ${money(tot)}`;
  if(!r.length){$('#out').innerHTML=`<div class="card">${all.length?empty('কোনো ফলাফল পাওয়া যায়নি'):empty('এখনও কোনো রেকর্ড নেই','entry.html')}</div>`;return}
  const btn=x=>`<button class="btn sm o" data-a="v" data-id="${x.id}" title="দেখুন">${ic('eye')}</button><button class="btn sm o" data-a="e" data-id="${x.id}" title="সম্পাদনা">${ic('edit')}</button><button class="btn sm" data-a="d" data-id="${x.id}" title="মুছুন">${ic('trash')}</button>`;
  $('#out').innerHTML=`<div class="tw"><table><thead><tr><th>ক্রম</th><th>নাম</th><th>NID</th><th>মোবাইল</th><th>ব্যাংক</th><th>হিসাব নং</th><th style="text-align:right">সম্মানী</th><th></th></tr></thead><tbody>${r.map(x=>`<tr><td>${x.s}</td><td><b>${esc(x.nameBn)}</b><br><small>${esc(x.nameEn)}</small></td><td>${esc(x.nid)}</td><td>${esc(x.mobile)}</td><td>${esc(x.bank)}</td><td>${esc(x.acc)}</td><td class="num">${money(x.amount)}</td><td class="a">${btn(x)}</td></tr>`).join('')}</tbody></table></div>
  <div class="cards">${r.map(x=>`<div class="rc"><div class="h"><span class="sn">${x.s}</span><strong>${esc(x.nameBn)}</strong><b>${money(x.amount)}</b></div>${x.nameEn?`<p><span>ইংরেজি</span>${esc(x.nameEn)}</p>`:''}<p><span>NID</span>${esc(x.nid)||'—'}</p><p><span>মোবাইল</span>${esc(x.mobile)||'—'}</p><p><span>ব্যাংক</span>${esc(x.bank)||'—'}</p><div class="acts">${btn(x)}</div></div>`).join('')}</div>`};
 draw();
 $('#q').oninput=e=>{S.q=e.target.value;draw()};$('#so').onchange=e=>{S.sort=e.target.value;draw()};$('#bk').onchange=e=>{S.bank=e.target.value;draw()};
 $('#mn').oninput=e=>{S.min=e.target.value;draw()};$('#mx').oninput=e=>{S.max=e.target.value;draw()};
 m.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const all=DB.all(),i=all.findIndex(x=>x.id===b.dataset.id);if(i<0)return;const x=all[i],a=b.dataset.a;
  if(a==='e')location.href='entry.html?edit='+x.id;
  if(a==='v'){const o=modal(`<div class="mh"><h3>বিস্তারিত তথ্য</h3><button class="btn sm o" data-x>${ic('x')}</button></div><div class="dl"><div><small>ক্রম</small>${i+1}</div>${FIELDS.map(f=>`<div class="${f.t==='textarea'?'f':''}"><small>${f.l}</small>${f.k==='dob'?esc(fdate(x.dob)):f.k==='amount'?money(x.amount):esc(x[f.k])||'—'}</div>`).join('')}</div><div class="acts"><a class="btn" href="entry.html?edit=${x.id}">${ic('edit')} সম্পাদনা</a></div>`)}
  if(a==='d'){const o=modal(`<div class="mh"><h3>মুছে ফেলবেন?</h3></div><p><b>${esc(x.nameBn)}</b> এর রেকর্ডটি স্থায়ীভাবে মুছে যাবে এবং ক্রম নম্বর পুনর্বিন্যাস হবে।</p><div class="acts"><button class="btn" id="yes">${ic('trash')} হ্যাঁ, মুছুন</button><button class="btn o" data-x>বাতিল</button></div>`);
   $('#yes',o).onclick=()=>{const c=DB.all().filter(y=>y.id!==x.id);if(DB.save(c)){o.close();toast('মুছে ফেলা হয়েছে');draw()}}}}}

function exportPage(m){const r=DB.all();
 m.innerHTML=`<h1>এক্সপোর্ট</h1><div class="card"><div class="opt"><div class="fg"><label>ডকুমেন্টের শিরোনাম (ওয়ার্ড)</label><input id="ti" value="সম্মানী প্রাপকদের তালিকা"></div><div class="fg"><label>ওয়ার্ড পেজ ওরিয়েন্টেশন (লিগ্যাল)</label><select id="or"><option value="l">ল্যান্ডস্কেপ (১৪″ × ৮.৫″)</option><option value="p">পোর্ট্রেট (৮.৫″ × ১৪″)</option></select></div></div><p class="cnt" style="margin-top:12px">মোট রেকর্ড: <b>${r.length}</b> · সব ক্ষেত্রে মার্জিন ০.৫″</p></div>
 <div class="ex"><div class="card"><span class="big">${ic('sheet')}</span><h2>Excel (.xlsx)</h2><p>সব ১৬টি কলামসহ স্প্রেডশিট, শেষে মোট সম্মানী। NID/হিসাব নম্বর টেক্সট হিসেবে সংরক্ষিত।</p><button class="btn" id="xl">${ic('download')} Excel ডাউনলোড</button></div>
 <div class="card"><span class="big">${ic('doc')}</span><h2>Word (.doc)</h2><p>লিগ্যাল পেজ সাইজ, চারদিকে ০.৫″ মার্জিন, টেবিল আকারে।</p><button class="btn" id="wd">${ic('download')} Word ডাউনলোড</button></div>
 <div class="card"><span class="big">${ic('shield')}</span><h2>ব্যাকআপ (JSON)</h2><p>সব ডেটার ব্যাকআপ নিন বা আগের ব্যাকআপ পুনরুদ্ধার করুন।</p><div class="acts" style="margin:0"><button class="btn o" id="bk">${ic('download')} ব্যাকআপ</button><button class="btn o" id="rt">${ic('upload')} রিস্টোর</button></div><input type="file" id="fi" accept=".json,application/json" hidden></div></div>`;
 const get=()=>{const d=DB.all();if(!d.length){toast('এক্সপোর্ট করার মতো কোনো ডেটা নেই');return null}return d};
 const val=(x,f)=>f.k==='dob'?fdate(x.dob):x[f.k]==null?'':String(x[f.k]);
 const dl=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)};
 $('#xl').onclick=()=>{const d=get();if(!d)return;if(typeof XLSX==='undefined'){toast('Excel লাইব্রেরি লোড হয়নি। ইন্টারনেট সংযোগ দিয়ে পেজ রিফ্রেশ করুন।');return}
  try{const head=['ক্রম',...FIELDS.map(f=>f.l)];
   const rows=d.map((x,i)=>[i+1,...FIELDS.map(f=>f.k==='amount'?(x.amount===''||x.amount==null?'':+x.amount):val(x,f))]);
   const ai=head.indexOf('সম্মানীর পরিমান'),tr=head.map(()=>'');tr[ai-1]='মোট';tr[ai]=d.reduce((s,x)=>s+(+x.amount||0),0);rows.push(tr);
   const ws=XLSX.utils.aoa_to_sheet([head,...rows]);ws['!cols']=[6,22,22,20,20,18,13,26,18,22,12,26,15,14,24,24].map(w=>({wch:w}));
   const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Data');XLSX.writeFile(wb,'data-entry-'+stamp()+'.xlsx');toast('Excel ডাউনলোড শুরু হয়েছে')}catch(e){toast('Excel তৈরিতে সমস্যা হয়েছে')}};
 $('#wd').onclick=()=>{const d=get();if(!d)return;const L=$('#or').value==='l',W=[3,8,8,6,6,7,5.5,8,6,8,5,7,6,5.5,5.5,5.5];
  const head=['ক্রম',...FIELDS.map(f=>f.l)],tot=d.reduce((s,x)=>s+(+x.amount||0),0);
  const row=(x,i)=>`<tr><td align="center">${i+1}</td>${FIELDS.map(f=>`<td${f.k==='amount'?' align="right"':''}>${esc(f.k==='amount'&&x.amount!==''?(+x.amount).toLocaleString('en-IN',{maximumFractionDigits:2}):val(x,f))}</td>`).join('')}</tr>`;
  const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Export</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>@page Section1{size:${L?'14in 8.5in':'8.5in 14in'};${L?'mso-page-orientation:landscape;':''}margin:0.5in 0.5in 0.5in 0.5in;mso-header-margin:0.3in;mso-footer-margin:0.3in}div.Section1{page:Section1}
body{font-family:'Nirmala UI','SolaimanLipi','Noto Sans Bengali',Arial,sans-serif}h2{text-align:center;font-size:14pt;margin:0 0 4pt}p.s{text-align:center;font-size:9pt;margin:0 0 8pt}
table{border-collapse:collapse;width:100%;table-layout:fixed}th,td{border:1px solid #000;padding:2px 3px;font-size:${L?8:6}pt;vertical-align:top;word-wrap:break-word}th{background:#d9d9d9;font-weight:bold;text-align:center}</style></head><body><div class="Section1">
<h2>${esc($('#ti').value.trim()||'তালিকা')}</h2><p class="s">মোট এন্ট্রি: ${d.length} | মোট সম্মানী: ${tot.toLocaleString('en-IN',{maximumFractionDigits:2})} টাকা | তারিখ: ${fdate(new Date().toISOString().slice(0,10))}</p>
<table><colgroup>${W.map(w=>`<col width="${w}%" style="width:${w}%">`).join('')}</colgroup><thead><tr>${head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${d.map(row).join('')}
<tr><td colspan="13" align="right"><b>মোট</b></td><td align="right"><b>${tot.toLocaleString('en-IN',{maximumFractionDigits:2})}</b></td><td colspan="2"></td></tr></tbody></table></div></body></html>`;
  dl(new Blob(['\ufeff'+html],{type:'application/msword'}),'data-entry-'+stamp()+'.doc');toast('Word ডাউনলোড শুরু হয়েছে')};
 $('#bk').onclick=()=>{const d=get();if(d)dl(new Blob([JSON.stringify(d,null,1)],{type:'application/json'}),'backup-'+stamp()+'.json')};
 $('#rt').onclick=()=>$('#fi').click();
 $('#fi').onchange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{try{const a=JSON.parse(rd.result);if(!Array.isArray(a)||a.some(x=>!x||typeof x!=='object'))throw 0;
  const o=modal(`<div class="mh"><h3>রিস্টোর নিশ্চিত করুন</h3></div><p>বর্তমান ডেটা মুছে ${a.length} টি রেকর্ড প্রতিস্থাপিত হবে।</p><div class="acts"><button class="btn" id="ok">${ic('check')} নিশ্চিত</button><button class="btn o" data-x>বাতিল</button></div>`);
  $('#ok',o).onclick=()=>{a.forEach(x=>{if(!x.id)x.id=uid()});if(DB.save(a)){o.close();toast('রিস্টোর সম্পন্ন');setTimeout(()=>location.reload(),700)}}}catch(x){toast('অবৈধ ব্যাকআপ ফাইল')}};rd.readAsText(f);e.target.value=''}}
document.addEventListener('DOMContentLoaded',shell);
