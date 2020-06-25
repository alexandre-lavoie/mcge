import React from 'react';
import { Card, CardHeader, CardContent, List, ListItem, ListItemText } from '@material-ui/core';
import { IPlayer } from 'mcge';

const PlayersCard: React.FC<{ players: IPlayer[], style?: React.CSSProperties }> = (props) => {
    return (
        <Card style={props.style}>
            <CardHeader title="Players" />
            <CardContent>
                <List>
                    {
                        props.players.map((player, index) => <ListItem key={index}>
                            <ListItemText primary={(player.name) ? player.name : player.id}/>
                        </ListItem>)
                    }
                </List>
            </CardContent>
        </Card>
    );
}

export default PlayersCard;