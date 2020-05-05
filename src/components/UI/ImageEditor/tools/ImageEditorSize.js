import React from 'react';
import Range from "../../Range/Range";

export default function ImageEditorSize({size, setSettingsItem}) {
    return (
        <div className="imageEditor__size">
            <Range
                markClassName="imageEditor__size-mark"
                tickClassName="imageEditor__size-tick"
                className="imageEditor__size-track"
                thumbClassName="imageEditor__size-handle"
                vertical
                invert
                step={10}
                min={50}
                max={150}
                activeValue={size}
                type={'size'}
                setRange={(type, value) => setSettingsItem(type, value)}
            />
        </div>
    );
}