import React, { useEffect } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomPaginationActionsTable from '../components/TablePagination'
import FindGameCard from "../components/FindGameCard";
import axios from 'axios';
import { convertToLocalTime, extractDateTime, sortGamesByLocationDistance } from '../utils/timeAndLocation';
import { Container, Grid, Paper, Box, Typography } from "@mui/material";
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
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
}));


/**
 * The SmallGrid is used for the two tables on the homepage. It lets you pass in data to customize the table, and have 
   highlight attributes at the top
 * @param {string} title
 * @param {object} GridAttributes - { title, blockOneTitle, blockOneValue, blockTwoTitle, blockTwoValue }
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
 * The LargeGrid is used as the wrapper container outside of the Find a Game section
 * @param {string} title
 */
function LargeGrid({title, user, availableGames, refresh, setRefresh }) {
    const games = availableGames.map((game) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <FindGameCard game={game} user={user} refresh={refresh} setRefresh={setRefresh}/>
            </Grid>
        )
    })

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5">{title}</Typography>  
            <br />
            <Grid container spacing={2}>
                {games}
            </Grid>
        </Box>        
    )
}

/**
 * Homepage is the top level wrapper of all functionality. It is the hub of where we will 
 * create the structure of our page. 
 */
export default function Homepage({ UserContext }) {
    const navigate = useNavigate()
    const user = React.useContext(UserContext)
    const theme = useTheme();
    const isScreenSmall = useMediaQuery(theme.breakpoints.down('md'));
    const [rankData, setRankData] = React.useState([])
    const [myGames, setMyGames] = React.useState([])
    const [availableGames, setAvailableGames] = React.useState([])
    const [refresh, setRefresh] = React.useState(0)

    useEffect(() => {
        const getRankings = async () => {
            await axios.get("https://hoop-easy-production.up.railway.app/api/users")
                .then((res) => {
                    const users = res.data
                    const rankData = users.map((obj, i) => {
                        return { col1: obj.username, col2: i + 1, col3: obj.overall, col4: obj.gamesPlayed, col5: obj.id }
                    }).sort((a, b) =>  parseFloat(b.overall) - parseFloat(a.overall));
                    setRankData(rankData) // [ {rank: 1, overall: 99, name: 'pmcslarrow', gamesPlayed: 6} ]
                })
                .catch((err) => {
                    console.error(err)
                })
        }

        const getMyGames = async () => {
            await axios.get(`https://hoop-easy-production.up.railway.app/api/myGames?userID=${user?.id}`)
                .then((res) => {
                    const games = res.data
                    const myGames = games.map((obj, i) => {
                        const convertedDateTime = convertToLocalTime(obj?.dateOfGameInUTC)
                        const { date, time } = extractDateTime(convertedDateTime)
                        return { col1: obj.status, col2: obj.address, col3: date, col4: time, col5: obj.gameID, game: obj }
                    })
                    setMyGames(myGames) // {col1: 1, col2: '900 State St, Salem, OR 97301, USA', col3: '4/8/2024', col4: ' 2:20:00 PM', id: 63 }
                })
                .catch((err) => {
                    console.error(err)
                })
        }

        const availableGames = async () => {
            await axios.get('https://hoop-easy-production.up.railway.app/api/availableGames')
                .then(async (res) => {
                    const sortedGames = await sortGamesByLocationDistance(res.data);
                    setAvailableGames(sortedGames) // {gameID: 65, userID: 1, address: '2065 Myrtle Ave NE, Salem, OR 97301, USA', longitude: '-123.0214361', latitude: '44.9575788', …}
                })
                .catch((err) => {
                    console.error(err)
                })
        }
        getRankings()
        getMyGames()
        availableGames()
    }, [user, refresh])

    if (!user) {
        navigate('/')
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

    console.log(myGames)
    return (
        <>
        <Container maxWidth="xl" sx={isScreenSmall ? {} : { display: 'flex', gap: '75px'}} >
            <SmallGrid GridAttributes={AttLeft}></SmallGrid>  
            {isScreenSmall ? <br /> : ''} 
            <SmallGrid GridAttributes={AttRight}></SmallGrid>             
        </Container>
        <br />
        <Container maxWidth='xl' >
            <LargeGrid 
                title={'Find a Game'} 
                availableGames={availableGames} 
                user={user} 
                refresh={refresh}
                setRefresh={setRefresh}
                large={true}
            ></LargeGrid>
        </Container>
        <br />
        </>
    )
}