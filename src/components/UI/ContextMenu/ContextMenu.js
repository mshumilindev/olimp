import React, { useState, useRef, useEffect } from 'react';
import './contextmenu.scss';
import classNames from 'classnames';

export default function ContextMenu({children, links}) {
    const [ left, setLeft ] = useState(0);
    const [ showContextMenu, toggleContextMenu ] = useState(false);
    const $trigger = useRef(null);

    useEffect(() => {
        document.addEventListener('click', hideContextMenu);
        document.addEventListener('contextmenu', hideContextMenu);

        return () => {
            document.removeEventListener('click', hideContextMenu);
            document.removeEventListener('contextmenu', hideContextMenu);
        }
    });

    return (
        <span className={classNames('contextmenu', {active: showContextMenu})} onContextMenu={onContextMenu} ref={$trigger}>
            { children }
            {
                showContextMenu ?
                    <div className="contextmenu__drop" style={{left: left}} onContextMenu={e => {e.stopPropagation(); e.preventDefault()}}>
                        {
                            links.map(link => _renderLink(link))
                        }
                    </div>
                    :
                    null
            }
        </span>
    );

    function _renderLink(link) {
        return (
            link.type !== 'divider' ?
                <div className="contextmenu__drop-item" key={link.id}>
                    <a href="/" className={'contextmenu__drop-link' + (link.type ? ' link-' + link.type : '')} onClick={e => handleLink(e, link.action)}>
                        <i className={'content_title-icon ' + link.icon} />
                        { link.name }
                    </a>
                </div>
                :
                <div className="contextmenu__drop-divider" key={link.id}/>
        )
    }

    function handleLink(e, action) {
        e.stopPropagation();
        e.preventDefault();

        toggleContextMenu(false);
        action();
    }

    function onContextMenu(e) {
        e.preventDefault();

        toggleContextMenu(true);
        setLeft(e.clientX - $trigger.current.getBoundingClientRect().left);
    }

    function hideContextMenu(e) {
        if ( e.target !== $trigger.current && e.target.closest('.contextmenu') !== $trigger.current ) {
            toggleContextMenu(false);
        }
    }
}