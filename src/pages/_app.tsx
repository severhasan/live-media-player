// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../models/app.d.ts" />

import Head from 'next/head';
import React from 'react';
import Navigation from '../containers/Navigation';
// import styled from 'styled-components';
import '../../public/css/main.css';

// const Container = styled.div`
//     max-width: 1140px;
//     border: 1px solid white;
//     border-radius: 6px;
//     margin: 40px auto 0 auto;
//     color: white;
//     padding: 20px;
// `;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function MyApp({ Component, pageProps }) {

    return (
        <React.Fragment>
            <Head>
                <title>Live Media App</title>
                <meta charSet="utf-8" />
            </Head>
            <Navigation />
            <div id='live-player-app'>
                <Component {...pageProps} />
            </div>
        </React.Fragment>
    );
}
