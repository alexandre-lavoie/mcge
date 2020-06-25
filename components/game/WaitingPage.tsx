import React, { useState, useEffect } from 'react';
import { IPlayer } from 'mcge';
import PlayersCard from '../PlayersCard';
import { Grid, Button } from '@material-ui/core';

interface PropsPlayerDeck {
    players: IPlayer[],
    onStart: () => void
}

const WaitingPage: React.FC<PropsPlayerDeck> = (props) => {
    const [shareLink, setShareLink] = useState('');

    useEffect(() => {
        let room = new URL(window.location.href).searchParams.get('room') as string;

        setShareLink(`${window.location.origin}/?room=${room}`);
    });

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <Grid container alignItems='center' justify='center' direction='column' spacing={3} style={{ width: '100%', height: '100vh' }}>
                <Grid item>
                    <PlayersCard players={props.players} />
                </Grid>
                <Grid container item justify='center' spacing={3}>
                    <Grid item>
                        <Button variant='outlined' onClick={() => {
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
                        <Button variant='outlined' onClick={() => props.onStart()}>
                            Start
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <input hidden id="shareLink" value={shareLink} />
        </div>
    );
}

export default WaitingPage;