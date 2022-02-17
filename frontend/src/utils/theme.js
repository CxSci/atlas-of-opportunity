import { createTheme } from '@mui/material'
import { grey } from '@mui/material/colors'

const buttonHeight = '38px'

const initTheme = darkMode =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3DBEFF',
      },
      secondary: {
        main: '#FDD14D'
      },

      ...(!darkMode
        ? {
            // palette values for light mode
            text: {
              primary: '#333333',
              secondary: grey[800],
            },
            background: { default: '#fff' },
          }
        : {
            // palette values for dark mode
            text: {
              primary: '#fff',
              secondary: '#fff',
            },
            background: {
              default: grey[900],
              paper: grey[900],
            },
          }),
    },

    typography: {
      sectionTitle: {
        weight: 700,
        fontSize: `1rem`,
        lineHeight: 1.2,
        marginBottom: `0.875rem`
      },
      fieldLabel: {
        fontSize: '0.875rem',
        lineHeight: '1rem'
      },
      fieldValue: {
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.2
      }
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {},
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            height: buttonHeight,
            borderRadius: '100px',
            boxShadow: 'none',
            textTransform: 'none',
          },
        },
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          li: {
            fontWeight: 'bold',
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          formControl: {
            height: buttonHeight,
            backgroundColor: darkMode ? '#fff' : '#F2F2F2',
            color: darkMode ? '#666666' : '#2D2D2D',
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            borderRadius: '100px',
            overflow: 'hidden',
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            color: darkMode ? '#666666' : '#2D2D2D',
            paddingLeft: '8px',
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            sectionTitle: 'h6',
            fieldValue: 'p',
            fieldLabel: 'p'
          }
        },
        styleOverrides: {
          gutterBottom: {
            marginBottom: `1rem`
          }
        }
      },

      header: {
        height: '60px',
        scrolledHeight: '84px',
        paddingX: '14px',
        paddingY: '10px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
        bgColor: darkMode ? 'rgba(0, 0, 0, 0.1)' : '#fff',
      },

      searchInput: {
        width: '250px',
      },

      sidebar: {
        width: '300px',
      },
    },
  })

export default initTheme
