import React from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { IPlayer, ICard } from './Interface';
import PlayingCard from './PlayingCard';

interface PropsPlayerDeck {
    player?: IPlayer,
    cards?: ICard[],
    onClick?: ((card?: ICard) => void),
    onButtonClick?: ((button: string) => void),
    style?: React.CSSProperties,
    alignItems?: "stretch" | "center" | "flex-start" | "flex-end" | "baseline",
    selectedCard?: ICard,
    currentPlayer?: IPlayer | null,
    buttons?: string[],
    theme?: { [key: string]: string }
}

const PlayerDeck: React.FC<PropsPlayerDeck> = (props) => {

    let hand: ICard[] = Array(5).fill({ id: -1, value: '' });

    if (props.cards != null) {
        hand = props.cards;
    }

    if (props.player && props.player.hand) {
        hand = props.player.hand;
    }

    if (props.buttons) {
        return (
            <Grid container spacing={1} justify='center' alignItems={props.alignItems} style={props.style}>
                <Grid container item xs={12} justify='center' spacing={1}>
                    {
                        props.buttons.map((button, index) => <Grid item key={index}>
                            <Button variant='outlined' onClick={() => (props.onButtonClick) ? props.onButtonClick(button) : {}}>{button}</Button>
                        </Grid>)
                    }
                </Grid>
                <Grid container item spacing={1} xs={12} justify='center'>
                    {hand.map((card, index) => <Grid item key={index}>
                        <PlayingCard
                            theme={props.theme}
                            selected={props.selectedCard && props.selectedCard.id == card.id}
                            isCurrentPlayer={props.currentPlayer != null && props.player != null && props.currentPlayer.id == props.player.id}
                            onClick={() => (props.onClick) ? props.onClick(card) : {}}
                            card={card}
                        />
                    </Grid>)}
                </Grid>
            </Grid>
        );
    } else {
        return (
            <>
                <Grid container spacing={1} justify='center' alignItems={props.alignItems} style={props.style}>
                    {hand.map((card, index) => <Grid item key={index}>
                        <PlayingCard
                            theme={props.theme}
                            selected={props.selectedCard && props.selectedCard.id == card.id}
                            isCurrentPlayer={props.currentPlayer != null && props.player != null && props.currentPlayer.id == props.player.id}
                            onClick={() => (props.onClick) ? props.onClick(card) : {}}
                            card={card}
                        />
                    </Grid>)}
                </Grid>
                <Typography align='center'>{(props.player) ? props.player.name : ''}</Typography>
            </>
        );
    }
}

export default PlayerDeck;