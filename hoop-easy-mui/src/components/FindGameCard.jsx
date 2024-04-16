import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { Box, Avatar } from "@mui/material";
import { useTheme } from "@emotion/react";
import { extractDateTime } from "../utils/timeAndLocation";
import { createTeammateArrayFromJson, createTeammateJsonFromArray } from "../utils/jsonFunc";

// Pass in the object that contains all the information about the game
export default function FindGameCard({ game, user, refresh, setRefresh }) {
    const [isUserAlreadyInsideGame, setUserAlreadyInAGame] = useState(false)
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const isTeammateInGame = () => {
            let result = Object.values(game?.teammates).find((value) => value === user.id.toString())
            if (result === undefined || result === null) {
                setUserAlreadyInAGame(false)
            } else {
                setUserAlreadyInAGame(true)
            }
        }    
        isTeammateInGame()
    }, [game, user])


    const handleJoinGame = async () => {
        try {
            setOpen(true);
            let teammateArray = createTeammateArrayFromJson(game?.teammates)
            teammateArray.push(user?.id.toString())
            let jsonArray = createTeammateJsonFromArray(teammateArray)
            await axios.put(`https://hoop-easy-production.up.railway.app/api/updateTeammates?gameID=${game?.gameID}&teammateJson=${jsonArray}`)
            if (teammateArray.length >= parseInt(game.gameType) * 2) {
                await axios.put(`https://hoop-easy-production.up.railway.app/api/updateStatus?gameID=${game?.gameID}&status=confirmed`)
            } 
            setRefresh(refresh + 1)
        } catch (err) {
            console.log("Error trying to join game: ", err)
        }
    }

    const handleLeaveGame = async () => {
        setOpen(true)
        let teammateArray = createTeammateArrayFromJson(game?.teammates)
        const newTeammatesIdArray = teammateArray.filter(id => id.toString() !== user?.id.toString());
        if (newTeammatesIdArray <= 0) {
            await axios.delete(`https://hoop-easy-production.up.railway.app/api/deleteGame?gameID=${game.gameID}`)
            setRefresh(refresh + 1)
            return
        }
        const newJSONTeammates = createTeammateJsonFromArray(newTeammatesIdArray)
        await axios.put(`https://hoop-easy-production.up.railway.app/api/updateTeammates?gameID=${game?.gameID}&teammateJson=${newJSONTeammates}`);
        setRefresh(refresh + 1)
    }
   
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

  const theme = useTheme()
  const colorHashMap = {
    1: theme.palette.secondary.main,
    2: theme.palette.secondary.darkBlue,
    3: theme.palette.secondary.lightBlue,
    4: theme.palette.secondary.lightRed,
    5: theme.palette.secondary.red
  }

  let { date, time } = extractDateTime(game?.time)
  let numberOfPlayersJoined = Object.values(game.teammates).length
  let maxNumberOfPlayers = parseInt(game?.gameType * 2)
  let playersNeeded = maxNumberOfPlayers - numberOfPlayersJoined

  return (
    <Card>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1, backgroundColor: colorHashMap[game.gameType]}}>
            <Avatar sx={{margin: 1, backgroundColor: 'white', color: 'black'}}>{game.gameType}v{game.gameType}</Avatar>
            <Typography sx={{color: 'white', margin: 1}}>Spots left: {playersNeeded}</Typography>
        </Box>
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {date}
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
                {time}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {game.address}
            </Typography>
            <br />
            <Typography variant="body2">{game?.distance.toFixed(2)} Miles</Typography>
        </CardContent>
        <CardActions>
            <Button 
                sx={{color: colorHashMap[game.gameType]}} 
                onClick={isUserAlreadyInsideGame ? handleLeaveGame : handleJoinGame}>
                {isUserAlreadyInsideGame ? 'Leave Game' : 'Join Game'}
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message="Updating data"
            />
        </CardActions>
    </Card>
  
  );
}