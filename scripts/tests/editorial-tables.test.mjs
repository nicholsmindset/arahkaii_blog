import test from 'node:test';
import assert from 'node:assert/strict';
import editorialTables from '../rehype-editorial-tables.mjs';
const el=(tagName,children=[],properties={})=>({type:'element',tagName,properties,children});
const txt=(value)=>({type:'text',value});
const fixture=(columns=3)=>({type:'root',children:[el('table',[
	el('thead',[el('tr',Array.from({length:columns},(_,i)=>el('th',[txt(`Heading ${i}`)])))]),
	el('tbody',[el('tr',Array.from({length:columns},(_,i)=>el('td',[txt(`Value ${i}`)])))])
])]});

test('mobile table retains semantic roles, header associations and original values',()=>{
	const tree=fixture();editorialTables()(tree);
	const table=tree.children[0].children[0];
	assert.equal(table.properties.role,'table');
	assert.ok(table.properties.className.includes('editorial-comparison--stack'));
	const header=table.children.find(n=>n.tagName==='thead').children[0].children[1];
	const cell=table.children.find(n=>n.tagName==='tbody').children[0].children[1];
	assert.equal(header.properties.scope,'col');
	assert.equal(cell.properties.headers,header.properties.id);
	assert.equal(cell.children[0].properties.ariaHidden,'true');
	assert.equal(cell.children[1].value,'Value 1');
});
test('wide comparisons get a keyboard-accessible scroll region',()=>{
	const tree=fixture(6);editorialTables()(tree);
	assert.equal(tree.children[0].properties.role,'region');
	assert.equal(tree.children[0].properties.tabIndex,0);
	assert.ok(!tree.children[0].children[0].properties.className.includes('editorial-comparison--stack'));
});
test('multiple tables have distinct header IDs and keep existing captions',()=>{
	const tree=fixture();tree.children.push(fixture().children[0]);
	tree.children[0].children.unshift(el('caption',[txt('Evidence comparison')]));
	editorialTables()(tree);
	const tables=tree.children.map(n=>n.children[0]);
	assert.equal(tables[0].children.filter(n=>n.tagName==='caption').length,1);
	assert.equal(tables[0].children[0].children[0].value,'Evidence comparison');
	assert.notEqual(tables[0].children[1].children[0].children[0].properties.id,
		tables[1].children[1].children[0].children[0].properties.id);
});
