"use client"
import { Autocomplete, TextField } from "@mui/material";


const tempGames = [
    { label: 'Game 1', score: 80 },
    { label: 'Game 2', score: 81 },
    { label: 'Game 3', score: 82 },
    { label: 'Game 4', score: 83 },
    { label: 'Game 5', score: 84 },
    { label: 'Game 6', score: 85 },
    { label: 'Game 7', score: 86 },
    { label: 'Game 8', score: 87 },
    { label: 'Game 9', score: 88 },
    { label: 'Game 10', score: 89 }
];

const GameSearch = () => {
    return (
        <>
             <Autocomplete
                disablePortal
                id="game-auto-complete"
                options={tempGames}
                sx={{ width: 400 }}
                renderInput={(params) => <TextField {...params} label="Game" />}
            />
        </>
    );
}

export default GameSearch;