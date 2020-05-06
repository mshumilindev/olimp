import React, {useContext, useEffect, useRef, useState} from 'react';
import Form from "../../Form/Form";
import './imageEditor.scss';
import classNames from 'classnames';
import ImageEditorSize from "./tools/ImageEditorSize";
import ImageEditorDimensions from "./tools/ImageEditorDimensions";
import ImageEditorBG from "./tools/ImageEditorBG";
import ImageEditorOverlay from "./tools/ImageEditorOverlay";
import ImageEditorBGSize from "./tools/ImageEditorBGSize";
import ImageEditorBorder from "./tools/ImageEditorBorder";
import ImageEditorText from "./tools/ImageEditorText";
import ImageEditorTransform from "./tools/ImageEditorTransform";
import siteSettingsContext from "../../../context/siteSettingsContext";

export default function ImageEditor({id, image, settings, handleChange, setSettings}) {
    const { translate } = useContext(siteSettingsContext);
    const [ isUsed, setIsUsed ] = useState(true);
    const [ originalSize, setOriginalSize ] = useState(null);
    const $image = useRef(null);
    const formFields = [
        {
            type: 'image',
            id: id + '_image',
            value: image,
            size: '100%',
            icon: 'fa fa-image',
            customSize: true,
            noImage: true,
            label: translate('upload')
        },
    ];

    useEffect(() => {
        if ( $image && !Object.keys(settings).length && !originalSize ) {
            setOriginalSize({width: $image.current.offsetWidth, height: $image.current.offsetHeight});
        }
    }, [settings]);

    return (
        <div className={classNames('imageEditor', { isUsed: isUsed })}>
            <div className="imageEditor__shade"/>
            <div className="imageEditor__holder">
                <div className="imageEditor__box">
                    <div className="imageEditor__inner">
                        {
                            image && isUsed ?
                                <>
                                    <div className="imageEditor__toolbar">
                                        <div className="imageEditor__toolbar-col">
                                            <div className="imageEditor__icon">
                                                <i className="fas fa-image" />
                                            </div>
                                            <div className={classNames('imageEditor__toolbar-btn', {active: !Object.keys(settings).length})} onClick={resetSettings}>
                                                <i className="imageEditor__toolbar-btn-icon fas fa-history"/>
                                                <div className="imageEditor__toolbar-btn-label">{ translate('original_settings') }</div>
                                            </div>
                                            <ImageEditorDimensions originalDimensions={originalSize} dimensions={isOriginal() ? originalSize : settings.dimensions ? settings.dimensions : 'original'} setSettingsItem={setSettingsItem}/>
                                            <ImageEditorTransform transform={settings.transform ? settings.transform : {rotate: {x: 0, y: 0, z: 0}, skew: {x: 0, y: 0}}} setSettingsItem={setSettingsItem} />
                                            <ImageEditorBGSize size={settings.size} setSettingsItem={setSettingsItem}/>
                                        </div>
                                        <div className="imageEditor__toolbar-col">
                                            <div className="imageEditor__toolbar-btn">
                                                <i className="imageEditor__toolbar-btn-icon fas fa-times"/>
                                                <div className="imageEditor__toolbar-btn-label">{ translate('close') }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="imageEditor__actions">
                                        <ImageEditorBG bg={settings.bg ? settings.bg : '#fff'} setSettingsItem={setSettingsItem}/>
                                        <ImageEditorOverlay overlay={settings.overlay ? settings.overlay : {color: '#fff', opacity: 0, mode: 'normal'}} setSettingsItem={setSettingsItem}/>
                                        <ImageEditorBorder border={settings.border ? settings.border : {color: '#fff', width: 0, style: 'solid'}} setSettingsItem={setSettingsItem} />
                                    </div>
                                    <ImageEditorSize size={settings.size ? settings.size : 100} setSettingsItem={setSettingsItem}/>
                                    <ImageEditorText text={settings.text} setSettingsItem={setSettingsItem} />
                                </>
                                :
                                null
                        }
                        {
                            image ?
                                <div className="imageEditor__image-wrapper">
                                    {
                                        isOriginal() ?
                                            <div className="imageEditor__image-holder">
                                                <img src={image} className="imageEditor__image" ref={$image}/>
                                            </div>
                                            :
                                            <div className="imageEditor__image-holder">
                                                <div className="imageEditor__image-bg" style={
                                                    {
                                                        width: settings.dimensions ? 800 : originalSize.width,
                                                        height: settings.dimensions ? settings.dimensions.height * 800 / settings.dimensions.width : originalSize.height,
                                                        backgroundImage: 'url(' + image + ')',
                                                        backgroundSize: typeof settings.size === 'number' ? settings.size + '%' : settings.size,
                                                        backgroundColor: settings.bg ? settings.bg : 'none',
                                                        border: settings.border ? settings.border.width + 'px ' + settings.border.style + ' ' + settings.border.color : 'none'
                                                    }
                                                }/>
                                                {
                                                    settings.overlay ?
                                                        <div className="imageEditor__image-overlay" style={
                                                            {
                                                                backgroundColor: settings.overlay.color,
                                                                opacity: settings.overlay.opacity / 100,
                                                                mixBlendMode: settings.overlay.mode
                                                            }
                                                        }/>
                                                        :
                                                        null
                                                }
                                            </div>
                                    }
                                </div>
                                :
                                null
                        }
                        {
                            !isUsed ?
                                <Form fields={formFields} setFieldValue={(fieldID, value) => handleChange(fieldID, value)}/>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
        </div>
    );

    function isOriginal() {
        return !Object.keys(settings).length;
    }

    function setSettingsItem(type, value) {
        setSettings({
            ...settings,
            [type]: value
        })
    }

    function resetSettings() {
        setSettings({});
    }
}