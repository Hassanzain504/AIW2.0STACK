/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0E1013",
        panel: "#161A1F",
        edge: "#232830",
        bone: "#E8E3D9",
        muted: "#7A8290",
        signal: "#F0552B",
        clear: "#39D98A",
        watch: "#F5B342",
        ghost: "#3A424D",
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
