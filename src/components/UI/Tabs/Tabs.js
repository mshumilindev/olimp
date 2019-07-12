import React, { useState } from 'react';
import classNames from 'classnames';
import './tabs.scss';

export default function Tabs({tabs}) {
    const [ activeTab, setActiveTab ] = useState(tabs[0].heading);

    return (
        <div className="tabs">
            {
                tabs.length > 1 ?
                    <>
                        <div className="tabs__nav">
                            {
                                tabs.map(tab => _renderTabNav(tab))
                            }
                        </div>
                        <div className="tabs__contents">
                            {
                                tabs.map(tab => _renderTabContents(tab))
                            }
                        </div>
                    </>
                    :
                    <div className="tabs__noTabs">
                        { tabs[0].content }
                    </div>
            }
        </div>
    );

    function _renderTabNav(tab) {
        return (
            <div className={classNames('tabs__nav-item', { active: tab.heading === activeTab })} onClick={() => setActiveTab(tab.heading)} key={tab.heading}>
                { tab.heading }
            </div>
        )
    }

    function _renderTabContents(tab) {
        return (
            <div className={classNames('tabs__contents-item', { active: tab.heading === activeTab })} key={tab.heading}>
                { tab.content }
            </div>
        )
    }
}