import { Container, Grid, Paper, Box, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomPaginationActionsTable from '../components/TablePagination'
import FindGameCard from "../components/FindGameCard";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.h6,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
}));

function SmallGrid({GridAttributes}) {
    /*
    params:
      title - string
      GridAttributes - { title, blockOneTitle, blockOneValue, blockTwoTitle, blockTwoValue }
    */
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

export default function Homepage() {
    const theme = useTheme();
    const isScreenSmall = useMediaQuery(theme.breakpoints.down('md'));

    function createData(name, overall, rank, winLoss) {
        return { name, overall, rank, winLoss };
    }
    
    const dataStatisticsRows = [
        createData('Paul McSlarrow', 65, 4, '52-2'),
        createData('Jack Boydell', 66, 3, '52-2'),
        createData('Dylan Green', 60, 6, '52-2'),
        createData('Aadem Isai', 66, 5, '52-2'),
        createData('Josiah Frank', 69, 2, '52-2'),
        createData('Cedric Coward', 99, 1, '52-2'),
    ].sort((a, b) => (a.rank < b.rank ? -1 : 1));

    const dataStatisticsCols = [
        { id: 1, label: 'Username', align: 'left'},
        { id: 2, label: 'Rank', align: 'right'},
        { id: 3, label: 'Overall Rating', align: 'right'},
        { id: 4, label: 'W/L', align: 'right'},
    ];

    const myGamesRows = [
        createData('1v1', '4/8/2024', '900 State St, Salem, OR 97301, USA', '2:00 PM'),
        createData('1v1', '4/8/2024', '900 State St, Salem, OR 97301, USA', '2:00 PM'),
        createData('1v1', '4/8/2024', '900 State St, Salem, OR 97301, USA', '2:00 PM'),
        createData('1v1', '4/8/2024', '900 State St, Salem, OR 97301, USA', '2:00 PM'),
        createData('1v1', '4/8/2024', '900 State St, Salem, OR 97301, USA', '2:00 PM'),

    ]
    
    const myGamesCols = [
        { id: 1, label: 'Type', align: 'left'},
        { id: 2, label: 'Address', align: 'right'},
        { id: 3, label: 'Date', align: 'right'},
        { id: 4, label: 'Time', align: 'right'},
    ];


    const AttLeft = {
        title: 'General Statistics',
        blockOneTitle: 'Overall Rating',
        blockOneValue: '67.35',
        blockTwoTitle: 'Global Rank',
        blockTwoValue: '1023',
        component: <CustomPaginationActionsTable rows={dataStatisticsRows} columnNames={dataStatisticsCols}/>,
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