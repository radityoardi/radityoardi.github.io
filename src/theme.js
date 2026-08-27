import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#0b3a6f' },
    secondary: { main: '#1e88e5' },
    background: { default: '#000814', paper: '#071029' },
    text: { primary: '#e6f0ff', secondary: '#bcd0ff' }
  },
  typography: {
    fontFamily: "Average Sans, Arial, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000',
        }
      }
    }
  }
});

export default theme;
