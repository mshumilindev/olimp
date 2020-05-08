import React from 'react';
import ReactSlider from "react-slider";
import classNames from "classnames";
import './range.scss';

export default function Range({units, markClassName, tickClassName, className, thumbClassName, vertical, invert, min, max, step, activeValue, type, setRange, hideSteps}) {
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
        let newStep = (max - min) / step > 20 ? (max - min) / 10 : step;

        while (i <= max) {
            marks.push(i);
            i += newStep;
        }

        if ( invert ) {
            marks.reverse();
        }

        return (
            <div className={markClassName ? markClassName + 's' : 'range__marks'}>
                {
                    marks.map((item, index) => _renderMark(item, index, marks.length - 1))
                }
            </div>
        )
    }

    function _renderMark(item, index, lastIndex) {
        if ( hideSteps ) {
            if ( index > 0 && index < lastIndex ) {
                return null;
            }
        }

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
                                bottom: (lastIndex - index) * 10 + '%'
                            }
                            :
                            {
                                top: index * 10 + '%'
                            }
                        :
                        {
                            left: index * 10 + '%'
                        }
                }
            >
                <div className={tickClassName ? tickClassName : 'range__tick'}/>
                <div className={tickClassName ? tickClassName + '-label' : 'range__tick-label'}>{ item }{ units ? units === 'deg' ? '°' : units : '%' }</div>
            </div>
        )
    }
}