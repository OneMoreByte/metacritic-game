"use client"
import React from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Add, Remove} from "@mui/icons-material";

const Player = React.memo((props) => {
    const {name, score} = props.player;
    const {add, subtract} = props;

    return (
        <>  
        <Grid container>
            <Grid item xs={4}>
                <Button 
                    variant="contained"
                    onClick={() => subtract(name)}
                >
                    <Remove/>
                </Button>
            </Grid>
            <Grid item xs={4}>
                <Typography>
                    {`${name}: ${score} points`}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Button 
                    variant="contained"
                    onClick={() => add(name)}
                >
                    <Add/>
                </Button>
            </Grid>
        </Grid>
        </>
    );
});

export default Player;