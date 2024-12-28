import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ColorModeScript } from '@chakra-ui/react'
import './index.css'
import {mode} from "@chakra-ui/theme-tools"
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
const styles={
  global:(props)=>({
    body:{
      color:mode('gray.800','whiteAlpha.900')(props),
      bg:mode('white','#101010')(props)
    }
  })
}
const config={
  initialColorMode:"dark",
  useSystemColorMode:true
}
const colors={
  gray:{
    light:"#616161",
    dark:"#302f2f"
  }
}
const theme=extendTheme({config,colors,styles})
createRoot(document.getElementById('root')).render(
 
    <RecoilRoot>

    <BrowserRouter>
    <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
    </ChakraProvider>
    </BrowserRouter>
    </RecoilRoot>

)
