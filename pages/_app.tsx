import React from 'react'
import App from 'next/app'
import Head from 'next/head';
import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import socketio from 'socket.io-client';
import './app.css';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    }
});

export const io = socketio();

export default class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        
        return (
            <ThemeProvider theme={theme}>
                <Head>
                    <link rel="shortcut icon" href="/favicon.png" />
                </Head>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        )
    }
}