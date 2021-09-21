// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../models/common.d.ts" />

import Head from 'next/head';
import React from 'react';
import Navigation from '../containers/Navigation';
import '../../public/css/main.css';

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
config.autoAddCss = false;

library.add(faUser);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function MyApp({ Component, pageProps }) {
    return (
        <React.Fragment>
            <Head>
                <title>Live Media App</title>
                <meta charSet='utf-8' />
            </Head>
            <Navigation />
            <div id='live-player-app' className='container'>
                <Component {...pageProps} />
            </div>
        </React.Fragment>
    );
}
