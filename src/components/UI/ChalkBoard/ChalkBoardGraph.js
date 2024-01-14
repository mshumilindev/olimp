import React, {useRef, useState, useEffect, memo, useMemo} from 'react';
import CanvasDraw from 'react-canvas-draw';
import { connect } from 'react-redux';
import { useResizeDetector } from 'react-resize-detector';

function ChalkBoardGraph({user, chat, chalkBoardData, saveBoard}) {
  const { width, height, ref } = useResizeDetector();
  const $canvas = useRef(null);
  const [ canvasConfig, setCanvasConfig ] = useState({
    immediateLoading: true,
    onChange: handleChalkBoard,
    brushRadius: 3,
    gridColor: "#333",
    backgroundColor: '#333',
    catenaryColor: "#333",
    brushColor: "#fff",
    disabled: user?.id !== chat?.organizer,
    saveData: chalkBoardData
  });

  useEffect(() => {
    setCanvasConfig((prevConfig) => ({
      ...prevConfig,
      canvasWidth: width,
      canvasHeight: height
    }));
  }, [width, height]);


    useEffect(() => {
      if ( chalkBoardData ) {
        setCanvasConfig((prevConfig) => ({
          ...prevConfig,
          saveData: chalkBoardData
        }));
      }
    }, [chalkBoardData]);

    useEffect(() => {
      let saveData = null;

      if ( typeof chalkBoardData === 'string' ) {
        saveData = chalkBoardData;
        setCanvasConfig((prevConfig) => ({
          ...prevConfig,
          saveData: saveData
        }));
      }
      else {
        if ( $canvas?.current ) {
          $canvas.current.clear();
        }
      }
    }, [chalkBoardData, $canvas]);

    return (
      <div className="chalkBoard__graphContainer" ref={ref}>
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

export default connect(mapStateToProps)(memo(ChalkBoardGraph));
