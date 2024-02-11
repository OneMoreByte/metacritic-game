"use client"
import { Button, Card, Container, Grid, TextField} from "@mui/material";
import GameSearch from "../components/game-search";
import { useCallback, useState } from "react";
import Player from "../components/player";




const Home = (props) => {
    const [newPlayer, setNewPlayer] = useState('');
    const [players, setPlayers] = useState([]);

    const createNewPlayer = useCallback((newName) =>  {
        setPlayers((previous) => {
            if(previous.filter((entry) => entry.name === newName).length >= 1) {
                return previous;
            }
            let newPlayersArray = [...previous];
            newPlayersArray.push({
                name: newName,
                score: 0
            })
            return newPlayersArray;
        });
        clearPlayerEntry();
    }, [players]);

    const clearPlayerEntry = useCallback(() =>  {
        setNewPlayer('');
    }, []);

    const addScore = useCallback((name) => {
        console.log('Name', name);
        setPlayers((previous) => {
            return previous.map((player) => {
                return player.name === name ? {...player, score: player.score + 1} : player
            })
        });
    }, []);

    const subtractScore = useCallback((name) => {
        console.log('Name', name);
        setPlayers((previous) => {
            return previous.map((player) => {
                return player.name === name ? {...player, score: player.score - 1} : player
            })
        });
    }, []);

    return (
        <div>
            <Card
                sx={{
                    marginTop: '5px',
                    minHeight: '90vh',
                    minWidth: '70vh'
                }}
            >   
                <Grid container>
                    <Grid item xs={6}>
                        <GameSearch/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Add Player"
                            placeholder="Name"
                            value={newPlayer}
                            onChange={e =>setNewPlayer(e.target.value)}
                        />
                        <Button
                            variant={"contained"}
                            onClick={() => createNewPlayer(newPlayer)}
                        >
                            {'Add'}
                        </Button>
                    </Grid>
                    <Grid item xs={5}>
                        {
                            players.map((player, key) => (
                                <Player key={key} player={player} add={addScore} subtract={subtractScore}/>
                            ))
                        }  
                    </Grid>
                </Grid>
                
                <h1>Hello Jack</h1>
            </Card>
        </div>
    );
}

export default Home;