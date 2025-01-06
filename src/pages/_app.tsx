import '../styles/styles.css';
import { Provider } from 'react-redux';
import store from '../store';

function MyApp({ Component, pageProps }: { Component: React.FC; pageProps: Record<string, unknown> }) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
}

export default MyApp;
