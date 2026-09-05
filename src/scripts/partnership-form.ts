import { ROUTES, STORY_CALLS, DESK_EMAIL, validateBrief, formatBrief, type PartnershipBrief, type PartnershipRoute } from '../lib/partnerships';

function initialisePartnershipForm() {
	const root = document.querySelector<HTMLElement>('[data-partnership-form-root]');
	const form = root?.querySelector<HTMLFormElement>('#partnership-form');
	if (!root || !form || form.dataset.ready) return;
	form.dataset.ready = 'true'; form.hidden = false;
	const steps = [...form.querySelectorAll<HTMLElement>('[data-form-step]')];
	const next = form.querySelector<HTMLButtonElement>('[data-next]')!;
	const back = form.querySelector<HTMLButtonElement>('[data-back]')!;
	const errorBox = form.querySelector<HTMLElement>('[data-form-error]')!;
	let deliveryEnabled = root.dataset.deliveryEnabled === 'true';
	let step = 0;
	let pending = false;
	let brief: PartnershipBrief | undefined;
	let submissionId = `ara-${crypto.randomUUID()}`;
	let uncertainDelivery = false;
	const fields = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | RadioNodeList;
	const input = () => ({ ...Object.fromEntries(new FormData(form)), consent: (fields('consent') as HTMLInputElement).checked, rights: (fields('rights') as HTMLInputElement).checked });
	const tell = (message: string) => { errorBox.textContent = message; errorBox.hidden = false; };
	const route = () => (fields('route').value || 'pitch') as PartnershipRoute;
	const updateRoute = () => {
		const chosen = route();
		form.querySelector('[data-route-note]')!.textContent = ROUTES[chosen].note;
		form.querySelector<HTMLElement>('[data-paid-field]')!.hidden = chosen !== 'paid';
		(fields('budget') as HTMLInputElement).disabled = chosen !== 'paid';
		form.querySelector('[data-story-hint]')!.textContent = chosen === 'paid'
			? 'Tell us the idea, intended reader and what you want the work to achieve.'
			: 'What do you do, what makes it specific, and what could a reader learn?';
		const call = STORY_CALLS.find((call) => call.id === fields('call').value);
		const selected = form.querySelector<HTMLElement>('[data-selected-call]')!;
		selected.hidden = !call || chosen === 'paid'; selected.textContent = call ? `Responding to: ${call.title}` : '';
		if (chosen === 'paid') fields('call').value = '';
	};
	const showStep = (value: number, focus = true) => {
		step = value; steps.forEach((el, index) => { el.hidden = index !== step; });
		back.hidden = step === 0;
		next.textContent = step < 2 ? 'Continue →' : (uncertainDelivery ? 'Check delivery by email ↗' : deliveryEnabled ? 'Send brief to the desk ↗' : 'Open email draft ↗');
		form.querySelector('[data-step-label]')!.textContent = `0${step + 1} / ${['The story', 'The details', 'Your review'][step]}`;
		form.querySelectorAll('[data-step-marker]').forEach((el, index) => { if (index === step) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current'); });
		if (focus) {
			const target = steps[step].querySelector<HTMLElement>('h3, input, textarea');
			target?.focus({ preventScroll: true });
			root.scrollIntoView({ behavior: 'instant', block: 'start' });
		}
	};
	const clearErrors = () => { errorBox.hidden = true; form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => { el.hidden = true; }); form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid')); };
	const displayErrors = (errors: Record<string, string>, currentOnly = false) => {
		let first: HTMLElement | undefined;
		for (const [name, message] of Object.entries(errors)) {
			const field = form.querySelector<HTMLElement>(`[name="${name}"]`);
			if (currentOnly && !steps[step].contains(field)) continue;
			const output = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
			if (output) { output.textContent = message; output.hidden = false; }
			field?.setAttribute('aria-invalid', 'true');
			if (field) first ??= field;
		}
		if (first) {
			const targetStep = steps.findIndex((el) => el.contains(first!));
			if (targetStep !== step && targetStep >= 0) showStep(targetStep, false);
			const details = first.closest('details'); if (details) details.open = true;
			tell('Please check the highlighted fields.'); first.focus(); return false;
		}
		return true;
	};
	const renderReview = () => {
		if (!brief) return;
		const review = form.querySelector('[data-brief-review]')!; review.replaceChildren();
		const call = STORY_CALLS.find((call) => call.id === brief!.call);
		const rows: Array<[string, string]> = [
			['Your route', ROUTES[brief.route].name], ['Brand / organisation', brief.brand], ['Your story / brief', brief.story],
			...(call ? [['Story prompt', call.title] as [string, string]] : []),
			['Website / handle', brief.website], ['Contact', `${brief.name} · ${brief.email}`], ['Location', brief.location],
			['People, access & evidence', brief.access || 'To discuss'], ['Timing / embargo', brief.timing || 'Not specified'],
			...(brief.route === 'paid' ? [['Indicative budget', brief.budget || 'To discuss'] as [string, string]] : []),
			...(brief.assets ? [['Materials for review', brief.assets] as [string, string]] : []),
			...(brief.assets || brief.credits ? [['Credits / restrictions', brief.credits || 'To confirm before publication'] as [string, string]] : []),
			['Consent', 'Review and reply only. Publication permissions are agreed separately.'],
		];
		for (const [label, value] of rows) {
			const row = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd');
			dt.textContent = label; dd.textContent = value; row.append(dt, dd); review.append(row);
		}
		const emailLink = form.querySelector<HTMLAnchorElement>('[data-email-brief]')!;
		emailLink.href = emailUrl();
	};
	const emailUrl = () => `mailto:${DESK_EMAIL}?${new URLSearchParams({ subject: `[Arahkaii] ${uncertainDelivery ? 'Delivery check' : ROUTES[brief!.route].name} — ${brief!.brand}`, body: `${formatBrief(brief!)}\n\nReference: ${submissionId}${uncertainDelivery ? '\nOnline delivery could not be confirmed. Please check for this reference before adding another record.' : ''}` }).toString().replace(/\+/g, '%20')}`;
	const download = () => {
		if (!brief) return;
		const blob = new Blob([`${formatBrief(brief)}\n\nReference: ${submissionId}`], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'arahkaii-brief.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
	};
	form.querySelector('[data-download-brief]')!.addEventListener('click', download);
	root.querySelector('[data-download-receipt]')!.addEventListener('click', download);
	form.querySelector('[data-copy-brief]')!.addEventListener('click', async () => {
		const status = form.querySelector('[data-copy-status]')!;
		try { await navigator.clipboard.writeText(`${formatBrief(brief!)}\n\nReference: ${submissionId}`); status.textContent = 'Copied. Paste into your email when ready.'; }
		catch { status.textContent = 'Copy is unavailable in this browser. Download the text file instead.'; }
	});
	back.addEventListener('click', () => { if (!pending) { clearErrors(); showStep(Math.max(0, step - 1)); } });
	form.addEventListener('change', (event) => { if ((event.target as HTMLInputElement).name === 'route') updateRoute(); });
	form.addEventListener('submit', async (event) => {
		event.preventDefault(); if (pending) return; clearErrors();
		const result = validateBrief(input());
		if (step === 0) { if (!result.ok && !displayErrors(result.errors, true)) return; showStep(1); return; }
		if (!result.ok) { displayErrors(result.errors); return; }
		brief = result.brief;
		if (step === 1) { renderReview(); showStep(2); return; }
		if (!deliveryEnabled || uncertainDelivery) { window.location.href = emailUrl(); tell('Your email app should open. Press Send there to contact the desk. If it does not open, copy or download your brief and email onnifyworks@gmail.com.'); return; }
		pending = true; next.disabled = true; back.disabled = true; form.setAttribute('aria-busy', 'true'); next.textContent = 'Sending your brief…';
		try {
			const response = await fetch('/api/partnership/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20_000), body: JSON.stringify({ ...brief, company_fax: fields('company_fax').value, submission_id: submissionId }) });
			const receipt = await response.json();
			if (!response.ok || receipt.ok !== true || receipt.application_id !== submissionId) {
				if (receipt.errors) { displayErrors(receipt.errors); return; }
				if (response.status === 503) deliveryEnabled = false;
				if (response.status >= 500 && response.status !== 503) uncertainDelivery = true;
				tell(receipt.error || 'Delivery could not be confirmed. Keep your brief and email the desk.'); renderReview(); return;
			}
			form.hidden = true;
			const success = root.querySelector<HTMLElement>('[data-receipt]')!; success.hidden = false;
			root.querySelector('[data-receipt-id]')!.textContent = `Your reference: ${submissionId}`;
			success.focus();
		} catch { uncertainDelivery = true; tell('We could not confirm delivery. Your brief is still here. Keep a copy and email the desk with your reference before resending.'); renderReview(); }
		finally { pending = false; next.disabled = false; back.disabled = false; form.removeAttribute('aria-busy'); if (!form.hidden) showStep(step, false); }
	});
	const choose = (selectedRoute?: string | null, callId?: string | null) => {
		if (selectedRoute && Object.hasOwn(ROUTES, selectedRoute)) fields('route').value = selectedRoute;
		fields('call').value = STORY_CALLS.some((call) => call.id === callId) ? callId! : '';
		updateRoute();
	};
	const params = new URLSearchParams(location.search);
	choose(params.get('route'), params.get('call'));
	const referral = params.get('ref') || params.get('utm_campaign') || '';
	fields('referral').value = /^[a-zA-Z0-9_-]{1,100}$/.test(referral) ? referral : '';
	document.querySelectorAll<HTMLAnchorElement>('[data-brief-route]').forEach((link) => {
		link.addEventListener('click', (event) => { if (pending || form.hidden) return; event.preventDefault(); choose(link.dataset.briefRoute, link.dataset.briefCall); clearErrors(); showStep(0, false); document.querySelector('#brief')?.scrollIntoView({ behavior: 'instant' }); (fields('brand') as HTMLInputElement).focus({ preventScroll: true }); });
	});
	showStep(0, false);
}
document.addEventListener('astro:page-load', initialisePartnershipForm);
initialisePartnershipForm();
