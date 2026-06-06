// Tailwind v4 via PostCSS. The @tailwindcss/vite plugin currently breaks
// Astro 6's rolldown-bundled build (withastro/astro#16542); the PostCSS
// integration is the supported fallback.
import tailwindcss from '@tailwindcss/postcss';

export default {
	plugins: [tailwindcss()],
};
