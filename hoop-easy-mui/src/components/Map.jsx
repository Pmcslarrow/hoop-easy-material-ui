import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import getUserCoordinates from '../utils/timeAndLocation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box } from '@mui/material';
import DialogBox from './DialogBox';
import FindGameCard from './FindGameCard';


/*
Next step:

You need to handle the click of each marker. 
When a user clicks a market, it should trigger the state of the DialogBox to open
and to call the FindGameCard to appear when this happens!

DialogBox prop inputs
 * Component (function): Pass in FindGameCard
 * dialogOpen (bool): create a state variable that knows if the dialog is open or closed
 * setDialogOpen (callback): ibid setter
 * handleClose (function): pass a prop into GoogleMap handleClose and then call it in here.
*/

export default function GoogleMap({ availableGames }) {
    const [center, setCenter] = useState({
        lat: 30.00,
        lng: 30.00
    });

    const memoizedSetCenter = useCallback(async () => {
        const center = await getUserCoordinates();
        setCenter({
            lat: center.latitude,
            lng: center.longitude
        });
    }, []);

    useEffect(() => {
        memoizedSetCenter();
    }, [memoizedSetCenter]);

    const memoizedMapMarkers = useMemo(() => {
        return availableGames.map((game, i) => (
            <AdvancedMarker
                key={i}
                position={{ lat: parseFloat(game?.latitude), lng: parseFloat(game?.longitude) }}

            />
        ));
    }, [availableGames]);

    if (center.lat === 30.00) {
        return <Box>Loading map...</Box>;
    }

    return (
        <APIProvider apiKey={"AIzaSyD-qamxgHTK8gbNFAp5hhq43-HIN6wCcRs"}>
            { /* <DialogBox Component={}></DialogBox> */ }
            <Map
                style={{ borderRadius: '10px' }}
                defaultCenter={center}
                defaultZoom={12}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId={'6d06e0f6b87bce0'}
            >
                {memoizedMapMarkers}
            </Map>
        </APIProvider>
    );
}
