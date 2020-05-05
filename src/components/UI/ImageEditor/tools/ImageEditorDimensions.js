import React, {useContext} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function ImageEditorDimensions({dimensions, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);
    const availableDimensions = [
        {
            width: 16,
            height: 9
        },
        {
            width: 6,
            height: 4
        },
        {
            width: 4,
            height: 3
        },
        {
            width: 1,
            height: 1
        },
        {
            width: 3,
            height: 4
        },
        {
            width: 4,
            height: 6
        },
        {
            width: 9,
            height: 16
        },
        {
            width: 210,
            height: 297
        }
    ];

    return (
        <div className="imageEditor__dimensions">
            <div className="imageEditor__toolbar-btn">
                <i className="imageEditor__toolbar-btn-icon fas fa-vector-square"/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('dimensions') }
                </div>
            </div>
            {/*{ availableDimensions.map(item => _renderDimension(item)) }*/}
        </div>
    );

    function _renderDimension(item) {
        return (
            <div className="imageEditor__toolbar-btn">
                <i className="imageEditor__toolbar-btn-icon customIcon dimensionsIcon" style={{width: 20, height: item.height * 20 / item.width}}/>
                <div className="imageEditor__toolbar-btn-label">
                    { item.width + ' x ' + item.height }
                </div>
            </div>
        )
    }
}