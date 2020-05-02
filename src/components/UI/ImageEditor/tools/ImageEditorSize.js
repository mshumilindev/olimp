import React from 'react';
import classNames from 'classnames';

export default function ImageEditorSize({size, setSettingsItem}) {
    return (
        <div className="imageEditor__size">
            <div className="imageEditor__size-box">
                <div className="imageEditor__size-track"/>
                { _renderMarks() }
                <div className="imageEditor__size-handle" style={{bottom: size - 50 + '%'}}/>
            </div>
        </div>
    );

    function _renderMarks() {
        let i = 50;
        let marks = [];

        while (i <= 150) {
            marks.push(i);
            i += 10;
        }

        return (
            <div className="imageEditor__size-marks">
                {
                    marks.map(item => _renderMark(item))
                }
            </div>
        )
    }

    function _renderMark(item) {
        return (
            <div className={classNames('imageEditor__size-mark', {isActive: item === size})} key={item} style={{bottom: item - 50 + '%'}}>
                <div className="imageEditor__size-tick"/>
                <div className="imageEditor__size-tick-label">{ item }%</div>
            </div>
        )
    }
}