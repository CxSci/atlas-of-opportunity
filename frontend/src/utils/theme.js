import { createTheme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'

const buttonHeight = '38px'
const borderRadiusRound = '19px'
const bgLight = '#fff'
const bgHoverLight = '#f2f2f2'
const bgDark = '#2D2D2D'
const bgHoverDark = '#333333'

const initTheme = darkMode =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3DBEFF',
      },
      secondary: {
        main: '#FDD14D',
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
        fontWeight: 700,
        fontSize: `1rem`,
        lineHeight: 1.2,
        marginBottom: `0.875rem`,
      },
      fieldLabel: {
        fontSize: '0.875rem',
        marginBottom: '0.25rem',
        lineHeight: '1rem',
      },
      fieldValue: {
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.25,
      },
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            height: buttonHeight,
            borderRadius: borderRadiusRound,
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
      MuiAutocomplete: {
        styleOverrides: {
          clearIndicator: {
            color: darkMode ? '#666666' : '#2D2D2D',
          },
          input: {
            paddingTop: '0 !important',
            paddingBottom: '0 !important',
          },
          inputRoot: {
            height: buttonHeight,
            backgroundColor: `${bgLight} !important`,
            borderRadius: borderRadiusRound,
            overflow: 'hidden',
            paddingTop: '0',
            paddingBottom: '0',
            '&:hover': {
              backgroundColor: `${bgHoverLight} !important`,
            },
          },
          inputFocused: {
            backgroundColor: 'transparent',
          },
          popper: {
            marginTop: '12px !important',
          },
          paper: {
            borderRadius: borderRadiusRound,
          },
          listbox: {
            backgroundColor: bgLight,
          },
          option: {
            backgroundColor: bgLight,
            color: darkMode ? '#666666' : '#2D2D2D',
            '&:hover': {
              backgroundColor: bgHoverLight,
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          input: {
            paddingTop: '0',
            paddingBottom: '0',
            height: buttonHeight,
            color: darkMode ? '#666666' : '#2D2D2D',
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            color: darkMode ? '#666666' : '#2D2D2D',
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            sectionTitle: 'h6',
            fieldValue: 'p',
            fieldLabel: 'p',
          },
        },
        styleOverrides: {
          gutterBottom: {
            marginBottom: '1rem',
          },
        },
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
