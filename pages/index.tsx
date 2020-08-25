import React, { useState } from 'react';
import { Typography, Grid, Button, TextField } from '@material-ui/core';
import { useRouter } from 'next/router';
import { io } from './_app';

const LandingPage: React.FC = () => {

    const [name, setName] = useState<string>('');
    const history = useRouter();

    return (
        <Grid 
            container
            style={{width: '100%', height: '100vh'}}
            direction="column"
            justify='center'
            alignItems='center'
            spacing={6}
        >
            <Grid item>
                <Typography variant="h1">MCGE</Typography>
            </Grid>
            <Grid item>
                <TextField value={name} label="Name" variant="outlined" onChange={(e) => setName(e.target.value)} />
            </Grid>
            <Grid item>
                <Button variant="outlined" onClick={() => {
                    if(name.length > 0) {
                        io.emit('setName', name);

                        let room = new URL(window.location.href).searchParams.get('room');

                        if(room) {
                            history.push({pathname: '/game', query: {room}})
                        } else {
                            history.push('/lobby');
                        }
                    }
                }}>Play</Button>
            </Grid>
        </Grid>
    );
}

export default LandingPage;