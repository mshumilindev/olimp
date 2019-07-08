import React, { useEffect } from 'react';
import './modal.scss';

export default function Modal({children, onHideModal}) {
    useEffect(() => {
        document.querySelector('body').classList.add('overflow');
        return () => {
            document.querySelector('body').classList.remove('overflow');
        }
    });

    return (
        <div className="modal">
            <div className="modal__overlay"/>
            {/* remove onclick from inner, set to close btn or check if keydown was originated on modal box and its children */}
            <div className="modal__inner" onClick={onHideModal}>
                <div className="modal__box" onClick={e => e.stopPropagation()}>
                    { children }
                </div>
            </div>
        </div>
    )
}