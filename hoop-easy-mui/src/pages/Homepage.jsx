import React, { useEffect } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomPaginationActionsTable from '../components/TablePagination'
import axios from 'axios';
import DialogBox from '../components/DialogBox';
import CreateGameForm from '../components/CreateGameForm';
import FindGameTabination from '../components/FindGameTabination';
import { convertToLocalTime, extractDateTime, sortGamesByLocationDistance } from '../utils/timeAndLocation';
import { Container, Grid, Paper, Box, Typography, Button, Avatar, Alert } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// GLOBALS
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.h6,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    boxShadow: '3px 3px 5px 1px rgba(0,0,0,0.2)'
}));


/**
 * The SmallGrid is used for the two tables on the homepage. It lets you pass in data to customize the table, and have 
   highlight attributes at the top
 * @param {string} title
 * @param {object} GridAttributes - { title, blockOneTitle, blockOneValue, blockTwoTitle, blockTwoValue, component }
 */
function SmallGrid({GridAttributes}) {
    return (
        <Box sx={{ flexGrow: 1}}>
            <Typography variant="h5">{GridAttributes.title}</Typography>  
            <br />
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <Item> 
                        <Typography variant="body2">{GridAttributes.blockOneTitle}</Typography>
                        {GridAttributes.blockOneValue}
                    </Item>
                </Grid>
                <Grid item xs={4}>
                    <Item>
                        <Typography variant="body2">{GridAttributes.blockTwoTitle}</Typography>
                        {GridAttributes.blockTwoValue}
                    </Item>
                </Grid>
                <Grid item xs={12}>
                        {GridAttributes.component}
                </Grid>
            </Grid>
        </Box>        
    )
}


/**
 * Homepage is the top level wrapper of all functionality. It is the hub of where we will 
 * create the structure of our page. 
 */
export default function Homepage({ UserContext, MapContext, getUser }) {
    const navigate = useNavigate()
    const user = React.useContext(UserContext)
    const googleApi = React.useContext(MapContext)
    const theme = useTheme();
    const isScreenSmall = useMediaQuery(theme.breakpoints.down('md'));
    const [rankData, setRankData] = React.useState([])
    const [myGames, setMyGames] = React.useState([])
    const [availableGames, setAvailableGames] = React.useState([])
    const [refresh, setRefresh] = React.useState(0)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [isLoading, setLoading] = React.useState(false)


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
    
                const [rankDataResponse, myGamesResponse, availableGamesResponse] = await Promise.all([
                    axios.get("https://hoop-easy-production.up.railway.app/api/users"),
                    axios.get(`https://hoop-easy-production.up.railway.app/api/myGames?userID=${user?.id}`),
                    axios.get('https://hoop-easy-production.up.railway.app/api/availableGames')
                ]);
    
                const users = rankDataResponse.data;
                const rankData = users
                    .map(obj => ({
                        col1: obj.username,
                        col3: obj.overall,
                        col4: obj.gamesPlayed,
                        col5: obj.id
                    }))
                    .sort((a, b) => parseFloat(b.col3) - parseFloat(a.col3))
                    .map((obj, index) => ({
                        col1: obj.col1,
                        col2: index + 1,
                        col3: obj.col3,
                        col4: obj.col4,
                        col5: obj.col5
                    }));
                setRankData(rankData);
    
                const games = myGamesResponse.data;
                const myGames = games.map((obj, i) => {
                    const convertedDateTime = convertToLocalTime(obj?.dateOfGameInUTC);
                    const { date, time } = extractDateTime(convertedDateTime);
                    return {
                        col1: obj.status,
                        col2: obj.address,
                        col3: date,
                        col4: time,
                        col5: obj.gameID,
                        game: obj
                    };
                });
                setMyGames(myGames);
    
                const sortedGames = await sortGamesByLocationDistance(availableGamesResponse.data);
                setAvailableGames(sortedGames);
    
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
    
        fetchData();
    }, [user, refresh]);
    

    // This should ONLY ever update when we refresh manually. Meaning the user updated information that could affect the overall score
    useEffect(() => {
        getUser(user?.email)
    }, [refresh, getUser, user?.email])

    if (!user) {
        navigate('/')
    }

    if (isLoading) {
        return <Alert>Loading...</Alert>
    }

    /* This section looks confusing but just defines the structure for the table (header names and card values) */
    const dataStatisticsCols = [
        { id: 1, label: 'Username', align: 'left'},
        { id: 2, label: 'Rank', align: 'right'},
        { id: 3, label: 'Overall Rating', align: 'right'},
        { id: 4, label: 'Games Played', align: 'right'},
    ];

    const myGamesCols = [
        { id: 1, label: 'Status', align: 'left'},
        { id: 2, label: 'Address', align: 'right'},
        { id: 3, label: 'Date', align: 'right'},
        { id: 4, label: 'Time', align: 'right'},
    ];

    const globalRank = rankData.find((dataPoint) => {return dataPoint?.col1 === user?.username})
    const AttLeft = {
        title: 'General Statistics',
        blockOneTitle: 'Overall Rating',
        blockOneValue: user?.overall,
        blockTwoTitle: 'Global Rank',
        blockTwoValue: `${globalRank?.col2} / ${rankData?.length}`,
        component: <CustomPaginationActionsTable rows={rankData ?? [{name: 'empty', overall: 'empty', rank: 'empty', gamesPlayed: 'empty'}]} columnNames={dataStatisticsCols} isMyGames={false}/>,
    }

    let upcomingGamesCount = 0
    let gamesPlayedCount = 0
    let now = Date.now()
    
    for (let i = 0; i < myGames.length; i++) {
        let candidate = new Date(myGames[i].col3 + myGames[i].col4)
        if (now < candidate) {
            upcomingGamesCount++
        } else {
            gamesPlayedCount++
        }
    }    
    const AttRight = {
        title: 'My Games',
        blockOneTitle: 'Upcoming',
        blockOneValue: upcomingGamesCount,
        blockTwoTitle: 'Past',
        blockTwoValue: gamesPlayedCount,
        component: <CustomPaginationActionsTable rows={myGames ?? [{name: 'empty', overall: 'empty', rank: 'empty', gamesPlayed: 'empty'}]} columnNames={myGamesCols} isMyGames={true} user={user} setRefresh={setRefresh} refresh={refresh}/>,
    }

    const handleClose = () => {
        setDialogOpen(false)
    };

    return (
        <>
        <Container>
            <DialogBox Component={<CreateGameForm user={user} handleClose={handleClose} refresh={refresh} setRefresh={setRefresh}/>} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} handleClose={handleClose}/>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Avatar sx={{backgroundColor: theme.palette.primary.main}}>{user?.username[0]?.toUpperCase()}</Avatar>
                <Button variant='contained' onClick={() => setDialogOpen(!dialogOpen)}>Create Game</Button>
            </Box>  
            <br/>
            <Container maxWidth="xl" sx={isScreenSmall ? {} : { display: 'flex', gap: '75px'}} >
                <SmallGrid GridAttributes={AttLeft}></SmallGrid>  
                {isScreenSmall ? <br /> : ''} 
                <SmallGrid GridAttributes={AttRight}></SmallGrid>             
            </Container>
            <br />
            <Container>
                <Typography variant='h5'>Find a Game</Typography>
                <br />
                <FindGameTabination 
                    availableGames={availableGames}
                    user={user}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    googleApi={googleApi}
                />            
            </Container>
            <br />
        </Container>
        </>
    )
}