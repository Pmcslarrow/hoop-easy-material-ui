import React from 'react'
import ratingAlgorithm from '../utils/ratingAlgorithm';
import axios from 'axios';
import { createTeammateArrayFromJson } from '../utils/jsonFunc';
import { Box, Button, Typography } from '@mui/material';
import { localToUTC } from '../utils/timeAndLocation';

export default function VerifyGame({user, game, refresh, setRefresh, handleClose}) {
    const [hasAlreadySubmit, setHasAlreadySubmit] = React.useState(false)
    const [isUserOnTeamOne, setIsUserOnTeamOne] = React.useState(false)

    React.useEffect(() => {
        const needsVerificationOrWaitForOtherTeamApproval = () => {
            const captainsArray = createTeammateArrayFromJson(game?.game?.captains)
            const isCurrentUserCaptain = captainsArray.some((obj) => obj.toString() === user?.id.toString())
            const isPendingApproval = checkIfUserIsPendingApproval(user, game?.game)
            
            if (isCurrentUserCaptain && isPendingApproval) {
                setHasAlreadySubmit(false)
            } else {
                setHasAlreadySubmit(true)
            }
        }

        const checkIfUserIsPendingApproval = (user, game) => {
            const currentUserOnTeamOne = Object.values(game?.team1).some((obj) => obj.toString() === user?.id.toString())
            setIsUserOnTeamOne(currentUserOnTeamOne)
            if (currentUserOnTeamOne) {
                if (game?.teamOneApproval !== null) {
                    return false
                }
                return true
            } else {
                if (game?.teamTwoApproval !== null) {
                    return false
                }
                return true
            }
        }
        needsVerificationOrWaitForOtherTeamApproval()
    }, [user, game])

    const handleAccept = async () => {
        // If neither team has approved the game yet run this algorithm
        if (game?.game.teamOneApproval || game?.game.teamTwoApproval) {
            const ratingChanges = await ratingAlgorithm(game?.game.team1, game?.game.team2, game?.game?.scores.team1, game?.game?.scores.team2)
            const { team_A_average_overall_delta, team_B_average_overall_delta } = ratingChanges
            const convertedDT = localToUTC(game?.game.dateOfGameInUTC)
            
            await updateTeamOverallRatings(game?.game.team1, team_A_average_overall_delta)
            await updateTeamOverallRatings(game?.game.team2, team_B_average_overall_delta)

            await updateTeamHistory(
                game?.game.team1,  // "Team A"
                convertedDT,  // "2024-01-17 18:07:00"
                game?.game.team2,  // "Team B"
                game?.game.address,  // "2065 Myrtle Ave NE"
                [game?.game?.scores.team1, game?.game?.scores.team2], // [21, 5] 
                team_A_average_overall_delta  // -1.67
            );            

            await updateTeamHistory(
                game?.game.team2,
                convertedDT,
                game?.game.team1,
                game?.game.address,
                [game?.game?.scores.team2, game?.game?.scores.team1],
                team_B_average_overall_delta
            )

            await removeGameInstance(game?.game.gameID)
        } else {   
            // else this is the first team to accept the game. So we update the status the teams' approval raiting to TRUE
            if (isUserOnTeamOne) {
                await axios.put(`https://hoop-easy-production.up.railway.app/api/approveScore?team=1&gameID=${game?.game.gameID}`);
            } else {
                await axios.put(`https://hoop-easy-production.up.railway.app/api/approveScore?team=2&gameID=${game?.game.gameID}`);
            }
        }
        setRefresh(refresh + 1)
        handleClose()
    }

    const handleDeny = async () => {
        await updateDeniedGames()
        await removeGameInstance(game?.game.gameID)
        setRefresh(refresh + 1)
    }

    const updateTeamOverallRatings = async (team, delta) => {
        await axios.put(`https://hoop-easy-production.up.railway.app/api/updateTeamOverallRatings?overallChange=${delta}`, {
            params : {
                values: Object.values(team).join(',')
            }
        })
    }

    const updateTeamHistory = async (team, when, who, where, what, rating) => {
        const currentTeam = Array(Object.values(team).join(','))
        const data = {
            team: currentTeam,
            when,
            who,
            where,
            what,
            rating,
        }
        await axios.post('https://hoop-easy-production.up.railway.app/api/createHistoryInstance', {
            params: {
                values: data
            }
        })
    }

    const removeGameInstance = async(gameID) => {
        await axios.delete(`https://hoop-easy-production.up.railway.app/api/deleteGame?gameID=${gameID}`)
    }
    

    const updateDeniedGames = async () => {
        const allPlayersInGame = Object.values(game?.game.teammates)
        await axios.put(`https://hoop-easy-production.up.railway.app/api/updateDeniedGames`, {
            params: {
                values: allPlayersInGame
            }
        })
    }

    if (hasAlreadySubmit) {
        return (
        <Box sx={{padding: 3}}>
            <Typography>
                    You have already submitted the scores for the game. 
                    Please wait for or notify the other team captain to 
                    confirm the scores of the game.
            </Typography>
        </Box>
    )}

    return (
        <Box sx={{padding: 3}}>
            <Typography>Confirm the score of the game:</Typography>

            <Typography>{isUserOnTeamOne}</Typography>
            <Typography variant='h6'>{isUserOnTeamOne ? 'Your team' : 'Opponent'} : {game?.game?.scores?.team1}</Typography>
            <Typography variant='h6'>{isUserOnTeamOne ? 'Opponent' : 'Your team'} : {game?.game?.scores?.team2}</Typography>
            <br />
            <Box sx={{display: 'flex', gap: 2}}>
                <Button variant='contained' onClick={handleAccept}>Accept</Button>
                <Button variant='contained'>Deny</Button>
            </Box>
        </Box>
    )
}  