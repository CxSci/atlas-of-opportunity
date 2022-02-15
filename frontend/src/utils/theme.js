import { createTheme } from '@mui/material'
import { amber, deepOrange, grey } from '@mui/material/colors'

const initTheme = darkMode =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',

      ...(!darkMode
        ? {
            // palette values for light mode
            primary: amber,
            divider: amber[200],
            text: {
              primary: grey[900],
              secondary: grey[800]
            },
            background: { default: '#fff' }
          }
        : {
            // palette values for dark mode
            primary: deepOrange,
            divider: deepOrange[700],
            background: {
              default: deepOrange[900],
              paper: deepOrange[900]
            },
            text: {
              primary: '#fff',
              secondary: grey[500]
            }
          })
    },
    typography: {},
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {}
        }
      },
      header: {
        height: '60px',
        paddingX: '14px',
        paddingY: '10px',
        boxShadow: ''
      }
    }
  })

export default initTheme
