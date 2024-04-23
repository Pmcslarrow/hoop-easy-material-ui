import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import DialogBox from './DialogBox';
import FindGameCard from './FindGameCard';


export default function GoogleMap({ availableGames, user, refresh, setRefresh, googleApi}) {
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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              position => {
                const { latitude, longitude } = position.coords;
                setCenter({
                    lat: latitude,
                    lng: longitude
                })
              },
              error => {
                if (error.code === error.PERMISSION_DENIED) {
                  console.log("User denied the request for Geolocation.");
                  setCenter({
                    lat: 40.748440,
                    lng: -73.984559
                  })
                } else {
                  console.error("Error getting user location:", error);
                  setCenter({
                    lat: 40.748440,
                    lng: -73.984559
                  })
                }
              }
            );
          } else {
            setCenter({
                lat: 40.748440,
                lng: -73.984559
              })
        }
    }, []);

    useEffect(() => {
        memoizedSetCenter();
    }, [memoizedSetCenter]);

    const memoizedMapMarkers = useMemo(() => {
        const colorHashMap = {
            1: "#8ecae6",
            2: "#219ebc",
            3: '#023047',
            4: '#ffb703',
            5: '#fb8500'
        }

        return availableGames.map((game, i) => (
            <AdvancedMarker
                key={i}
                position={{ lat: parseFloat(game?.latitude), lng: parseFloat(game?.longitude) }}
                onClick={() => handleMarkerClick(game)}
            >
                <Pin background={colorHashMap[parseInt(game?.gameType)]} glyphColor={'#000'} borderColor={'#000'} />
            </AdvancedMarker>
        ));
    }, [availableGames]);

    if (center.lat === 30.00) {
        return <Typography>Loading map...</Typography>;
    }

    return (
        <APIProvider apiKey={googleApi}>
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
                {center?.lat === 40.748440 ? (
                    <Box>Enable Location...</Box>
                ) : (
                    <AdvancedMarker
                        key={'home-marker'}
                        position={{ lat: parseFloat(center?.lat), lng: parseFloat(center?.lng) }}
                    >
                        <Pin background={'red'} glyphColor={'#000'} borderColor={'#000'} />
                    </AdvancedMarker>
                )}
            </Map>
        </APIProvider>
    );
}




