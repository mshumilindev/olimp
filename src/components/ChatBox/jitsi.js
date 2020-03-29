/* global JitsiMeetJS, $ */

class Jitsi {
    constructor() {
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.connection = null;
        this.isJoined = false;
        this.room = null;
        this.localTracks = [];
        this.remoteTracks = {};
        window.addEventListener('beforeunload', this.stop);
        window.addEventListener('unload', this.stop);
    }

    start({containers, user, roomName, onDisplayNameChange}) {
        const self = this;
        const chatConfig = {
            "options": {
                "hosts": {
                    "domain": "beta.meet.jit.si",
                    "muc": "conference.beta.meet.jit.si"
                },
                "bosh": "https://beta.meet.jit.si/http-bind",
                "clientNode": "http://jitsi.org/jitsimeet"
            },
            "confOptions": {
                "openBridgeChannel": true
            },
            "initOptions": {
                "disableAudioLevels": true,
                "desktopSharingChromeDisabled": true,
                "desktopSharingFirefoxDisabled": true,
                "disableSimulcast": true
            }
        };

        function onLocalTracks(tracks) {
            self.localTracks = tracks;
            for (let i = 0; i < self.localTracks.length; i++) {
                self.localTracks[i].addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () => console.log('local track muted'));
                self.localTracks[i].addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => console.log('local track stoped'));
                if ( self.localTracks[i].getType() === 'video' ) {
                    $(containers.local).append(`<video autoplay='1' muted playsinline id='localVideo${i}' />`);
                    self.localTracks[i].attach(containers.local.querySelector(`#localVideo` + i));
                }
                if ( self.isJoined ) {
                    self.room.addTrack(self.localTracks[i]);
                }
            }
            const userDiv = document.createElement('div');
            userDiv.className = 'chatroom__user';

            const userInner = `<div class="chatroom__user-avatar-holder"><i class="chatroom__user-avatar-placeholder fa fa-user"></i><div class="chatroom__user-avatar" style="background-image: url(${user.avatar})"></div></div><div class="chatroom__user-name">${user.name.split(' ').join('<br/>')}</div>`;

            containers.organizer.appendChild(userDiv);
            userDiv.innerHTML = userInner;
            onDisplayNameChange(null, user.name);
        }

        function onRemoteTrack(track) {
            if (track.isLocal()) {
                return;
            }
            const participant = track.getParticipantId();

            if (!self.remoteTracks[participant]) {
                self.remoteTracks[participant] = [];
            }
            track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () => console.log('remote track muted'));
            track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => console.log('remote track stoped'));
            const id = track.getType() + participant;

            if (track.getType() === 'video') {
                $(containers.remote).append(`<video autoplay='1' muted playsinline id='video${participant}' />`);
            } else {
                $(containers.remote).append(`<audio autoplay='1' id='audio${participant}' />`);
            }
            track.attach(document.getElementById(id));
        }

        function onConferenceJoined() {
            console.log('conference joined!');
            self.room.sendTextMessage(JSON.stringify({name: user.name, avatar: user.avatar}));
            self.isJoined = true;
            for (let i = 0; i < self.localTracks.length; i++) {
                self.room.addTrack(self.localTracks[i]);
            }
        }

        function onUserLeft(id) {
            console.log('user left');
            if (!self.remoteTracks[id]) {
                return;
            }
            const tracks = self.remoteTracks[id];

            if ( document.getElementById('user' + id) ) {
                document.getElementById('user' + id).remove();
            }

            for (let i = 0; i < tracks.length; i++) {
                tracks[i].detach(document.getElementById(tracks[i].getType() + id));
            }
        }

        function onConnectionSuccess() {
            self.room = self.connection.initJitsiConference(('olimp_remote_' + roomName).toLowerCase(), chatConfig.confOptions);
            self.room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
            self.room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => console.log(`track removed!!!${track}`));
            self.room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
            self.room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
                // self.room.sendTextMessage(JSON.stringify({name: user.name, avatar: user.avatar}));
                self.remoteTracks[id] = [];
                if ( !document.querySelector('user' + id) ) {
                    const userDiv = document.createElement('div');
                    userDiv.className = 'chatroom__user empty';
                    userDiv.id = 'user' + id;

                    const userInner = `<div class="chatroom__user-avatar-holder"><i class="chatroom__user-avatar-placeholder fa fa-user"></i><div class="chatroom__user-avatar"></div></div><div class="chatroom__user-name"></div>`;

                    containers.participants.appendChild(userDiv);
                    userDiv.innerHTML = userInner;
                }
            });
            self.room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
            self.room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => console.log(`${track.getType()} - ${track.isMuted()}`));
            self.room.on(JitsiMeetJS.events.conference.MESSAGE_RECEIVED, (id, text) => {
                const userDiv = document.querySelector('#user' + id);
                const newText = JSON.parse(text);

                if ( userDiv ) {
                    userDiv.querySelector('.chatroom__user-avatar').style.backgroundImage = 'url(' + newText.avatar + ')';
                    userDiv.querySelector('.chatroom__user-name').innerHTML = newText.name;
                    userDiv.classList.remove('empty');
                    userDiv.querySelector('.chatroom__user-name').innerHTML = newText.name.split(' ').join('<br/>');
                }
                onDisplayNameChange(id, newText.name);
            });
            self.room.join();
        }

        function onConnectionFailed() {
            console.error('Connection Failed!');
        }

        function disconnect() {
            console.log('disconnect!');
            self.connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
            self.connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
            self.connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);
        }

        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);

        JitsiMeetJS.init(chatConfig.initOptions);

        self.connection = new JitsiMeetJS.JitsiConnection(null, null, chatConfig.options);

        self.connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
        self.connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
        self.connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);

        self.connection.connect();

        navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

        navigator.getMedia({audio: {volume: 1}}, () => {
            navigator.getMedia({video: {
                    width: { ideal: 480 },
                    height: { ideal: 480 }
                }}, () => {
                JitsiMeetJS.createLocalTracks({devices: ['audio', 'video'], resolution: 480})
                    .then(onLocalTracks)
                    .catch(error => {
                        throw error;
                    });
            }, () => {
                JitsiMeetJS.createLocalTracks({devices: ['audio']})
                    .then(onLocalTracks)
                    .catch(error => {
                        throw error;
                    });
            });
        }, () => {
            navigator.getMedia({video: {
                    width: { ideal: 480 },
                    height: { ideal: 480 }
                }}, () => {
                JitsiMeetJS.createLocalTracks({devices: ['video'], resolution: 480})
                    .then(onLocalTracks)
                    .catch(error => {
                        throw error;
                    });
            }, () => {
                // === Throw error, no devices available
            });
        });
    }

    stop() {
        const self = this;

        for (let i = 0; i < self.localTracks.length; i++) {
            self.localTracks[i].dispose();
        }
        self.room.leave();
        self.connection.disconnect();
    }
}

export default Jitsi;