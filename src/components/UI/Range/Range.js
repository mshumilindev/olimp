import React from 'react';
import ReactSlider from "react-slider";
import classNames from "classnames";

export default function Range({markClassName, tickClassName, className, thumbClassName, vertical, invert, min, max, step, activeValue, type, setRange}) {
    return (
        <div className="range">
            <ReactSlider
                className={className ? className : 'range__track'}
                thumbClassName={thumbClassName ? thumbClassName : 'range__handle'}
                value={typeof activeValue === 'number' ? activeValue : 100}
                min={min}
                max={max}
                step={step}
                orientation={vertical ? 'vertical' : 'horizontal'}
                invert={invert}
                withTracks={false}
                renderThumb={props => <><div {...props}/>{ _renderMarks() }</>}
                onChange={(value) => setRange(type, value)}
            />
        </div>
    );

    function _renderMarks() {
        let i = min;
        let marks = [];

        while (i <= max) {
            marks.push(i);
            i += step;
        }

        if ( invert ) {
            marks.reverse();
        }

        return (
            <div className={markClassName ? markClassName + 's' : 'range__marks'}>
                {
                    marks.map(item => _renderMark(item))
                }
            </div>
        )
    }

    function _renderMark(item) {
        return (
            <div
                key={item}
                className={classNames(markClassName ? markClassName : 'range__mark', {
                    isActive: item === activeValue ||
                        (type === 'size' && item === 100 && typeof activeValue !== 'number')
                })}
                style={
                    vertical ?
                        invert ?
                            {
                                bottom: item - min + '%'
                            }
                            :
                            {
                                top: item - min + '%'
                            }
                        :
                        {
                            left: item - min + '%'
                        }
                }
            >
                <div className={tickClassName ? tickClassName : 'range__tick'}/>
                <div className={tickClassName ? tickClassName + '-label' : 'range__tick-label'}>{ item }%</div>
            </div>
        )
    }
}