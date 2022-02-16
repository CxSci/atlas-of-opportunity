import { createTheme } from '@mui/material'
import { amber, deepOrange, grey } from '@mui/material/colors'

const initTheme = darkMode =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3DBEFF'
      },

      ...(!darkMode
        ? {
            // palette values for light mode
            text: {
              primary: '#333333',
              secondary: grey[800]
            },
            background: { default: '#fff' }
          }
        : {
            // palette values for dark mode
            text: {
              primary: '#fff',
              secondary: grey[500]
            },
            background: {
              default: grey[900],
              paper: grey[900]
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
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '100px',
            boxShadow: 'none',
            textTransform: 'none'
          }
        }
      },

      header: {
        height: '60px',
        scrolledHeight: '84px',
        paddingX: '14px',
        paddingY: '10px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)'
      },

      sidebar: {
        width: '300px'
      }
    }
  })

export default initTheme
