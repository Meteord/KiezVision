/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				eb: {
					50: "#FFFEF8",
					900: "#171B4D",
				},
				coral: {
					100: "#FFDD4A",
					500: "#F02314",
				},
				tsb: "#2430A0",
				header: "#D9DDFF",
				kv: {
					chrome: "#E7E9F7",
				},
				gray: {
					750: "#2d3748",
					850: "#1a202c",
					950: "#0d1117",
				},
			},
			fontFamily: {
				sans: ['"Host Grotesk"', "Arial", "sans-serif"],
				display: ['"Host Grotesk"', "Arial", "sans-serif"],
				mono: ['"Host Grotesk"', "ui-monospace", "monospace"],
			},
		},
	},
	plugins: [],
};
