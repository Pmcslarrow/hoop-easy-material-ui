import './App.css';
import React from 'react';
import SignIn from './authentication/SignIn';
import CreateAccount from './authentication/CreateAccount';
import Homepage from './pages/Homepage';
import axios from 'axios';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

const UserContext = React.createContext()
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
    const [currentUser, setCurrentUser] = React.useState()

    async function getUser(email) {
        try {
            const response = await axios.get(`https://hoop-easy-production.up.railway.app/api/getUser?email=${email}`)
            setCurrentUser(response.data)
        } catch(err) {
            console.error(err)
        }
    }

    return (
    <UserContext.Provider value={currentUser}>
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path='/' element={<SignIn getUser={getUser}/>} />
                    <Route path='/homepage' element={<Homepage UserContext={UserContext}/>} />
                    <Route path='/createAccount' element={<CreateAccount />} />
                </Routes>
            </Router>
        </ThemeProvider>
    </UserContext.Provider>
    );
}

export default App;
