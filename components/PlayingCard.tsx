import React, { useState } from 'react';
import { Paper, Typography, Grid, Button } from '@material-ui/core';
import { ICard } from './Interface';

interface PropsPlayingCard {
    card?: ICard,
    onClick?: (() => void),
    selected?: boolean,
    isCurrentPlayer?: boolean,
    theme?: { [key: string]: string }
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
        if(props.theme) {
            let color = props.theme[suit];
            return (color) ? color : 'none';
        } else {
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
                    border: (props.selected || props.isCurrentPlayer) ? `0.25em solid ${(props.selected) ? 'red' : 'white'}` : '0'
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => (props.onClick) ? props.onClick() : {}}
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