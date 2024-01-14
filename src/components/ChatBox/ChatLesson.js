import React, { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars";

import Article from "../Article/Article";

const ChatLesson = ({ isOrganizer, handleBlockClick, chatLesson, chat }) => {
  return (
    <div className="chatroom__lesson">
      <div className="chatroom__lesson-inner">
        {isOrganizer ? (
          <div className="chatroom__lesson-blocks">
            <Scrollbars
              autoHeight
              hideTracksWhenNotNeeded
              autoHeightMax={"100%"}
              renderTrackVertical={(props) => (
                <div {...props} className="scrollbar__track" />
              )}
              renderView={(props) => (
                <div {...props} className="scrollbar__content" />
              )}
            >
              <Article
                content={chatLesson.content}
                onBlockClick={handleBlockClick}
              />
            </Scrollbars>
          </div>
        ) : null}
        <div className="chatroom__lesson-content">
          <Scrollbars
            autoHeight
            hideTracksWhenNotNeeded
            autoHeightMax={"100%"}
            renderTrackVertical={(props) => (
              <div {...props} className="scrollbar__track" />
            )}
            renderView={(props) => (
              <div {...props} className="scrollbar__content" />
            )}
          >
            <Article
              content={[chatLesson.content[chat.lessonOpen - 1]]}
              onBlockClick={handleBlockClick}
            />
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatLesson);
