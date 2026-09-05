import test from 'node:test';
import assert from 'node:assert/strict';
import { selectHomepage } from '../../src/lib/homepage.ts';
const card=(id,category,date)=>({id,category,date:new Date(date)});
test('a sparse dining or travel desk never receives fashion fillers',()=>{
 const cards=[card('style-1','style','2026-09-05'),card('dining-1','dining','2026-08-01'),card('style-2','style','2026-09-04')];
 const h=selectHomepage(cards);assert.deepEqual(h.dining.map(c=>c.id),['dining-1']);assert.deepEqual(h.travel,[]);
});
test('the newest story remains discoverable even when also used as the cover',()=>{
 const cards=Array.from({length:8},(_,i)=>card(`story-${i}`,'style',`2026-09-${String(i+1).padStart(2,'0')}`));
 const h=selectHomepage(cards);assert.equal(h.cover.id,'story-7');assert.equal(h.latest.length,6);assert.equal(h.latest[0].id,h.cover.id);assert.deepEqual(h.latest.map(c=>c.id),['story-7','story-6','story-5','story-4','story-3','story-2']);assert.equal(cards[0].id,'story-0');
});
test('an empty publication produces no fabricated cover or desk cards',()=>{
 const h=selectHomepage([]);assert.equal(h.cover,undefined);assert.deepEqual(h.latest,[]);assert.deepEqual(h.culture,[]);
});
