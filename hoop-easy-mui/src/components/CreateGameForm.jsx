import { useState } from 'react';
import { Box, Button, Menu, MenuItem, Select, Typography } from '@mui/material';
import { Input as BaseInput } from '@mui/base/Input';
import { localToUTC } from '../utils/timeAndLocation';
import LocationSearchInput from './GoogleNavigation';
import axios from 'axios';

const CreateGameForm = ({ user, handleClose, refresh, setRefresh }) => {
    const [address, setAddress] = useState('');
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        gameType: ''
    })
    const [coordinates, setCoordinates] = useState({
      lat: '',
      long: ''
    })
    const menuItems = ['1v1','2v2','3v3','4v4','5v5'].map((game, i) => {
        return <MenuItem value={game[0]} key={i}>{game}</MenuItem>
    })

    const handleChange = (event) => {
        let { name, value } = event.target
        setFormData({
            ...formData,
            [name] : value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (address && formData.date && formData.time && formData.gameType) {
            console.log(address)
            console.log(coordinates)
            console.log(formData.date, formData.time, formData.gameType)
    
            const { date, time, gameType } = formData
            const playerID = user?.id;
            const userDateTime = new Date(`${date} ${time}`);
            const dateOfGame = localToUTC(userDateTime)
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const teammates = { playerID };

            if (userDateTime < new Date()) {
                console.log("Cannot add game in the past");
                return;
            }

            
            const data = {
                userID: playerID,
                address: address,
                longitude: coordinates.long,
                latitude: coordinates.lat,
                dateOfGame: dateOfGame,
                timeOfGame: time,
                gameType,
                playerCreatedID: playerID,
                userTimeZone,
            };
            
            
            axios.post('https://hoop-easy-production.up.railway.app/api/newGame', data)
            setRefresh(refresh + 1)
            
            handleClose()
        }
    }

    return (
        <Box sx={{width: '350px', height: '350px', padding: 3}}>
            <Typography variant='h6'>Enter the location of the game:</Typography>
            <LocationSearchInput 
                address={address}
                setAddress={setAddress}
                setCoordinates={setCoordinates}
            />
            <br />
            <Box>
                <Typography variant='h6'>Enter the date of the game:</Typography>
                <BaseInput sx={{padding: 2}} type='date' name='date' onChange={handleChange}/>
            </Box>
            <br />
            <Box>
                <Typography variant='h6'>Enter the time of the game:</Typography>
                <BaseInput sx={{padding: 2}} type='time' name='time' onChange={handleChange}/>
            </Box>
            <br />
            <Box>
                <Typography variant='h6'>Select the type of game:</Typography>
                <Select value={formData.gameType} name='gameType' onChange={handleChange}>
                    {menuItems}
                </Select>
            </Box>
            <br />
            <Box>
                <Button variant='contained' onClick={handleSubmit}>Create Game</Button>
            </Box>
        </Box>
    );
};

export default CreateGameForm;
