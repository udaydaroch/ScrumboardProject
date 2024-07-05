import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TeamProvider } from '../src/Pages/BoardComponents/TeamContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <TeamProvider>
        <App />
    </TeamProvider>
);

