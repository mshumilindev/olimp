import React, { useEffect } from 'react';
import './modal.scss';

export default function Modal({children, onHideModal, heading}) {
    useEffect(() => {
        document.querySelector('body').classList.add('overflow');
        return () => {
            document.querySelector('body').classList.remove('overflow');
        }
    });

    return (
        <div className="modal">
            <div className="modal__overlay"/>
            <div className="modal__inner">
                <div className="modal__box">
                    <i className={'modal__close fa fa-times'} onClick={onHideModal} />
                    {
                        heading ?
                            <h2 className="modal__heading">{ heading }</h2>
                            :
                            null
                    }
                    { children }
                </div>
            </div>
        </div>
    )
}