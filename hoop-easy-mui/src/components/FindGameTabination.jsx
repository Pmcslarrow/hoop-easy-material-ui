import { Box, Container, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import GoogleMap from "./Map";
import FindGameCard from "./FindGameCard";

export default function FindGameTabination({availableGames, user, refresh, setRefresh}) {
    const [tabValue, setTabValue] = useState('map')

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const ListView = () => {
        return (
            <Container maxWidth='xl' >
                <LargeGrid 
                    title={''} 
                    availableGames={availableGames} 
                    user={user} 
                    refresh={refresh}
                    setRefresh={setRefresh}
                    large={true}
                ></LargeGrid>
            </Container>
        )
    }

    const MapView = () => {
        return (
            <Container>
                <Box sx={{ flexGrow: 1, width: '100%', height: '50vh', marginBottom: '100px'}}> 
                    <Box sx={{display: 'flex', gap: '2px'}}>
                        <Typography variant='subtitle2' sx={{backgroundColor: 'red', color:'white', width: 'max-content', padding: '5px', borderRadius: '10px'}} >Your Location</Typography>
                        <Typography variant='subtitle2' sx={{backgroundColor: '#8ecae6', color:'white', width: 'max-content', padding: '5px', borderRadius: '10px'}} >1v1</Typography>
                        <Typography variant='subtitle2' sx={{backgroundColor: '#219ebc', color:'white', width: 'max-content', padding: '5px', borderRadius: '10px'}} >2v2</Typography>
                        <Typography variant='subtitle2' sx={{backgroundColor: '#023047', color:'white', width: 'max-content', padding: '5px', borderRadius: '10px'}} >3v3</Typography>
                        <Typography variant='subtitle2' sx={{backgroundColor: '#ffb703', color:'white', width: 'max-content', padding: '5px', borderRadius: '10px'}} >4v4</Typography>
                        <Typography variant='subtitle2' sx={{backgroundColor: '#fb8500', color:'white', width: 'max-content', padding: '5px', borderRadius: '10px'}} >5v5</Typography>
                    </Box>
                    <br />
                    <GoogleMap 
                        availableGames={availableGames}
                        user={user}
                        refresh={refresh}
                        setRefresh={setRefresh}
                        style={{ width: '100%', height: '100%'}}
                    />
                </Box>   
            </Container>
        )
    }

    return (
        <>
        <Tabs
            value={tabValue}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
        >
            <Tab value="map" label="Map" />
            <Tab value="list" label="List" />
        </Tabs>
        <br />
        {tabValue === 'map' ? <MapView /> : <ListView /> }
        </>
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
