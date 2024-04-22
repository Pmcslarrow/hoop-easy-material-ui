import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import getUserCoordinates from '../utils/timeAndLocation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box } from '@mui/material';
import DialogBox from './DialogBox';
import FindGameCard from './FindGameCard';


export default function GoogleMap({ availableGames, user, refresh, setRefresh }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedGame, setSelectedGame] = useState()
    const [center, setCenter] = useState({
        lat: 30.00,
        lng: 30.00
    });

    const handleClose = () => {
        setIsDialogOpen(false)
    };

    const handleMarkerClick = (game) => {
        setSelectedGame(game)
        setIsDialogOpen(true)
    }

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
                onClick={() => handleMarkerClick(game)}
            >
                <Pin background={'#ff9800'} glyphColor={'#000'} borderColor={'#000'}/>
            </AdvancedMarker>
        ));
    }, [availableGames]);

    if (center.lat === 30.00) {
        return <Box>Loading map...</Box>;
    }

    return (
        <APIProvider apiKey={"AIzaSyD-qamxgHTK8gbNFAp5hhq43-HIN6wCcRs"}>
            <DialogBox 
                Component={<FindGameCard game={selectedGame} user={user} refresh={refresh} setRefresh={setRefresh}/>}
                dialogOpen={isDialogOpen}
                setDialogOpen={setIsDialogOpen}
                handleClose={handleClose}
                >
            </DialogBox> 
            <Map
                style={{ borderRadius: '10px' }}
                defaultCenter={center}
                defaultZoom={12}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId={'6d06e0f6b87bce0'}
            >
                {memoizedMapMarkers}
                <AdvancedMarker
                    key={'home-marker'}
                    position={{ lat: parseFloat(center?.lat), lng: parseFloat(center?.lng) }}
                >
                    <Pin background={'#457b9d'} glyphColor={'#000'} borderColor={'#000'}/>
                </AdvancedMarker>
            </Map>
        </APIProvider>
    );
}



