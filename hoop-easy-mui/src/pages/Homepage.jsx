import { Container, Grid, Paper, Box, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.h6,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
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
                    <Item sx={{height: '30vh'}}>
                    </Item>
                </Grid>
            </Grid>
        </Box>        
    )
}

function LargeGrid({title}) {
    return (
        <Box sx={{ flexGrow: 1}}>
            <Typography variant="h5">{title}</Typography>  
            <br />
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Item sx={{height: '83vh'}}>
                    </Item>
                </Grid>
            </Grid>
        </Box>        
    )
}

export default function Homepage() {
    const theme = useTheme();
    const isScreenSmall = useMediaQuery(theme.breakpoints.down('md'));

    const AttLeft = {
        title: 'General Statistics',
        blockOneTitle: 'Overall Rating',
        blockOneValue: '67.35',
        blockTwoTitle: 'Global Rank',
        blockTwoValue: '1023'
    }

    const AttRight = {
        title: 'My Games',
        blockOneTitle: 'Upcoming',
        blockOneValue: '8',
        blockTwoTitle: 'Past',
        blockTwoValue: '3'
    }

    return (
        <>
        <Container maxWidth="xl" sx={isScreenSmall ? {} : { display: 'flex', gap: '10px' }}>
            <SmallGrid GridAttributes={AttLeft}></SmallGrid>  
            {isScreenSmall ? <br /> : ''} 
            <SmallGrid GridAttributes={AttRight}></SmallGrid>             
        </Container>
        <br />
        <Container maxWidth='xl'>
            <LargeGrid title={'Find a Game'} large={true}></LargeGrid>
        </Container>
        <br />
        </>
    )
}