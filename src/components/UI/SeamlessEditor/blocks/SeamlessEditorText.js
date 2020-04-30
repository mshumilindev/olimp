import React, {useContext} from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";
import MathJax from "react-mathjax-preview";

export default function SeamlessEditorText({ block, openTextEditor }) {
    const { lang } = useContext(siteSettingsContext);
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="seamlessEditor__editor-block">
            <div className="seamlessEditor__editor-block-inner seamlessEditor__editor-block-text" onClick={() => openTextEditor(block)}>
                <MathJax math={block.value[lang] ? block.value[lang] : translate('enter_text') }/>
            </div>
        </div>
    );
}