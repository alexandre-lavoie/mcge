import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, Button, Dialog, DialogTitle, DialogActions, DialogContent, Typography } from '@material-ui/core';
import { io } from '../_app';
import { ICard, IGameState, IMove, IPrompt, IResponse } from '../../components/Interface';
import PlayersCard from '../../components/PlayersCard';
import PlayerDeck from '../../components/PlayerDeck';

const GamePage: React.FC = () => {
    const [selectedCard, setSelectedCard] = useState<ICard | undefined>(undefined);
    const [gameState, setGameState] = useState<IGameState>({ phase: 'waiting', players: [], currentPlayer: null, centerHand: [] });
    const [prompt, setPrompt] = useState<IPrompt>({ id: '', title: '', content: '', options: [] });
    const [shareLink, setShareLink] = useState('');

    const history = useRouter();

    const selectCard = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined, card: ICard | undefined) => {
        if (selectedCard && card) {
            if (selectedCard.id != card.id) {
                io.emit('move', { from: selectedCard, to: card } as IMove);
            }

            setSelectedCard(undefined);
        } else {
            setSelectedCard(card);
        }
    }

    const promptResponse = (option: string) => {
        io.emit('prompt', { id: prompt.id, option } as IResponse);
        setPrompt({ id: '', title: '', content: '', options: [] });
    }

    useEffect(() => {
        let room = new URL(window.location.href).searchParams.get('room') as string;

        io.emit('joinRoom', room);

        setShareLink(`${window.location.origin}/?room=${room}`)

        io.off('update').on('update', (gameState: IGameState) => {
            if (gameState == null || gameState.players.length == 0) {
                history.push('/lobby');
            } else {
                setGameState(gameState);
            }
        });

        io.off('prompt').on('prompt', (prompt: IPrompt) => {
            console.log(prompt);
            setPrompt(prompt)
        });

        return () => {
            io.emit('leaveRoom');
        }
    }, []);

    switch (gameState.phase) {
        case "waiting":
            return (
                <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
                    <Grid container alignItems='center' justify='center' direction='column' spacing={3} style={{ width: '100%', height: '100vh' }}>
                        <Grid item>
                            <PlayersCard players={gameState.players} />
                        </Grid>
                        <Grid container item justify='center' spacing={3}>
                            <Grid item>
                                <Button color='secondary' variant='contained' onClick={() => {
                                    let input = document.getElementById('shareLink');
                                    input?.removeAttribute('hidden');
                                    (input as any).select();
                                    document.execCommand('copy');
                                    input?.setAttribute('hidden', 'true');
                                }}>
                                    Share
                                </Button>
                            </Grid>

                            <Grid item>
                                <Button color='primary' variant='contained' onClick={() => io.emit('start')}>
                                    Start
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <input hidden id="shareLink" value={shareLink} />
                </div>
            );
        case "started":
            let tempPlayers = [...gameState.players];
            let thisIndex = tempPlayers.findIndex(p => p.id == io.id);

            if (thisIndex >= 0 && tempPlayers[thisIndex].hand.length > 0) {
                tempPlayers = [...tempPlayers.splice(thisIndex, tempPlayers.length), ...tempPlayers];
            }

            let thisPlayer = tempPlayers.shift();

            return (
                <>
                    <Dialog
                        open={prompt.id != ''}
                    >
                        <DialogTitle>{prompt.title}</DialogTitle>
                        <DialogContent>
                            <Typography>{prompt.content}</Typography>
                        </DialogContent>
                        <DialogActions>
                            {
                                prompt.options.map((option, index) => <Button key={index} onClick={() => promptResponse(option)}>{option}</Button>)
                            }
                        </DialogActions>
                    </Dialog>

                    <Grid container direction='column' style={{ width: '100%', height: '100vh', overflow: 'hidden' }} spacing={3} justify='space-between'>
                        <Grid item>
                            {tempPlayers.map((player, index) => <PlayerDeck
                                selectedCard={selectedCard}
                                currentPlayer={gameState.currentPlayer}
                                onClick={selectCard}
                                player={player}
                                style={{ padding: (index == 0) ? '1em 0em 0.25em 0em' : '0.25em 0em' }}
                            />)}
                        </Grid>

                        <Grid container justify='center' item>
                            <Grid item>
                                <PlayerDeck selectedCard={selectedCard} onClick={selectCard} alignItems='center' cards={gameState.centerHand} />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <PlayerDeck
                                onPass={() => io.emit('pass')}
                                hasPassButton={true}
                                selectedCard={selectedCard}
                                currentPlayer={gameState.currentPlayer}
                                onClick={selectCard} player={thisPlayer}
                            />
                        </Grid>
                    </Grid>
                </>
            );
        default:
        case "end":
            return (
                <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
                    <Grid container direction='column' alignItems='center' justify='center' style={{ width: '100%', height: '100vh' }} spacing={3}>
                        <Grid item>
                            <Typography variant='h3'>Game Over</Typography>
                        </Grid>
                        <Grid item>
                            <Button onClick={() => history.push('/lobby')} variant='outlined'>
                                Lobby
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            );
    }
}

export default GamePage;