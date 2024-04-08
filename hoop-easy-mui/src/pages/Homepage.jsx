import React, { useEffect } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomPaginationActionsTable from '../components/TablePagination'
import FindGameCard from "../components/FindGameCard";
import axios from 'axios';
import { Container, Grid, Paper, Box, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';


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
function LargeGrid({title}) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5">{title}</Typography>  
            <br />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <FindGameCard gameType={1}/>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <FindGameCard gameType={2}/>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <FindGameCard gameType={3}/>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <FindGameCard gameType={4}/>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <FindGameCard gameType={5}/>
                </Grid>
            </Grid>
        </Box>        
    )
}

/**
 * Homepage is the top level wrapper of all functionality. It is the hub of where we will 
 * create the structure of our page. 
 */
export default function Homepage({ UserContext }) {
    const user = React.useContext(UserContext)
    const theme = useTheme();
    const isScreenSmall = useMediaQuery(theme.breakpoints.down('md'));
    const [rankData, setRankData] = React.useState([])

    useEffect(() => {
        const getRankings = async () => {
            const response = await axios.get("https://hoop-easy-production.up.railway.app/api/users")
            const users = response.data
            
            const rankData = users.map((obj, i) => ({
                rank: i + 1,
                overall: obj.overall,
                name: obj.username,
                gamesPlayed: obj.gamesPlayed
            })).sort((a, b) =>  parseFloat(b.overall) - parseFloat(a.overall));
            
            setRankData(rankData) // [ {rank: 1, overall: 99, name: 'pmcslarrow', gamesPlayed: 6} ]
        }

        getRankings()
    }, [user])

    /* Interact with the backend to get the rankings data {name, overall rating, games played} api/users */
    /* Interact with the backend to get the games available to a user { type, date, address, time } api/myGames */

    function createData(name, overall, rank, winLoss) {
        return { name, overall, rank, winLoss };
    }

    // Defining the column names for the reusable tables
    const dataStatisticsCols = [
        { id: 1, label: 'Username', align: 'left'},
        { id: 2, label: 'Rank', align: 'right'},
        { id: 3, label: 'Overall Rating', align: 'right'},
        { id: 4, label: 'Games Played', align: 'right'},
    ];

    const myGamesCols = [
        { id: 1, label: 'Type', align: 'left'},
        { id: 2, label: 'Address', align: 'right'},
        { id: 3, label: 'Date', align: 'right'},
        { id: 4, label: 'Time', align: 'right'},
    ];

    const myGamesRows = [
        createData('1v1', '4/8/2024', '900 State St, Salem, OR 97301, USA', '2:00 PM'),
        createData('1v1', '4/8/2024', '900 State St, Salem, OR 97301, USA', '2:00 PM'),
        createData('1v1', '4/8/2024', '900 State St, Salem, OR 97301, USA', '2:00 PM'),
        createData('1v1', '4/8/2024', '900 State St, Salem, OR 97301, USA', '2:00 PM'),
        createData('1v1', '4/8/2024', '900 State St, Salem, OR 97301, USA', '2:00 PM'),

    ]

    const globalRank = rankData.find((dataPoint) => {return dataPoint?.name === user?.username})
    const AttLeft = {
        title: 'General Statistics',
        blockOneTitle: 'Overall Rating',
        blockOneValue: user?.overall,
        blockTwoTitle: 'Global Rank',
        blockTwoValue: `${globalRank?.rank} / ${rankData?.length}`,
        component: <CustomPaginationActionsTable rows={rankData ?? [{name: 'empty', overall: 'empty', rank: 'empty', gamesPlayed: 'empty'}]} columnNames={dataStatisticsCols}/>,
    }

    const AttRight = {
        title: 'My Games',
        blockOneTitle: 'Upcoming',
        blockOneValue: '8',
        blockTwoTitle: 'Past',
        blockTwoValue: '3',
        component: <CustomPaginationActionsTable rows={myGamesRows} columnNames={myGamesCols}/>,
    }

    return (
        <>
        <Container maxWidth="xl" sx={isScreenSmall ? {} : { display: 'flex', gap: '75px'}} >
            <SmallGrid GridAttributes={AttLeft}></SmallGrid>  
            {isScreenSmall ? <br /> : ''} 
            <SmallGrid GridAttributes={AttRight}></SmallGrid>             
        </Container>
        <br />
        <Container maxWidth='xl' >
            <LargeGrid title={'Find a Game'} large={true}></LargeGrid>
        </Container>
        <br />
        </>
    )
}