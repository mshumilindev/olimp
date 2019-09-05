import React, { useContext, useState } from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from "../../Confirm/Confirm";
import classNames from 'classnames';
import ContentEditorGridItem from './ContentEditorGridItem';

export default function ContentEditorGrid({ block, setBlock, removeBlock }) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showRemoveBlock, setShowRemoveBlock ] = useState(false);
    const [ showSettings, setShowSettings ] = useState(false);
    const [ mediaSize, setMediaSize ] = useState(block.value.size || '16x9');
    const [ columnsQty, setColumnsQty ] = useState(block.value.qty || '2');
    const [ grid, setGrid ] = useState(JSON.stringify(block));

    setInitialGrid(JSON.parse(grid));

    return (
        <div className={'contentEditor__block-grid size-' + mediaSize}>
            {
                JSON.parse(grid).value.items ?
                    JSON.parse(grid).value.items.map((item, index) => <ContentEditorGridItem key={index} item={item} index={index}/>)
                    :
                    null
            }
            <div className="contentEditor__block-actions">
                <span className="contentEditor__block-actions-sort">
                    <i className="content_title-icon fa fa-sort"/>
                </span>
                <a href="#" onClick={e => onShowSettings(e)} className={classNames('contentEditor__block-actions-settings', {active: showSettings})}>
                    <i className="content_title-icon fa fa-cog"/>
                </a>
                <a href="#" onClick={e => onRemoveBlock(e)} className="contentEditor__block-actions-remove">
                    <i className="content_title-icon fa fa-trash-alt"/>
                </a>
            </div>
            {
                showSettings ?
                    <div className="contentEditor__block-settings-holder">
                        <div className="contentEditor__block-settings">
                            <h2 className="contentEditor__block-settings-title">{ translate('columns') }</h2>
                            <a href="#" className={classNames('contentEditor__block-settings-btn', {active: columnsQty === '2'})} onClick={(e) => onSetColumnsQty(e, '2')}>2</a>
                            <a href="#" className={classNames('contentEditor__block-settings-btn', {active: columnsQty === '3'})} onClick={(e) => onSetColumnsQty(e, '3')}>3</a>
                            <a href="#" className={classNames('contentEditor__block-settings-btn', {active: columnsQty === '4'})} onClick={(e) => onSetColumnsQty(e, '4')}>4</a>

                            <h2 className="contentEditor__block-settings-title">{ translate('dimensions') }</h2>
                            <a href="#" className={classNames('contentEditor__block-settings-btn', {active: mediaSize === '16x9'})} onClick={(e) => onSetMediaSize(e, '16x9')}>16 x 9</a>
                            <a href="#" className={classNames('contentEditor__block-settings-btn', {active: mediaSize === '4x3'})} onClick={(e) => onSetMediaSize(e, '4x3')}>4 x 3</a>
                            <a href="#" className={classNames('contentEditor__block-settings-btn', {active: mediaSize === '1x1'})} onClick={(e) => onSetMediaSize(e, '1x1')}>1 x 1</a>
                        </div>
                    </div>
                    :
                    null
            }
            {
                showRemoveBlock ?
                    <Confirm message={translate('sure_to_remove_block')} confirmAction={() => removeBlock(block)} cancelAction={() => setShowRemoveBlock(false)} />
                    :
                    null
            }
        </div>
    );

    function setInitialGrid(grid) {
        if ( !grid.value ) {
            grid.value = {
                size: mediaSize,
                qty: columnsQty,
                items: []
            };
            for ( let i = 0; i < columnsQty; i++ ) {
                grid.value.items.push({
                    image: '',
                    text: {
                        ua: '',
                        ru: '',
                        en: ''
                    }
                });
            }
            setGrid(JSON.stringify(grid));
        }
    }

    function onSetMediaSize(e, size) {
        e.preventDefault();

        setMediaSize(size);
        handleChange(block.id + '_image', null, size);
    }

    function onSetColumnsQty(e, qty) {
        e.preventDefault();
        const newGrid = JSON.parse(grid);

        newGrid.value.qty = qty;
        newGrid.value.items = [];
        for ( let i = 0; i < qty; i++ ) {
            newGrid.value.items.push({
                image: '',
                text: {
                    ua: '',
                    ru: '',
                    en: ''
                }
            });
        }
        setGrid(JSON.stringify(newGrid));
        setColumnsQty(qty);
    }

    function onRemoveBlock(e) {
        e.preventDefault();

        setShowRemoveBlock(true);
    }

    function onShowSettings(e) {
        e.preventDefault();

        setShowSettings(!showSettings);
    }

    function handleChange(id, value, size) {
        let newValue = {
            value: block.value
        };

        if ( id.includes('image') ) {
            newValue.value.image = value || block.value.image;
            newValue.value.size = size || mediaSize;
        }
        else {
            newValue.value.caption[lang] = value;
        }

        setBlock({
            ...block,
            ...newValue
        })
    }
}