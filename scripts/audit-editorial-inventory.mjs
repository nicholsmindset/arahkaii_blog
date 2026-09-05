// Read-only portfolio evidence. Signals flag editorial review; they do not prove claims.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';
import sharp from 'sharp';
const destination = process.argv[2] ?? 'docs/audits/2026-09-05';
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e => e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const posts = [];
for (const file of walk('src/content/posts').filter(f=>/\.mdx?$/.test(f)).sort()) {
 const {data:d,content:b} = matter(fs.readFileSync(file,'utf8'));
 const slug=path.basename(file).replace(/\.mdx?$/,'');
 const url=`/${d.category}/${slug}/`;
 const external=[...new Set([...b.matchAll(/https?:\/\/[^\s<>"')]+/g)].map(m=>m[0]).filter(u=>!new URL(u).hostname.endsWith('arahkaii.com')))];
 const internal=[...new Set([...b.matchAll(/(?:\]\(|href=["'])(\/[^\s)#?"']+)/g)].map(m=>m[1].replace(/\/?$/,'/')).filter(u=>u!==url))];
 const state=d.draft?'draft':d.noindex?'noindex':new Date(d.date)>new Date()?'scheduled':'indexable';
 let image={};try { const m=await sharp(path.resolve(path.dirname(file),d.heroImage)).metadata();image={width:m.width,height:m.height};}catch{}
 const prose=b.replace(/^import .*$/gm,'').replace(/<[^>]*>/g,' ').replace(/\[[^\]]+\]\([^)]+\)/g,m=>m.slice(1,m.indexOf(']')));
 const history=execFileSync('git',['log','--follow','--format=%h %ad %s','--date=short','--',file],{encoding:'utf8'}).trim().split('\n');
 posts.push({file,slug,url,title:d.title,standfirst:d.standfirst,category:d.category,author:d.author,date:d.date,updatedDate:d.updatedDate??null,state,words:prose.split(/\s+/).filter(Boolean).length,heroCredit:d.heroCredit,image,method:d.method??'',sources:d.sources??[],lastVerified:d.lastVerified??null,external,internal,cluster:d.cluster??'',franchise:d.franchise??'',tags:d.tags??[],faqCount:d.faq?.length??0,listCount:d.listItems?.length??0,history,headings:[...b.matchAll(/^#{2,3}\s+(.+)$/gm)].map(m=>m[1]),opening:prose.trim().slice(0,700),evidencePassages:prose.split(/\n\n/).filter(p=>/\b(?:study|research|million|billion|trillion|professor|Dr\.|interview|we tested|we visited|told us|according to|survey|percent|\d+%)/i.test(p)).map(p=>p.trim()).slice(0,5)});
}
for (const p of posts) p.inbound=posts.filter(q=>q.state==='indexable'&&q.internal.includes(p.url)).map(q=>q.url);
const authors=walk('src/content/authors').map(file=>({file,...matter(fs.readFileSync(file,'utf8')).data}));
const count=key=>Object.fromEntries([...new Set(posts.map(p=>p[key]))].map(v=>[v,posts.filter(p=>p[key]===v).length]));
const indexable=posts.filter(p=>p.state==='indexable');
const summary={capturedAt:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),total:posts.length,states:count('state'),categories:count('category'),indexableCategories:Object.fromEntries([...new Set(indexable.map(p=>p.category))].map(c=>[c,indexable.filter(p=>p.category===c).length])),indexableWithMethod:indexable.filter(p=>p.method).length,indexableWithSourceRecord:indexable.filter(p=>p.sources.length).length,indexableWithNoContextualInbound:indexable.filter(p=>!p.inbound.length).length,indexableImagesBelow1200:indexable.filter(p=>p.image.width<1200).length,indexableGenericCredit:indexable.filter(p=>p.heroCredit==='Arahkaii').length};
fs.mkdirSync(destination,{recursive:true});fs.writeFileSync(`${destination}/content-inventory.json`,JSON.stringify({summary,authors,posts},null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
for(const p of posts) console.log(JSON.stringify({slug:p.slug,title:p.title,category:p.category,state:p.state,words:p.words,method:p.method,sources:p.sources.length,external:p.external.length,inbound:p.inbound.length,width:p.image.width}));
