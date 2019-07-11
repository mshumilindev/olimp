import React from 'react';
import './textTooltip.scss';

export default function TextTooltip({children, text, position}) {
    return (
        <span className="textTooltip">
            <span className="textTooltip__trigger">
                { children }
            </span>
            <span className={position ? position + ' textTooltip__text' : 'textTooltip__text'}>
                { text }
            </span>
        </span>
    )
}