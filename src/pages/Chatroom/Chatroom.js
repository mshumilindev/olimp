import React, { useEffect } from 'react';
import Peer from 'simple-peer';

const peer1 = new Peer({ initiator: true });
const peer2 = new Peer();

export default function Chatroom() {
    useEffect(() => {
        peer1.on('signal', data => {
            peer2.signal(data)
        });

        peer2.on('signal', data => {
            peer1.signal(data)
        });

        peer1.on('connect', () => {
            console.log('1 connected');
        });
        peer2.on('connect', () => {
            console.log('2 connected');
        });

        peer1.on('data', data => {
            console.log('2: ' + data)
        });

        peer2.on('data', data => {
            console.log('1: ' + data)
        });
    }, []);

    return (
        <div>
            <input type="text" onChange={e => sendMessage(e.target.value)}/>
        </div>
    );

    function sendMessage(message) {
        peer1.send(message);
    }
}
