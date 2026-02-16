/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{astro,html,js,ts,jsx,tsx,vue,svelte}"
    ],
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif']
            }
        }
    },
    plugins: [],
}
