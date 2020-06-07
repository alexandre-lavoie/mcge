import React, { useState, useEffect } from 'react';
import { Grid, Card, List, ListItem, ListItemText, CardHeader, CardContent, CardActions, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { io } from '../_app';

const LobbyPage: React.FC = () => {
    const [rooms, setRooms] = useState<string[]>([]);
    const [games, setGames] = useState<string[]>([]);
    const [game, setGame] = useState<string>('');
    const [openDialog, setDialog] = useState(false);
    const history = useRouter();

    useEffect(() => {
        io.emit('getRooms');
        io.emit('getGames');

        io.off('getRooms').on('getRooms', (rooms: string[]) => {
            setRooms(rooms);
        });

        io.off('getGames').on('getGames', (games: string[]) => {
            setGames(games);
        });
    }, []);

    useEffect(() => {
        io.off('createRoom').on('createRoom', (response: {socket_id: string, room: string}) => {
            setRooms([...rooms, response.room]);

            if(io.id == response.socket_id) {
                history.push({pathname:'/game', query: {room: response.room}});
            }
        });
    }, [rooms]);

    return (
        <>
            <Dialog
                open={openDialog}
                onClose={() => setDialog(false)}
            >
                <DialogTitle>New Room</DialogTitle>
                <DialogContent>
                    <FormControl
                        style={{width: '100%'}}
                    >
                        <InputLabel>Game</InputLabel>
                        <Select
                            onChange={e => setGame(e.target.value as string)}
                            value={game}
                        >
                            {games.map((game, index) => <MenuItem value={game} key={index}>{game}</MenuItem>)}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button color='secondary' onClick={() => setDialog(false)}>Cancel</Button>
                    <Button color='primary' onClick={() => {io.emit('createRoom', game); setDialog(false);}}>Create</Button>
                </DialogActions>
            </Dialog>

            <Grid
                container
                style={{ width: '100%', height: '100vh' }}
                direction="column"
                justify='center'
                alignItems='center'
                spacing={6}
            >
                <Grid item>
                    <Card>
                        <CardHeader title="Lobby" />
                        <CardContent>
                            <List>
                                {
                                    rooms.map((room, index) => <Tooltip title="Join Room"><ListItem key={index} button onClick={() => history.push({pathname:'/game', query: {room}})}><ListItemText primary={room} /></ListItem></Tooltip>)
                                }
                            </List>
                        </CardContent>
                        <CardActions>
                            <Grid container>
                                <Grid xs item container>

                                </Grid>
                                <Grid xs={3} item container justify='flex-end'>
                                    <Grid item>
                                        <Tooltip title="Create Room">
                                            <IconButton onClick={() => setDialog(true)}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

export default LobbyPage;