import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default class ConsultationsList extends React.Component {
    constructor() {
        super();
        this.consultationsList = [
            {
                id: 0,
                slug: 'phisics_and_astronomy',
                from: '1559217986000',
                to: '1559225186000',
                title: 'Фізика і астрономія'
            },
            {
                id: 1,
                slug: 'phisics_and_astronomy',
                from: '1559217986000',
                to: '1559225186000',
                title: 'Фізика і астрономія'
            },
            {
                id: 2,
                slug: 'phisics_and_astronomy',
                from: '1559311586000',
                to: '1559318786000',
                title: 'Фізика і астрономія'
            }
        ]
    }

    render() {
        const { prefix } = this.props;

        return (
            <div className={prefix + 'consultationsList'}>
                {
                    this.consultationsList.map(item => this._renderItem(item))
                }
            </div>
        )
    }

    _renderItem(item) {
        const { prefix } = this.props;
        const date = moment(+item.from).format('DD.MM')
        const from = moment(+item.from).format('HH:mm');
        const to = moment(+item.to).format('HH:mm');

        return (
            <div className={prefix + 'consultationsList_item'} key={ item.id }>
                <div className={prefix + 'consultationsList_time'}>
                    <span>{ date }&nbsp;</span>
                    <span>{ from + ' - ' + to }</span>
                </div>
                <div className={prefix + 'consultationsList_title'}>
                    <Link to={'/consultations/' + item.slug}>{ item.title }</Link>
                </div>
            </div>
        )
    }
}