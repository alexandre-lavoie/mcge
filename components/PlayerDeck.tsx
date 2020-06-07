import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { IPlayer, ICard } from './Interface';
import PlayingCard from './PlayingCard';

interface PropsPlayerDeck {
    player?: IPlayer,
    cards?: ICard[],
    onClick?: ((event?: React.MouseEvent<HTMLDivElement, MouseEvent>, card?: ICard) => void),
    onPass?: (() => void),
    style?: React.CSSProperties,
    alignItems?: "stretch" | "center" | "flex-start" | "flex-end" | "baseline",
    selectedCard?: ICard,
    currentPlayer?: IPlayer | null,
    hasPassButton?: boolean
}

const PlayerDeck: React.FC<PropsPlayerDeck> = (props) => {

    let hand: ICard[] = Array(5).fill({ id: -1, value: '' });

    if (props.cards != null) {
        hand = props.cards;
    }

    if (props.player && props.player.hand) {
        hand = props.player.hand;
    }

    if (props.hasPassButton) {
        return (
            <Grid container spacing={1} justify='center' alignItems={props.alignItems} style={props.style}>
                <Grid container item xs={12} justify='center'>
                    <Grid item>
                        <Button variant='outlined' onClick={() => (props.onPass) ? props.onPass() : {}}>Pass</Button>
                    </Grid>
                </Grid>
                <Grid container item spacing={1} xs={12} justify='center'>
                    {hand.map((card, index) => <Grid item>
                        <PlayingCard
                            selected={props.selectedCard && props.selectedCard.id == card.id}
                            isCurrentPlayer={props.currentPlayer != null && props.player != null && props.currentPlayer.id == props.player.id}
                            onClick={(e) => (props.onClick) ? props.onClick(e, card) : {}}
                            card={card}
                        />
                    </Grid>)}
                </Grid>
            </Grid>
        );
    } else {
        return (
            <Grid container spacing={1} justify='center' alignItems={props.alignItems} style={props.style}>
                {hand.map((card, index) => <Grid item>
                    <PlayingCard
                        selected={props.selectedCard && props.selectedCard.id == card.id}
                        isCurrentPlayer={props.currentPlayer != null && props.player != null && props.currentPlayer.id == props.player.id}
                        onClick={(e) => (props.onClick) ? props.onClick(e, card) : {}}
                        card={card}
                    />
                </Grid>)}
            </Grid>
        );
    }
}

export default PlayerDeck;