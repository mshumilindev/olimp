/* global JitsiMeetJS, $ */

let localTracks = [];
let room = null;
let connection = null;
let onShareScreen = null;
let shareScreenTrack = null;
let onLocalTracks = null;

class Jitsi {
    constructor() {
        this.connection = null;
        this.isJoined = false;
        this.room = null;
        this.localTracks = [];
        this.remoteTracks = {};
        window.addEventListener('beforeunload', this.stop);
        window.addEventListener('unload', this.stop);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.toggleMute = this.toggleMute.bind(this);
        this.toggleScreenShare = this.toggleScreenShare.bind(this);
    }

    start({containers, user, roomName, onDisplayNameChange, usersList}) {
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
                "disableAudioLevels": true
            }
        };

        onShareScreen = (tracks) => {
            shareScreenTrack = tracks[0];

            if ( localTracks.find(item => item.type === 'video') ) {
                localTracks.find(item => item.type === 'video').dispose();
                room.replaceTrack(localTracks.find(item => item.type === 'video'), shareScreenTrack);
                containers.remote.querySelector(`#localVideo`).remove();
            }
            else {
                self.room.addTrack(tracks[0]);
            }
        };

        onLocalTracks = (tracks, noUserCreation) => {
            self.localTracks = tracks;
            localTracks = tracks;

            for (let i = 0; i < self.localTracks.length; i++) {
                if ( !noUserCreation ) {
                    self.localTracks[i].addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () => {});
                    self.localTracks[i].addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => {});
                    if (self.localTracks[i].getType() === 'video') {
                        $(containers.remote).append(`<video autoplay='1' muted playsinline id='localVideo' />`);
                        self.localTracks[i].attach(containers.remote.querySelector(`#localVideo`));
                    }
                }
                else {
                    if ( self.localTracks.find(item => item.type === 'video') ) {
                        self.localTracks.find(item => item.type === 'video').addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () => {});
                        self.localTracks.find(item => item.type === 'video').addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => {});
                        if ( self.localTracks.find(item => item.type === 'video').getType() === 'video' ) {
                            if ( !containers.remote.querySelector(`#localVideo`) ) {
                                $(containers.remote).append(`<video autoplay='1' muted playsinline id='localVideo' />`);
                            }
                            self.localTracks[i].attach(containers.remote.querySelector('#localVideo'));
                        }
                    }
                }
                if (self.isJoined) {
                    if ( shareScreenTrack && self.localTracks[i].type === 'video' ) {
                        shareScreenTrack.dispose();
                        room.replaceTrack(shareScreenTrack, self.localTracks[i]);
                    }
                    else {
                        self.room.addTrack(self.localTracks[i]);
                    }
                }
            }
            if ( !noUserCreation ) {
                const userDiv = document.createElement('div');
                userDiv.className = 'chatroom__user';

                const userInner = `<div class="chatroom__user-avatar-holder"><i class="chatroom__user-avatar-placeholder fa fa-user"></i><div class="chatroom__user-avatar" style="background-image: url(${user.avatar})"></div></div><div class="chatroom__user-name">${user.name.split(' ').join('<br/>')}</div>`;

                containers.participants.appendChild(userDiv);
                userDiv.innerHTML = userInner;
                onDisplayNameChange(null, user.name);
            }
        };

        function onRemoteTrack(track) {
            if (track.isLocal()) {
                return;
            }
            const participant = track.getParticipantId();

            if (!self.remoteTracks[participant]) {
                self.remoteTracks[participant] = [];
            }
            track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () => {});
            track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, id => {});
            let id = null;

            setTimeout(() => {
                if ( track.videoType === 'desktop') {
                    id = 'shareScreen' + participant;
                }
                else {
                    id = track.getType() + participant
                }

                if ( track.videoType === 'desktop' ) {
                    if ( containers.remote.querySelector('#video' + participant) ) {
                        containers.remote.querySelector('#video' + participant).remove();
                    }
                    $(containers.shareScreen).append(`<video autoplay='1' muted playsinline id='shareScreen${participant}' />`);
                }
                else {
                    if (track.getType() === 'video') {
                        if ( !document.getElementById('video' + participant) ) {
                            $(containers.remote).append(`<video autoplay='1' muted playsinline id='video${participant}' />`);
                        }
                    } else {
                        if ( !document.getElementById('audio' + participant) ) {
                            $(containers.remote).append(`<audio autoplay='1' id='audio${participant}' />`);
                        }
                    }
                }
                track.attach(document.getElementById(id));
                setTimeout(() => {
                    if ( user.role === 'student' && track.getType() === 'video' ) {
                        const videos = containers.remote.querySelectorAll('video');

                        if ( videos ) {
                            [...videos].forEach(videoItem => {
                                const videoID = videoItem.id.replace('video', '');

                                if ( videoID ) {
                                    const userDiv = containers.participants.querySelector(('#user' + videoID));

                                    if ( userDiv ) {
                                        const userName = userDiv.dataset.name;

                                        if ( userName && !videoItem.classList.contains('main-video') ) {
                                            if ( usersList.find(userItem => userItem.name === userName).role === 'student' ) {
                                                videoItem.remove();
                                                track.dispose();
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                }, 100);
            }, 1000);
        }

        function onConferenceJoined() {
            self.room.sendTextMessage(JSON.stringify({name: user.name, avatar: user.avatar}));
            self.isJoined = true;
            for (let i = 0; i < self.localTracks.length; i++) {
                self.room.addTrack(self.localTracks[i]);
            }
        }

        function onUserLeft(id) {
            if (!self.remoteTracks[id]) {
                return;
            }
            const tracks = self.remoteTracks[id];

            if ( document.getElementById('user' + id) ) {
                document.getElementById('user' + id).remove();
            }
            if ( document.getElementById('video' + id) ) {
                document.getElementById('video' + id).remove();
            }
            if ( document.getElementById('audio' + id) ) {
                document.getElementById('audio' + id).remove();
            }

            for (let i = 0; i < tracks.length; i++) {
                tracks[i].detach(document.getElementById(tracks[i].getType() + id));
            }
        }

        function onConnectionSuccess() {
            room = self.room = self.connection.initJitsiConference(('olimp_remote_school' + roomName).toLowerCase(), chatConfig.confOptions);
            self.room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
            self.room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {});
            self.room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
            self.room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
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
            self.room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {});
            self.room.on(JitsiMeetJS.events.conference.MESSAGE_RECEIVED, (id, text) => {
                const userDiv = document.querySelector('#user' + id);
                const newText = JSON.parse(text);

                if ( newText.event ) {
                    $(containers.shareScreen).empty();
                }
                else {
                    if ( userDiv ) {
                        userDiv.querySelector('.chatroom__user-avatar').style.backgroundImage = 'url(' + newText.avatar + ')';
                        userDiv.querySelector('.chatroom__user-name').innerHTML = newText.name;
                        userDiv.dataset.name = newText.name;
                        userDiv.classList.remove('empty');
                        userDiv.querySelector('.chatroom__user-name').innerHTML = newText.name.split(' ').join('<br/>');
                    }
                    onDisplayNameChange(id, newText.name);
                }
            });
            self.room.join();
        }

        function onConnectionFailed() {
        }

        function disconnect() {
            self.connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
            self.connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
            self.connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);
        }

        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);

        JitsiMeetJS.init(chatConfig.initOptions);

        connection = self.connection = new JitsiMeetJS.JitsiConnection(null, null, chatConfig.options);

        self.connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
        self.connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
        self.connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);

        self.connection.connect();

        navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        self.startDevices();
    }

    startDevices(onlyVideo) {
        let i = 0;

        JitsiMeetJS.createLocalTracks({devices: ['audio', 'video'], resolution: 480})
            .then(tracks => onLocalTracks(tracks, onlyVideo))
            .catch(error => {
                JitsiMeetJS.enumerateDevices(devices => {
                    if ( devices.find(item => item.kind === 'videoinput') ) {
                        goThroughVideoDevices(devices, devices.length);
                    }
                    else {
                        JitsiMeetJS.createLocalTracks({devices: ['audio']})
                            .then((tracks) => onLocalTracks(tracks, onlyVideo))
                            .catch();
                    }
                });
            });

        function goThroughVideoDevices(devices, length) {
            if ( devices[i].kind === 'videoinput' ) {
                JitsiMeetJS.createLocalTracks({devices: ['audio', 'video'], cameraDeviceId : devices[i].deviceId, resolution: 480})
                    .then((tracks) => onLocalTracks(tracks, onlyVideo))
                    .catch(error => {
                        i ++;
                        if ( i < length - 1 ) {
                            goThroughVideoDevices(devices, length);
                        }
                    });
            }
            else {
                i ++;
                if ( i < length - 1 ) {
                    goThroughVideoDevices(devices, length);
                }
            }
        }
    }

    stop() {
        for (let i = 0; i < localTracks.length; i++) {
            localTracks[i].dispose();
        }
        if ( shareScreenTrack ) {
            shareScreenTrack.dispose();
        }
        room.leave();
        connection.disconnect();
    }

    toggleMute(value) {
        const audio = localTracks.find(track => track.type === 'audio');

        if ( audio ) {
            if ( value ) {
                audio.mute();
            }
            else {
                audio.unmute();
            }
        }
    }

    toggleScreenShare(value, setShareScreen) {
        if ( value ) {
            JitsiMeetJS.createLocalTracks({devices: ['desktop'], resolution: 480})
                .then(onShareScreen)
                .catch(error => {
                    setShareScreen(false);
                });
        }
        else {
            if ( shareScreenTrack ) {
                this.startDevices(true);
                room.sendTextMessage(JSON.stringify({event: 'onRemoveShareScreen'}));
            }
        }
    }
}

export default Jitsi;