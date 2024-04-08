import React from 'react';
import './App.css';
import SignIn from './authentication/SignIn';
import CreateAccount from './authentication/CreateAccount';
import Homepage from './pages/Homepage';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';



const theme = createTheme({
    palette: {
        primary: {
            main: '#1d3557',
            contrastText: '#fff',
          },
          secondary: {
            main: '#1d3557',
            darkBlue: '#457b9d',
            lightBlue: '#a8dadc',
            lightRed: '#ee747e',
            red: '#e63946'
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
