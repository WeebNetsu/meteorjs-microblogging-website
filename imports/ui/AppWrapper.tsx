import React from 'react';
import App from './App';
import UserContextProvider from './components/SiteContextProvider';

const AppWrapper: React.FC = () => {
    return (
        <UserContextProvider>
            <App />
        </UserContextProvider>
    );
};

export default AppWrapper;
