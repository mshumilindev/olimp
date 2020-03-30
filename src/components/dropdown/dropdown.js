import React from 'react';
import './dropdown.scss';

export default class Dropdown extends React.Component {
    constructor() {
        super();
        this.state = {
            isHidden: true
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.checkIfCanHide = this.checkIfCanHide.bind(this);
    }

    render() {
        const { width } = this.props;

        return (
            <div className="dropdown">
                <span className="dropdown_trigger" onClick={this.toggleDropdown} ref={'$trigger'}>
                    { this.props.trigger }
                </span>
                <div className="dropdown_block" style={{width: width}} hidden={this.state.isHidden}>
                    { this.props.children }
                </div>
            </div>
        )
    }

    checkIfCanHide(e) {
        const targetParent = e.target.closest('.dropdown_trigger');

        if ( targetParent && targetParent === this.refs.$trigger ) {
            return false;
        }
        this.toggleDropdown('hide');
    }

    toggleDropdown(action) {
        this.setState(state => {
            return {
                isHidden: action === 'hide' ? true : !state.isHidden
            }
        })
    }
}