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
                containers.remote.querySelector(`.localVideo`).remove();
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
                        $(containers.remote).append(`<div class="video localVideo"><video autoplay='1' muted playsinline id='localVideo' /></div>`);
                        self.localTracks[i].attach(containers.remote.querySelector(`#localVideo`));
                    }
                }
                else {
                    if ( self.localTracks.find(item => item.type === 'video') ) {
                        self.localTracks.find(item => item.type === 'video').addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () => {});
                        self.localTracks.find(item => item.type === 'video').addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => {});
                        if ( self.localTracks.find(item => item.type === 'video').getType() === 'video' ) {
                            if ( !containers.remote.querySelector(`.localVideo`) ) {
                                $(containers.remote).append(`<div class="video localVideo"><video autoplay='1' muted playsinline id='localVideo' /></div>`);
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
                        if ( shareScreenTrack ) {
                            shareScreenTrack.dispose();
                        }
                        self.room.addTrack(self.localTracks[i]);
                    }
                }
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
            if ( self.remoteTracks[participant].indexOf(track) === -1 ) {
                self.remoteTracks[participant].push(track);
            }
            track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, track => {
                const videoEl = document.querySelector('.' + track.containers[0].id.replace('audio', 'video'));
                const shareScreenEl = document.querySelector('.' + track.containers[0].id.replace('audio', 'shareScreen'));
                const isMuted = track.muted;

                if ( videoEl ) {
                    if ( isMuted ) {
                        if ( !videoEl.querySelector('.isMuted') ) {
                            const icon = document.createElement('i');
                            icon.classList = 'fas fa-microphone-slash isMuted';

                            videoEl.appendChild(icon);
                        }
                    }
                    else {
                        if ( videoEl.querySelector('.isMuted') ) {
                            videoEl.querySelector('.isMuted').remove();
                        }
                    }
                }
                else if ( shareScreenEl ) {
                    if ( isMuted ) {
                        if ( !videoEl.querySelector('.isMuted') ) {
                            const icon = document.createElement('i');
                            icon.classList = 'fas fa-microphone-slash isMuted';

                            videoEl.appendChild(icon);
                        }
                    }
                    else {
                        if ( videoEl.querySelector('.isMuted') ) {
                            videoEl.querySelector('.isMuted').remove();
                        }
                    }
                }
            });
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
                    if ( containers.remote.querySelector('.video' + participant) ) {
                        containers.remote.querySelector('.video' + participant).remove();
                    }
                    $(containers.shareScreen).append(`<div class='video shareScreen${participant}'><video autoplay='1' muted playsinline id='shareScreen${participant}' /></div>`);
                    if ( self.remoteTracks[track.ownerEndpointId] && self.remoteTracks[track.ownerEndpointId].find(item => item.type === 'audio') ) {
                        const videoEl = containers.remote.querySelector('.shareScreen' + track.ownerEndpointId);
                        const isMuted = self.remoteTracks[track.ownerEndpointId].find(item => item.type === 'audio').muted;

                        if ( videoEl ) {
                            if ( isMuted ) {
                                if ( !videoEl.querySelector('.isMuted') ) {
                                    const icon = document.createElement('i');
                                    icon.classList = 'fas fa-microphone-slash isMuted';

                                    videoEl.appendChild(icon);
                                }
                            }
                            else {
                                if ( videoEl.querySelector('.isMuted') ) {
                                    videoEl.querySelector('.isMuted').remove();
                                }
                            }
                        }
                    }
                }
                else {
                    if ( track.getType() === 'video' ) {
                        if ( !document.querySelector('.video' + participant) ) {
                            $(containers.remote).append(`<div class='video video${participant}'><video autoplay='1' muted playsinline id='video${participant}' /></div>`);
                            if ( self.remoteTracks[track.ownerEndpointId] && self.remoteTracks[track.ownerEndpointId].find(item => item.type === 'audio') ) {
                                const videoEl = containers.remote.querySelector('.video' + track.ownerEndpointId);
                                const isMuted = self.remoteTracks[track.ownerEndpointId].find(item => item.type === 'audio').muted;

                                if ( videoEl ) {
                                    if ( isMuted ) {
                                        if ( !videoEl.querySelector('.isMuted') ) {
                                            const icon = document.createElement('i');
                                            icon.classList = 'fas fa-microphone-slash isMuted';

                                            videoEl.appendChild(icon);
                                        }
                                    }
                                    else {
                                        if ( videoEl.querySelector('.isMuted') ) {
                                            videoEl.querySelector('.isMuted').remove();
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if ( !document.getElementById('audio' + participant) ) {
                            $(containers.remote).append(`<audio autoplay='1' id='audio${participant}' />`);

                            if ( track.containers.length ) {
                                const videoEl = document.querySelector('.' + track.containers[0].id.replace('audio', 'video'));
                                const isMuted = track.muted;

                                if ( videoEl ) {
                                    if ( isMuted ) {
                                        if ( !videoEl.querySelector('.isMuted') ) {
                                            const icon = document.createElement('i');
                                            icon.classList = 'fas fa-microphone-slash isMuted';

                                            videoEl.appendChild(icon);
                                        }
                                    }
                                    else {
                                        if ( videoEl.querySelector('.isMuted') ) {
                                            videoEl.querySelector('.isMuted').remove();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                track.attach(document.getElementById(id));
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
            delete self.remoteTracks[id];

            if ( document.querySelector('[data-user-id="' + id + '"]') ) {
                onDisplayNameChange(id, null);
            }
            if ( document.querySelector('.video' + id) ) {
                document.querySelector('.video' + id).remove();
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
            self.room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {});
            self.room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
            self.room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {});
            self.room.on(JitsiMeetJS.events.conference.MESSAGE_RECEIVED, (id, text) => {
                const newText = JSON.parse(text);

                if ( newText.event ) {
                    $(containers.shareScreen).empty();
                }
                else {
                    const $usersContainer = document.querySelector('.chatroom__users');

                    if ( $usersContainer ) {
                        const $userConnected = $usersContainer.querySelector('[data-user-name="' + newText.name + '"]');

                        if ( $userConnected ) {
                            $userConnected.classList.add('isPresent');
                        }
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

        self.startDevices();
    }

    startDevices(onlyVideo) {
        const selectedCameraID = localStorage.getItem('videoDevice') ? JSON.parse(localStorage.getItem('videoDevice')).id : null;

        navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

        let i = 0;
        navigator.getMedia({audio: {volume: 1}}, () => {
            navigator.getMedia({video: true}, () => {
                JitsiMeetJS.createLocalTracks({devices: ['audio', 'video'], cameraDeviceId: selectedCameraID, resolution: 480})
                    .then(tracks => onLocalTracks(tracks, onlyVideo))
                    .catch(error => {
                        JitsiMeetJS.enumerateDevices(devices => {
                            goThroughVideoDevices(devices, devices.length);
                        });
                    });
            }, () => {
                JitsiMeetJS.createLocalTracks({devices: ['audio']})
                    .then(tracks => onLocalTracks(tracks, onlyVideo))
                    .catch(error => {
                        throw error;
                    });
            });
        }, () => {
            navigator.getMedia({video: true}, () => {
                JitsiMeetJS.createLocalTracks({devices: ['video'], cameraDeviceId: selectedCameraID, resolution: 480})
                    .then(tracks => onLocalTracks(tracks, onlyVideo))
                    .catch(error => {
                        JitsiMeetJS.enumerateDevices(devices => {
                            goThroughVideoDevices(devices, devices.length);
                        });
                    });
            }, () => {
                // === Throw error, no devices available
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
            JitsiMeetJS.createLocalTracks({devices: ['desktop']})
                .then(onShareScreen)
                .catch(error => {
                    setShareScreen(false);
                });
        }
        else {
            if ( room && shareScreenTrack ) {
                this.startDevices(true);
                room.sendTextMessage(JSON.stringify({event: 'onRemoveShareScreen'}));
            }
        }
    }

    changeVideoDevice(value, label) {
        localStorage.setItem('videoDevice', JSON.stringify({id: value, label: label}));
        JitsiMeetJS.createLocalTracks({devices: ['video'], cameraDeviceId: value, resolution: 480})
            .then(tracks => {
                if ( localTracks.find(item => item.type === 'video') ) {
                    localTracks.find(item => item.type === 'video').dispose();
                    room.replaceTrack(localTracks.find(item => item.type === 'video'), tracks[0]);
                    localTracks[localTracks.indexOf(localTracks.find(item => item.type === 'video'))] = tracks[0];
                }
                else {
                    localTracks.push(tracks[0]);
                    room.addTrack(tracks[0]);
                }
            });
    }
}

export default Jitsi;