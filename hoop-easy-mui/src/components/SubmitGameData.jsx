import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import { Box, Typography, InputLabel, MenuItem, FormControl, Select, TextField,  Button, Snackbar } from '@mui/material';
import {createCaptainJsonFromArray, createScoreJsonFromArray, createTeamJsonFromArray} from '../utils/jsonFunc'

export default function SubmitGameData({ user, game, refresh, setRefresh, handleClose }) {
    const [teamOneCheckboxes, setteamOneCheckboxes] = React.useState([]); // [false, false...]
    const [playersInGame, setPlayersInGame] = React.useState([]);
    const [selectedTeamOneCaptain, setSelectedTeamOneCaptain] = React.useState()
    const [selectedTeamTwoCaptain, setSelectedTeamTwoCaptain] = React.useState()
    const [teamOneScore, setTeamOneScore] = React.useState(0);
    const [teamTwoScore, setTeamTwoScore] = React.useState(0);
    const [open, setOpen] = React.useState(false)
    const maxAllowedToSelect = parseInt(game?.game?.gameType);
    const teamTwoCheckboxes = teamOneCheckboxes.map(value => !value) 
    const totalSelected = teamOneCheckboxes.filter(checked => checked).length;

    React.useEffect(() => {
        const fetchPlayers = async () => {
            const playersArray = Object.values(game?.game?.teammates);
            const profiles = await axios.get(`https://hoop-easy-production.up.railway.app/api/getProfiles?arrayOfID=${playersArray}`);
            setPlayersInGame(profiles.data);
            setteamOneCheckboxes(new Array(profiles.data.length).fill(false));
        };

        fetchPlayers();
    }, [game]);

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...teamOneCheckboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];
        setteamOneCheckboxes(updatedCheckboxes);
    };

    const handleTeamScoreChange = (event) => {
        const { name, value } = event.target;
        let val = parseInt(value, 10)
        if (name === 'teamOneScore') {
            if (val < 0) { setTeamOneScore(0) }
            else if (val > 50) { setTeamOneScore(50)}
            else {
                setTeamOneScore(val)
            }            
        } else if (name === 'teamTwoScore') {
            if (val < 0) { setTeamTwoScore(0) }
            else if (val > 50) { setTeamTwoScore(50)}
            else {
                setTeamTwoScore(val)
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        setOpen(true)

        if (!selectedTeamOneCaptain || !selectedTeamTwoCaptain || !teamOneScore || !teamTwoScore || !teamOneIdArray || !teamTwoIdArray || !game?.game?.gameID) {
            return;
        }

        const captainJSON = createCaptainJsonFromArray([selectedTeamOneCaptain, selectedTeamTwoCaptain])
        const scoreJSON = createScoreJsonFromArray([teamOneScore.toString(), teamTwoScore.toString()])
        const teamOne = createTeamJsonFromArray(teamOneIdArray)
        const teamTwo = createTeamJsonFromArray(teamTwoIdArray)

        await axios.put('https://hoop-easy-production.up.railway.app/api/handleGameSubmission', {
            params: {
              status: 'verification',
              teamOne: teamOne,  
              teamTwo: teamTwo,
              captainJSON: captainJSON,
              scoreJSON: scoreJSON,
              gameID: game?.game?.gameID
            }
        })
        handleClose()
        setRefresh(refresh + 1)
    }

    // Array of IDs
    const teamOneIdArray = React.useMemo(() => (
        playersInGame
            .filter((player, index) => teamOneCheckboxes[index])
            .map(player => player.id.toString())
    ), [playersInGame, teamOneCheckboxes])

    const teamTwoIdArray = React.useMemo(() => (
        playersInGame
            .filter((player, index) => teamTwoCheckboxes[index])
            .map(player => player.id.toString())
    ), [playersInGame, teamTwoCheckboxes])

    // Array of usernames as DOM elements
    const teamOneArray = React.useMemo(() => (
        playersInGame
            .filter((player, index) => teamOneCheckboxes[index])
            .map(player => <MenuItem value={player.id}>{player.username}</MenuItem>)
    ), [playersInGame, teamOneCheckboxes]);
    
    const teamTwoArray = React.useMemo(() => (
        playersInGame
            .filter((player, index) => teamTwoCheckboxes[index])
            .map(player => <MenuItem value={player.id}>{player.username}</MenuItem>)
    ), [playersInGame, teamTwoCheckboxes]);

    return (
        <>
        <Box component="form" sx={{padding: '30px'}}>
            <Typography variant='h5'>Step 1: Select players on team 1</Typography>
            <FormGroup>
                {playersInGame.map((player, index) => (
                    <FormControlLabel
                        key={player.id}
                        control={<Checkbox
                            checked={teamOneCheckboxes[index]}
                            onChange={() => handleCheckboxChange(index)}
                            disabled={totalSelected >= maxAllowedToSelect && !teamOneCheckboxes[index]}
                        />}
                        label={player.username}
                    />
                ))}
            </FormGroup>
            <br />
            <Typography variant='h5'>Step 2: Select two team captains</Typography>
            <FormGroup>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">Team 1</InputLabel>
                    <Select 
                        value={selectedTeamOneCaptain || ''}
                        onChange={(e) => setSelectedTeamOneCaptain(e.target.value)}
                        >
                        {teamOneArray}
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">Team 2</InputLabel>
                    <Select 
                        value={selectedTeamTwoCaptain || ''}
                        onChange={(e) => setSelectedTeamTwoCaptain(e.target.value)}
                        >
                        {teamTwoArray}
                    </Select>
                </FormControl>
            </FormGroup>
            <br />
            <FormGroup>
                <Typography variant='h5'>Step 3: Assign scores to each team</Typography>
                <br />
                <Box sx={{display: 'flex', gap: '5px'}}>
                    <TextField
                        id='teamOneScore'
                        name='teamOneScore'
                        label="Team 1 Score"
                        variant="outlined"
                        type="number"
                        onChange={handleTeamScoreChange}
                        InputProps={{ inputProps: { min: 0 } }}
                    />
                    <TextField
                        id='teamTwoScore'
                        name='teamTwoScore'
                        label="Team 2 Score"
                        variant="outlined"
                        type="number"
                        onChange={handleTeamScoreChange}
                        InputProps={{ inputProps: { min: 0 } }}
                    />
                </Box>
            </FormGroup>
            <br />
            <FormGroup>
                <Button variant="contained" onClick={(e) => handleSubmit(e)}>Submit</Button>
            </FormGroup>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleNotificationClose}
                message="Updating data"
            />
        </Box>
        </>
    );
}




