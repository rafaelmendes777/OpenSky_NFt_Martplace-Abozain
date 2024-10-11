import 'tailwindcss/tailwind.css'


import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

import '/public/assets/css/marketplace.css'

import { useState, createContext } from "react";
import Web3Provider from '../components/web3';
export const ThemeContext = createContext()

export default function MyApp({ Component, pageProps }) {
  const [themeMode, setThemeMode] = useState(true)

  function toggleThemeMode(mode) {
    setThemeMode(mode)

    themeMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')
  }

  return (
    <ThemeContext.Provider value={{ themeMode:themeMode, toggleThemeMode:toggleThemeMode }}>
     <Web3Provider>
      <Component {...pageProps} />
      </Web3Provider>
    </ThemeContext.Provider>
  )
}
