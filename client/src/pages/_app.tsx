// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../models/common.d.ts" />

import Head from 'next/head';
import React from 'react';
import Navigation from '../containers/Navigation';
import '../../public/css/main.css';


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
