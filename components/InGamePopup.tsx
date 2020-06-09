import React from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Typography, Button } from '@material-ui/core';
import { IPrompt } from './Interface';

interface PropsInGamePopup {
    prompt: IPrompt,
    onResponse: (option: string) => void
}

const InGamePopup: React.FC<PropsInGamePopup> = (props) => {
    return (
        <Dialog
            open={props.prompt.id != ''}
        >
            <DialogTitle>{props.prompt.title}</DialogTitle>
            <DialogContent>
                <Typography>{props.prompt.content}</Typography>
            </DialogContent>
            <DialogActions>
                {
                    props.prompt.options.map((option, index) => <Button key={index} onClick={() => props.onResponse(option)}>{option}</Button>)
                }
            </DialogActions>
        </Dialog>
    );
}

export default InGamePopup;