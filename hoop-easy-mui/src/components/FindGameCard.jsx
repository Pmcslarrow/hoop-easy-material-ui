import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Avatar } from "@mui/material";
import { useTheme } from "@emotion/react";

// Pass in the object that contains all the information about the game
export default function FindGameCard({ gameType }) {
  const theme = useTheme()
  const colorHashMap = {
    1: theme.palette.secondary.main,
    2: theme.palette.secondary.darkBlue,
    3: theme.palette.secondary.lightBlue,
    4: theme.palette.secondary.lightRed,
    5: theme.palette.secondary.red
  }
  return (
    <Card>
        <Box sx={{display: 'flex', padding: 1, backgroundColor: colorHashMap[gameType]}}>
            <Avatar sx={{margin: 1, backgroundColor: 'white', color: 'black'}}>{gameType}v{gameType}</Avatar>
        </Box>
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                4/8/2024
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
                2:00 PM
            </Typography>
            <Typography variant="body2" color="text.secondary">
                3162 East Eagle View Circle, Sandy, UT, 84092
            </Typography>
        </CardContent>
        <CardActions>
            <Button sx={{color: colorHashMap[gameType]}}>Join Game</Button>
        </CardActions>
    </Card>
  
  );
}