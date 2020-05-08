import React, {useContext, useEffect, useRef, useState} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import classNames from "classnames";
import Range from "../../Range/Range";

export default function ImageEditorFilters({image, filters, setSettingsItem}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showColorPicker, setShowColorPicker ] = useState(false);
    const $filters = useRef(null);

    const filtersList = [
        {
            id: 'blur',
            label: 'blur',
            units: 'px',
            increment: 10
        },
        {
            id: 'brightness',
            label: 'brightness',
            units: '',
            min: 50,
            max: 150,
            increment: 100
        },
        {
            id: 'contrast',
            label: 'contrast',
            units: '',
            min: 50,
            max: 150,
            increment: 100
        },
        {
            id: 'grayscale',
            label: 'grayscale',
            units: '',
            increment: 100
        },
        {
            id: 'hue-rotate',
            label: 'hue_rotate',
            units: 'deg',
            max: 360,
            step: 15,
            hideSteps: true
        },
        {
            id: 'invert',
            label: 'invert',
            units: '',
            increment: 100
        },
        {
            id: 'opacity',
            label: 'opacity',
            units: '',
            increment: 100
        },
        {
            id: 'saturate',
            label: 'saturate',
            units: '',
            min: 50,
            max: 150,
            increment: 100
        },
        {
            id: 'sepia',
            label: 'sepia',
            units: '',
            increment: 100
        }
    ];
    const instaFilters = ['normal', 'clarendon', 'gingham', 'moon', 'lark', 'reyes', 'juno', 'slumber', 'crema', 'ludwig', 'aden', 'perpetua', 'amaro', 'mayfair', 'rise', 'hudson', 'valencia', 'xpro-ii', 'sierra', 'willow', 'inkwell', 'hefe', 'nashville'];

    useEffect(() => {
        document.addEventListener('click', closeDrop);

        return () => {
            document.removeEventListener('click', closeDrop);
        }
    }, []);

    return (
        <div className="imageEditor__filters" ref={$filters}>
            <div className={classNames('imageEditor__toolbar-btn', {open: showColorPicker})} onClick={() => setShowColorPicker(!showColorPicker)}>
                <i className="imageEditor__toolbar-btn-icon fas fa-filter"/>
                <div className="imageEditor__toolbar-btn-label">
                    { translate('filters') }
                </div>
            </div>
            {
                showColorPicker ?
                    <div className="imageEditor__filters-drop">
                        <div className="imageEditor__filters-insta">
                            { instaFilters.map(item => _renderInstaFilter(item)) }
                        </div>
                        {

                        }
                        <div className="imageEditor__filters-block">
                            {
                                filtersList.map(item => _renderFilter(item))
                            }
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    );

    function _renderInstaFilter(item) {
        return (
            <div className={classNames('imageEditor__filters-insta-item', {active: item === filters.item})} key={item} onClick={() => setSettingsItem('filters', {...filters, item})}>
                <div className={'imageEditor__filters-insta-img imageFilter-' + item} style={{backgroundImage: 'url(' + image + ')'}} />
                <div className="imageEditor__filters-insta-label">
                    {
                        item === 'normal' ?
                            translate('normal')
                            :
                            item
                    }
                </div>
            </div>
        )
    }

    function _renderFilter(item) {
        return (
            <div className="imageEditor__filters-filter" key={item.id}>
                <div className="imageEditor__toolbar-heading">{ translate(item.label) }</div>
                <Range
                    step={item.step ? item.step : 10}
                    min={item.min ? item.min : 0}
                    max={item.max ? item.max : 100}
                    activeValue={item.increment ? parseInt(parseFloat(filters[item.id]) * item.increment) : parseInt(filters[item.id])}
                    type={'filters'}
                    setRange={(type, value) => setSettingsItem(type, {...filters, [item.id]: item.increment ? value / item.increment + item.units : value + item.units})}
                    units={item.units}
                    hideSteps={item.hideSteps}
                />
            </div>
        )
    }

    function closeDrop(e) {
        if ( e.target !== $filters.current && !$filters.current.contains(e.target) ) {
            setShowColorPicker(false);
        }
    }
}