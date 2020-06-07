import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid, Button } from '@material-ui/core';
import { ICard } from './Interface';

interface PropsPlayingCard {
    card?: ICard,
    onClick?: ((event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void),
    selected?: boolean,
    isCurrentPlayer?: boolean
}

const PlayingCard: React.FC<PropsPlayingCard> = (props) => {
    const [hover, setHover] = useState<boolean>(false);

    let value = '';
    let suit = '';

    if(props.card != null && props.card.value != null) {
        value = props.card.value[0];
        suit = props.card.value[1];
    }

    const getColor = () => {
        switch(suit) {
            case 'G':
                return '#4AAA51';
            case 'B':
                return '#1B6DA9';
            case 'R':
                return '#F50057';
            case 'Y':
                return '#FFC107';
            case 'B':
            case '-':
            default:
                return 'none';
        }
    }

    return (
        <Button style={{
            padding: 0
        }}>
            <Paper
                style={{
                    width: "7em",
                    height: "10em",
                    padding: '0.5em',
                    userSelect: 'none',
                    backgroundColor: getColor(),
                    border: (props.selected || props.isCurrentPlayer) ? `0.1em solid ${(props.selected) ? 'red' : 'white'}` : '0'
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => (props.onClick) ? props.onClick(e) : {}}
                elevation={(hover || props.selected) ? 12 : 0}
            >
                <Grid container direction='column' justify='space-between' style={{ height: '100%' }}>
                    <Grid container item xs>
                        <Grid container item xs={6}>
                            <Grid item>
                                <Typography variant="h6">{value}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container item xs={6} justify="flex-end">
                            <Grid item>
                                <Typography variant="h6">{suit}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item xs alignItems='center' justify='center'>
                        <Grid item>
                            <Typography variant="h4">{value}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs alignItems='flex-end'>
                        <Grid container item xs={6}>
                            <Grid item>
                                <Typography variant="h6">{suit}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container item xs={6} justify="flex-end">
                            <Grid item>
                                <Typography variant="h6">{value}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Button>
    );
}

export default PlayingCard;