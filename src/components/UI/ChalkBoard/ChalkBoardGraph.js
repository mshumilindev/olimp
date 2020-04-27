import React, {useRef, useState, useEffect} from 'react';
import CanvasDraw from 'react-canvas-draw';
import { connect } from 'react-redux';

function ChalkBoardGraph({user, chat, saveBoard}) {
    const $canvas = useRef(null);
    const [ canvasConfig, setCanvasConfig ] = useState({
        immediateLoading: true,
        onChange: handleChalkBoard,
        brushRadius: 3,
        gridColor: "#333",
        backgroundColor: '#333',
        catenaryColor: "#333",
        brushColor: "#fff",
        canvasWidth: '100%',
        canvasHeight: '100%',
        disabled: user.id !== chat.organizer
    });

    useEffect(() => {
        setCanvasConfig({
            ...canvasConfig,
            saveData: chat.chalkBoard ? chat.chalkBoard : ''
        });
    }, []);

    useEffect(() => {
        let saveData = null;

        if ( typeof chat.chalkBoard === 'string' ) {
            saveData = chat.chalkBoard;
            setCanvasConfig({
                ...canvasConfig,
                saveData: saveData
            });
        }
        else {
            $canvas.current.clear();
        }
    }, [chat]);

    return (
        <div className="chalkBoard__graphContainer">
            <CanvasDraw {...canvasConfig} ref={$canvas} />
        </div>
    );

    function handleChalkBoard(value) {
        saveBoard(value.getSaveData());
    }
}

const mapStateToProps = state => {
    return {
        user: state.authReducer.currentUser
    }
};

export default connect(mapStateToProps)(ChalkBoardGraph);