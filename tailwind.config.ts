import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		colors: {
  			'auth-purple': '#303091',
  			'police-blue': '#0044CC'
  		},
  		rotate: {
  			'-55': '-55deg'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},

		animation: {
			slideIn: 'slideIn 0.5s ease-in-out forwards',
			slideOut: 'slideOut 0.5s ease-in-out forwards',
		},

		boxShadow: {
			'custom-blue': '0px 20px 75px rgba(0, 68, 204, 0.3)', //defult
			'middle-custom-blue': '0px 0px 75px rgba(0, 68, 204, 0.3)',
			'top-custom-blue': '0px -20px 75px rgba(0, 68, 204, 0.3)',
			'bottom-custom-blue': '0px 40px 75px rgba(0, 68, 204, 0.3)',
			'left-custom-blue': '-25px 0px 75px rgba(0, 68, 204, 0.2)',
			'right-custom-blue': '25px 00px 75px rgba(0, 68, 204, 0.2)'
			// 					   x	y
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
