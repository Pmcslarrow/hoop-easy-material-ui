import React from 'react';
import './App.css';
import SignIn from './authentication/SignIn';
import CreateAccount from './authentication/CreateAccount';
import Homepage from './pages/Homepage';
import { Navigate, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { red } from '@mui/material/colors';



const theme = createTheme({
    palette: {
        primary: {
            main: red[500],
            light: red[300],
            dark: red[700],
            contrastText: '#fff',
          },
          secondary: {
            main: '#01579b',
          },
    },
    typography: {
        fontFamily: 'Quicksand',
        fontWeightLight: 400,
        fontWeightRegular: 500,
        fontWeightMedium: 600,
        fontWeightBold: 700
    },
    spacing: 10,
})


function App() {
    const [userCredential, setUserCredentials] = React.useState({})

    React.useEffect(()=>{
        console.log(userCredential)
    }, [userCredential])

    return (
    <ThemeProvider theme={theme}>
        <Router>
            <Routes>
                <Route path='/' element={<SignIn props={{setUserCredentials}} />} />
                <Route path='/homepage' element={<Homepage />} />
                <Route path='/createAccount' element={<CreateAccount />} />
            </Routes>
        </Router>
    </ThemeProvider>
    );
}

export default App;
