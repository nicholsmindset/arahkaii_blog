// Make plain Markdown tables a shared editorial component at build time.
// Keep the semantic table and its content intact; no client JavaScript is needed.
const text = (node) => node.type === 'text' ? node.value : (node.children || []).map(text).join('');
const element = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });

export default function editorialTables(start = 0) {
	return (tree) => {
		let count = start;
		const visit = (parent) => {
			if (!parent.children) return;
			for (let index = 0; index < parent.children.length; index++) {
				const node = parent.children[index];
				if (node.type !== 'element' || node.tagName !== 'table') { visit(node); continue; }
				const head = node.children.find((child) => child.tagName === 'thead');
				const row = head?.children.find((child) => child.tagName === 'tr');
				const headers = row?.children.filter((child) => child.tagName === 'th') || [];
				const body = node.children.find((child) => child.tagName === 'tbody');
				const rows = body?.children.filter((child) => child.tagName === 'tr') || [];
				const simple = headers.length >= 2 && headers.length <= 4 && rows.length > 0 && rows.every((r) => {
					const cells = r.children.filter((child) => child.tagName === 'td');
					return cells.length === headers.length && cells.every((cell) => !cell.properties?.colSpan && !cell.properties?.rowSpan);
				});
				const id = `editorial-comparison-${++count}`;
				node.properties ||= {};
				node.properties.className = [...(node.properties.className || []), 'editorial-comparison', ...(simple ? ['editorial-comparison--stack'] : [])];
				node.properties.role = 'table';
				if (!node.children.some((child) => child.tagName === 'caption')) {
					node.children.unshift(element('caption', {}, [{ type: 'text', value: 'At a glance' }]));
				}
				head && (head.properties = { ...head.properties, role: 'rowgroup' });
				body && (body.properties = { ...body.properties, role: 'rowgroup' });
				if (row) row.properties = { ...row.properties, role: 'row' };
				headers.forEach((header, column) => {
					header.properties = { ...header.properties, id: `${id}-column-${column}`, scope: 'col', role: 'columnheader' };
				});
				rows.forEach((r) => {
					r.properties = { ...r.properties, role: 'row' };
					r.children.filter((child) => child.tagName === 'td').forEach((cell, column) => {
						cell.properties = { ...cell.properties, role: 'cell', ...(headers[column] ? { headers: `${id}-column-${column}` } : {}) };
						if (simple) cell.children.unshift(element('span', { className: ['editorial-comparison__label'], ariaHidden: 'true' }, [{ type: 'text', value: text(headers[column]).trim() }]));
					});
				});
				parent.children[index] = element('div', { className: ['editorial-table-wrap'], ...(!simple ? { tabIndex: 0, role: 'region', ariaLabel: 'Scrollable comparison table' } : {}) }, [node]);
			}
		};
		visit(tree);
	};
}

// Astro 7's native processor uses explicit visitors rather than rehype callbacks.
export function satteriEditorialTables() {
	return {
		name: 'editorial-tables',
		element: {
			filter: ['table'],
			visit(node, context) {
				const count = Number(context.data.editorialTableCount || 0);
				context.data.editorialTableCount = count + 1;
				const root = { type: 'root', children: [JSON.parse(JSON.stringify(node))] };
				editorialTables(count)(root);
				return root.children[0];
			},
		},
	};
}
