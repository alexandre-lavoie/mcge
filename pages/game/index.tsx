import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid } from '@material-ui/core';
import { io } from '../_app';
import { ICard, IGameState, IMove, IPrompt, IResponse } from '../../components/Interface';
import PlayerDeck from '../../components/PlayerDeck';
import WaitingPage from '../../components/game/WaitingPage';
import EndPage from '../../components/game/EndPage';
import InGamePopup from '../../components/InGamePopup';

const GamePage: React.FC = () => {
    const [selectedCard, setSelectedCard] = useState<ICard | undefined>(undefined);
    const [gameState, setGameState] = useState<IGameState>({ phase: 'waiting', players: [], currentPlayer: null, centerHand: [] });
    const [prompt, setPrompt] = useState<IPrompt>({ id: '', title: '', content: '', options: [] });
    const [theme, setTheme] = useState<{[key: string]: string}>({});
    const [buttons, setButtons] = useState<string[]>([]);
    const history = useRouter();

    const selectCard = (card: ICard | undefined) => {
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

        io.emit('getTheme');

        io.emit('getButtons');

        io.off('update').on('update', (gameState: IGameState) => {
            if (gameState == null || gameState.players.length == 0) {
                history.push('/lobby');
            } else {
                setGameState(gameState);
            }
        });

        io.off('getTheme').on('getTheme', (theme: {[key: string]: string}) => setTheme(theme));

        io.off('getButtons').on('getButtons', (buttons: string[]) => setButtons(buttons));

        io.off('prompt').on('prompt', (prompt: IPrompt) => setPrompt(prompt));

        return () => {
            io.emit('leaveRoom');
        }
    }, []);

    switch (gameState.phase) {
        case "waiting":
            return <WaitingPage players={gameState.players} onStart={() => io.emit('start')} />
        case "started":
            let tempPlayers = [...gameState.players];
            let thisIndex = tempPlayers.findIndex(p => p.id == io.id);

            if (thisIndex >= 0 && tempPlayers[thisIndex].hand.length > 0) {
                tempPlayers = [...tempPlayers.splice(thisIndex, tempPlayers.length), ...tempPlayers];
            }

            let thisPlayer = tempPlayers.shift();

            return (
                <>
                    <InGamePopup prompt={prompt} onResponse={(option: string) => promptResponse(option)} />

                    <Grid container direction='column' style={{ width: '100%', height: '100vh', overflow: 'hidden' }} spacing={3} justify='space-between'>
                        <Grid item>
                            {tempPlayers.map((player, index) => <PlayerDeck
                                theme={theme}
                                selectedCard={selectedCard}
                                currentPlayer={gameState.currentPlayer}
                                onClick={selectCard}
                                player={player}
                                style={{ padding: (index == 0) ? '1em 0em 0.25em 0em' : '0.25em 0em' }}
                            />)}
                        </Grid>

                        <Grid container justify='center' item>
                            <Grid item>
                                <PlayerDeck 
                                    theme={theme}
                                    selectedCard={selectedCard} 
                                    onClick={selectCard} 
                                    alignItems='center' 
                                    cards={gameState.centerHand} 
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <PlayerDeck
                                theme={theme}
                                buttons={buttons}
                                onButtonClick={button => io.emit('buttonClick', button)}
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
            return <EndPage />
    }
}

export default GamePage;