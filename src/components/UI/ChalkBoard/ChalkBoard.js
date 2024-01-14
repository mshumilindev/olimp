import React, {useContext, useState, memo, useCallback, useMemo, useEffect} from 'react';
import './chalkBoard.scss';
import Preloader from "../../UI/preloader";
import ChalkBoardGraph from "./ChalkBoardGraph";
import { sendChalkBoard, toggleChalkBoard } from "../../../redux/actions/eventsActions";
import { connect } from 'react-redux';
import ChalkBoardActions from './ChalkBoardActions'
import { Editor } from "@tinymce/tinymce-react";
import MathJax from "react-mathjax-preview";

const editorToolbar = ['fullscreen | undo redo | formatselect | forecolor | fontselect | fontsizeselect | numlist bullist | align | bold italic underline strikeThrough subscript superscript | table tabledelete tableprops tablerowprops tablecellprops tableinsertrowbefore tableinsertrowafter tabledeleterow tableinsertcolbefore tableinsertcolafter tabledeletecol | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry'];

const editorConfig = {
    menubar: false,
    language: 'uk',
      plugins: [
        'autoresize fullscreen',
        'advlist lists image charmap anchor',
        'visualblocks',
        'paste',
        'table'
    ],
    external_plugins: {
        'tiny_mce_wiris' : 'https://cdn.jsdelivr.net/npm/@wiris/mathtype-tinymce4@7.17.0/plugin.min.js'
    },
    paste_word_valid_elements: "b,strong,i,em,h1,h2,u,p,ol,ul,li,a[href],span,color,font-size,font-color,font-family,mark,table,tr,td",
    paste_retain_style_properties: "all",
    fontsize_formats: "8 9 10 11 12 14 16 18 20 22 24 26 28 36 48 72",
    toolbar: editorToolbar,
};
function ChalkBoard({currentChatOrganizer, chat, sendChalkBoard, toggleChalkBoard}) {
  const [board, saveBoard] = useState(chat?.chalkBoard || "{}");

  useEffect(() => {
    saveBoard(chat?.chalkBoard || "{}");
  }, [chat.chalkBoard]);

  const chalkBoardJSON = useMemo(() => JSON.parse(board), [board]);

  const drawing = useMemo(() => {
    const parsedBoard = JSON.parse(chat?.chalkBoard || "{}");
    return parsedBoard?.lines ? JSON.stringify({
      lines: parsedBoard?.lines || [],
      width: parsedBoard?.width || 0,
      height: parsedBoard?.height || 0
    }) : null
  }, [chat]);
  const text = chalkBoardJSON?.text || '';
  const activeBoard = chalkBoardJSON?.activeBoard || 'drawing'

  const handleSaveBoard = useCallback((value) => {
    const newValue = JSON.parse(value);

    saveBoard((prevBoard) => {
      return JSON.stringify({
        ...JSON.parse(prevBoard),
        ...newValue
      });
    });
  }, [chalkBoardJSON]);

  const eraseBoard = useCallback(() => {
    sendChalkBoard(chat.id, null);
  }, [chat, sendChalkBoard]);

  const shareBoard = useCallback(() => {
    sendChalkBoard(chat.id, JSON.stringify(chalkBoardJSON));
  }, [chat, chalkBoardJSON]);

  const switchBoard = useCallback((type) => () => {
    const newBoard = {...chalkBoardJSON};

    newBoard.activeBoard = type;

    saveBoard(JSON.stringify(newBoard));
  }, [chat, chalkBoardJSON])

  const textEditorChange = useCallback((value) => {
    const newBoard = {...chalkBoardJSON};

    newBoard.text = value;

    saveBoard(JSON.stringify(newBoard));
  }, [chalkBoardJSON])

  return (
    <div className="chalkBoard">
      {
        currentChatOrganizer ?
          <Preloader/>
          :
          <Preloader color={'#7f00a3'} />
      }
      {
        activeBoard === 'text' && currentChatOrganizer && (
          <Editor
            value={text}
            onEditorChange={textEditorChange}
            init={editorConfig}
            apiKey="5wvj56289tu06v7tziccawdyxaqxkmsxzzlrh6z0aia0pm8y"
          />
        )
      }
      {
        activeBoard === 'text' && !currentChatOrganizer && (
          <MathJax math={text}/>
        )
      }
      {
        activeBoard === 'drawing' && <ChalkBoardGraph saveBoard={handleSaveBoard} chat={chat} chalkBoardData={drawing} />
      }
      <div className="chalkBoard__notVisible">
        <i className="fas fa-eye-slash" />
      </div>
      {
        currentChatOrganizer ?
          <ChalkBoardActions
            hasText={chalkBoardJSON?.text}
            hasDrawing={chalkBoardJSON?.lines}
            hasImg={chalkBoardJSON?.img}
            activeBoard={activeBoard}
            eraseBoard={eraseBoard}
            shareBoard={shareBoard}
            toggleChalkBoard={toggleChalkBoard}
            chat={chat}
            switchBoard={switchBoard}
          />
          :
          null
      }
    </div>
  );
}

const mapDispatchToProps = dispatch => {
    return {
        sendChalkBoard: (chatID, value) => dispatch(sendChalkBoard(chatID, value)),
        toggleChalkBoard: (chatID, value) => dispatch(toggleChalkBoard(chatID, value))
    }
};

export default memo(connect(null, mapDispatchToProps)(ChalkBoard));
