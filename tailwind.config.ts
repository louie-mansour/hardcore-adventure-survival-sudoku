import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

const black = colors.black
const white = colors.white

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        page: {
          outside: {
            light: colors.yellow[50],
          },
          inside: {
            light: white,
          },
          title: {
            light: black,
          },
          text: {
            light: black,
          }
        },
        sudoku: {
          text: {
            light: black,
          },
          lines: {
            light: black,
          },
          selected: {
            light: colors.blue[500],
          },
          highlight: {
            light: colors.blue[100],
          },
          mistake: {
            light: colors.red[500],
          },
          hint: {
            light: colors.green[500],
          },
          cell: {
            light: colors.transparent,
          },
          draft: {
            light: black,
          }
        },
        numbers: {
          text: {
            light: black,
          }
        },
        draft: {
          text: {
            light: black,
          },
          selected: {
            light: colors.blue[300],
          },
          unselected: {
            light: colors.transparent,
          }
        },
        toolbox: {
          text: {
            light: black,
          }
        },
      }
    }
  },
  plugins: [],
};

export default config;
