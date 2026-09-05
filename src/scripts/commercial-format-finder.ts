function initialiseFormatFinder() {
	const root = document.querySelector<HTMLElement>('[data-format-finder]');
	if (!root || root.dataset.ready) return;
	const picker = root.querySelector<HTMLFieldSetElement>('[data-format-picker]')!;
	const panels = [...root.querySelectorAll<HTMLElement>('[data-format-panel]')];
	const show = (announce = false) => {
		const selected = picker.querySelector<HTMLInputElement>('input:checked');
		if (!selected || !panels.some((panel) => panel.dataset.formatPanel === selected.value)) return;
		panels.forEach((panel) => { panel.hidden = panel.dataset.formatPanel !== selected.value; });
		if (announce) root.querySelector('[data-format-status]')!.textContent = `Showing ${selected.closest('label')!.querySelector('strong')!.textContent?.toLowerCase()}.`;
	};
	picker.addEventListener('change', () => show(true));
	show(); picker.hidden = false; root.dataset.ready = 'true';
}
document.addEventListener('astro:page-load', initialiseFormatFinder);
initialiseFormatFinder();
