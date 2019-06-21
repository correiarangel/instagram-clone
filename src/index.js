
import React from 'react';
import {YellowBox} from 'react-native'

//ignora erro  socket inteface feed
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket'
])

import Routes from './routes'

export default function App() {
    return <Routes />
}
