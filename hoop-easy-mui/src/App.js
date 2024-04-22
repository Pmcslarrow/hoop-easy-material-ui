import './App.css';
import React from 'react';
import SignIn from './authentication/SignIn';
import CreateAccount from './authentication/CreateAccount';
import Homepage from './pages/Homepage';
import axios from 'axios';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { orange, indigo, grey } from '@mui/material/colors';
const UserContext = React.createContext()
/*
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
*/

const theme = createTheme({
    palette: {
        primary: {
            main: orange[700],
            orange_100: orange[100],
            orange_200: orange[200],
            orange_300: orange[300],
            orange_400: orange[400],
            orange_600: orange[600],
            orange_700: orange[700],
            orange_800: orange[800],
            dark: orange[700],
            contrastText: '#fff',
        },
        secondary: {
            main: indigo[500],
            darkBlue: '#457b9d',
            lightBlue: '#a8dadc',
            lightRed: '#ee747e',
            red: '#e63946'
        },
        grayscale: {
            light: grey[100],
            lightMed: grey[300],
            main: grey[500],
            darkMed: grey[700],
            dark: grey[900]
        }
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
    const [currentUser, setCurrentUser] = React.useState()

    const getUser = React.useCallback(async (email) => {
        try {
            const response = await axios.get(`https://hoop-easy-production.up.railway.app/api/getUser?email=${email}`);
            setCurrentUser(response.data);
        } catch(err) {
            console.error(err);
        }
    }, []);

    return (
        <UserContext.Provider value={currentUser}>
            <ThemeProvider theme={theme}>
                <Router>
                    <Routes>
                        <Route path='/' element={<SignIn getUser={getUser}/>} />
                        <Route path='/homepage' element={<Homepage UserContext={UserContext} getUser={getUser}/> } />
                        <Route path='/createAccount' element={<CreateAccount />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </UserContext.Provider>
    
    );
}

export default App;
