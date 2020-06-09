import React from 'react';
import { useRouter } from 'next/router';
import { Grid, Button, Typography } from '@material-ui/core';

const EndPage: React.FC = () => {
    const history = useRouter();

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

export default EndPage;