import React from 'react';
import '../styles/styles.css';

function MyApp({ Component, pageProps }: { Component: React.FC; pageProps: Record<string, unknown> }) {
    return (
        <Component {...pageProps} />
    );
}

export default MyApp;
