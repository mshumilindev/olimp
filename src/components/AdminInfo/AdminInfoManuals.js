import React from 'react';
import AdminInfoManualsItem from "./AdminInfoManualsItem";

export default function AdminInfoManuals({manuals}) {
    return (
        <div className="manuals">
            {
                manuals.map((manual, index) => _renderManual(manual, index))
            }
        </div>
    );

    function _renderManual(manual, index) {
        return (
            <div className="manuals__manual" key={'manual' + index}>
                <h2 className="manuals__title">{manual.title}</h2>
                {
                    manual.sections && manual.sections.length ?
                        manual.sections.map((section, index) => _renderSection(section, index))
                        :
                        null
                }
            </div>
        )
    }

    function _renderSection(section, index) {
        const sectionNum = index + 1;

        return (
            <div className="manuals__section" key={'section' + index}>
                <h3 className="manuals__sectionTitle"><span>{ sectionNum }.</span> { section.sectionTitle }</h3>
                {
                    section.blocks && section.blocks.length ?
                        section.blocks.map((block, index) => _renderBlock(block, index, sectionNum))
                        :
                        null
                }
            </div>
        )
    }

    function _renderBlock(block, index, sectionNum) {
        const blockNum = sectionNum + '.' + (index + 1);

        return (
            <div className="manuals__block" key={'block' + index}>
                <h4 className="manuals__blockTitle"><span>{ blockNum }</span> { block.blockTitle }</h4>
                {
                    block.items && block.items.length ?
                        block.items.map((item, index) => <AdminInfoManualsItem item={item} key={index} />)
                        :
                        null
                }
            </div>
        )
    }
}