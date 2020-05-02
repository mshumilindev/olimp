import React, {useContext, useState} from 'react';
import Form from "../../Form/Form";
import './imageEditor.scss';
import classNames from 'classnames';
import ImageEditorSize from "./tools/ImageEditorSize";
import ImageEditorDimensions from "./tools/ImageEditorDimensions";
import ImageEditorBG from "./tools/ImageEditorBG";
import ImageEditorOverlay from "./tools/ImageEditorOverlay";
import siteSettingsContext from "../../../context/siteSettingsContext";

export default function ImageEditor({id, image, settings, handleChange, setSettings}) {
    const [ isUsed, setIsUsed ] = useState(true);
    const { translate } = useContext(siteSettingsContext);
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
                                            {
                                                isUsed ?
                                                    <Form fields={formFields} setFieldValue={(fieldID, value) => handleChange(fieldID, value)}/>
                                                    :
                                                    null
                                            }
                                            <div className="imageEditor__toolbar-btn">
                                                <i className="imageEditor__toolbar-btn-icon fas fa-history"/>
                                                <div className="imageEditor__toolbar-btn-label">{ translate('original_settings') }</div>
                                            </div>
                                            <div className="imageEditor__toolbar-btn">
                                                <i className="imageEditor__toolbar-btn-icon customIcon coverIcon"/>
                                                <div className="imageEditor__toolbar-btn-label">
                                                    { translate('cover') }
                                                </div>
                                            </div>
                                            <div className="imageEditor__toolbar-btn">
                                                <i className="imageEditor__toolbar-btn-icon customIcon containIcon"/>
                                                <div className="imageEditor__toolbar-btn-label">
                                                    { translate('contain') }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="imageEditor__toolbar-col">
                                            <div className="imageEditor__toolbar-btn">
                                                <i className="imageEditor__toolbar-btn-icon fas fa-times"/>
                                                <div className="imageEditor__toolbar-btn-label">{ translate('close') }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="imageEditor__actions">
                                        <ImageEditorDimensions dimensions={isOriginal() ? 'original' : settings.dimensions ? settings.dimensions : 'original'} setSettingsItem={setSettingsItem}/>
                                        <ImageEditorBG bg={settings.bg ? settings.bg : '#fff'} setSettingsItem={setSettingsItem}/>
                                        <ImageEditorOverlay overlay={settings.overlay ? settings.overlay : {color: 'none', opacity: 0}} setSettingsItem={setSettingsItem}/>
                                    </div>
                                    <ImageEditorSize size={settings.size ? settings.size : 100} setSettingsItem={setSettingsItem}/>
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
                                                <img src={image} className="imageEditor__image"/>
                                                <div className="imageEditor__image-vr"/>
                                                <div className="imageEditor__image-hr"/>
                                                <div className="imageEditor__image-ar"/>
                                            </div>
                                            :
                                            <div className="imageEditor__image-holder">
                                                <div className="imageEditor__image" style={{backgroundImage: 'url(' + image + ')'}}/>
                                                <div className="imageEditor__image-vr"/>
                                                <div className="imageEditor__image-hr"/>
                                                <div className="imageEditor__image-ar"/>
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

    function setSettingsItem() {

    }
}