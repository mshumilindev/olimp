/* global google */

import React, {useContext, useEffect, useState} from 'react';
import './landing.scss';
import { connect } from 'react-redux';
import {fetchSiteSettings} from "../../redux/actions/siteSettingsActions";
import {Preloader} from "../../components/UI/preloader";
import SiteSettingsContext from "../../context/siteSettingsContext";
import { Link } from 'react-router-dom';
import TextTooltip from "../../components/UI/TextTooltip/TextTooltip";
import DocumentTitle from "react-document-title";
import img01 from './img/img01.jpg';
import favicon from './img/favicon.png';
import classNames from 'classnames';
import {fetchUsers} from "../../redux/actions/usersActions";
import {orderBy} from "natural-orderby";
import {Scrollbars} from "react-custom-scrollbars";
import ReactPlayer from "react-player";
import GoogleMapReact from "google-map-react";

function Landing({ logo, siteName, address, usersList }) {
    const { translate, lang } = useContext(SiteSettingsContext);
    const [ currentScreen, setCurrentScreen] = useState(0);
    const [ geolocation, setGeolocation ] = useState(null);
    const geocoder = new google.maps.Geocoder();
    let currentScreenVar = 0;

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);

            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleScroll);
            currentScreenVar = currentScreen;
        }, 100);
    }, [currentScreen]);

    useEffect(() => {
        if ( address && address.value ) {
            geocoder.geocode({address: address.value}, (res) => {
                if ( res && res.length ) {
                    setGeolocation({lat: res[0].geometry.location.lat(), lng: res[0].geometry.location.lng()})
                }
            });
        }
    }, [address]);

    const landingNav = [
        {
            title: translate('start'),
            icon: 'fas fa-home'
        },
        {
            title: translate('process'),
            icon: 'fa fa-graduation-cap'
        },
        {
            title: translate('teachers'),
            icon: 'fas fa-chalkboard-teacher'
        },
        {
            title: translate('gallery'),
            icon: 'far fa-images'
        },
        {
            title: translate('model_lesson'),
            icon: 'fab fa-youtube'
        },
        {
            title: translate('map'),
            icon: 'fas fa-map-marker-alt'
        }
    ];

    return (
        <div className="landing">
            {
                !logo || !siteName || !address ||
                !usersList || !usersList.length ?
                    <>
                        <Preloader size={150} color={'#7f00a3'}/>
                        <div className="landing__favicon" style={{backgroundImage: 'url(' + favicon + ')'}} />
                    </>
                    :
                    <DocumentTitle title={ siteName[lang] ? siteName[lang] : siteName['ua'] }>
                        <>
                            <div className="landing__header">
                                <h1 className="landing__logo">
                                    <img src={ logo.url } alt={ siteName[lang] ? siteName[lang] : siteName['ua'] } />
                                </h1>
                                <div className="landing__login">
                                    <Link to="/login">
                                        <TextTooltip position="top" text={translate('login')} children={
                                            <i className="fas fa-key" />
                                        }/>
                                    </Link>
                                </div>
                            </div>
                            { _renderNav() }
                            { _renderContact() }
                            { _renderSocial() }
                            <div className="landing__content">
                                <div className="landing__block hasImage" style={{backgroundImage: 'url(' + img01 + ')'}} id="block0">
                                    <h2>Платформа дистанційного навчання<br/>Колегіуму "Олімп"</h2>
                                    {/* Placeholder */}
                                    <p>Сюда пойдет короткое описание платформы. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer porttitor rutrum est id tempor. Vivamus sem ex, luctus vel nisi eget, ultricies faucibus lorem. Fusce metus lectus, sagittis et purus id, ullamcorper aliquet augue. Quisque eleifend lorem eu quam ultrices hendrerit. Nullam ac porttitor magna. Sed sed metus in velit laoreet fermentum. Quisque augue nisl, aliquet at nibh at, viverra venenatis enim.</p>
                                    <p>Mauris ac sem erat. Aliquam in tincidunt ipsum. Aenean quis massa vitae odio pharetra vestibulum sed eu turpis.</p>
                                    <div className="landing__scrollDown" onClick={() => setViewport(1)}>
                                        <TextTooltip position="top" text={ translate('scroll_down') } children={
                                            <i className="fas fa-chevron-down"/>
                                        }/>
                                    </div>
                                </div>
                                <div className="landing__block" id="block1">
                                    <h3>{ translate('process') }</h3>
                                </div>
                                <div className="landing__block isGrey" id="block2">
                                    <h3>{ translate('teachers') }</h3>
                                    { _renderUsers() }
                                </div>
                                <div className="landing__block" id="block3">
                                    <h3>{ translate('gallery') }</h3>
                                </div>
                                <div className="landing__block" id="block4">
                                    { _renderModelLesson() }
                                </div>
                                <div className="landing__block" id="block5">
                                    { _renderMap() }
                                </div>
                            </div>
                        </>
                    </DocumentTitle>
            }
        </div>
    );

    function _renderNav() {
        return (
            <div className={classNames('landing__nav', {isWhite: currentScreen === 0})}>
                {
                    landingNav.map((item, index) => {
                        return (
                            <div className={classNames('landing__nav-item', {isActive: index === currentScreen})} key={item.title}>
                                <TextTooltip position="right" text={ item.title } children={
                                    <span className="landing__nav-link" onClick={() => setViewport(index)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                        <i className={ item.icon }/>
                                    </span>
                                }/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    function _renderContact() {
        return (
            <div className="landing__address">
                <p><i className="content_title-icon fas fa-map-marked-alt" />м. Київ, Північно-Сирецька 1-3 Б</p>
                <p><i className="content_title-icon fas fa-mobile-alt" /><a href="tel:+380674406769">(067) 440 67 69</a></p>
            </div>
        )
    }

    function _renderSocial() {
        return (
            <div className="landing__social">
                <div className="landing__social-item">
                    <i className="fab fa-facebook-f" />
                </div>
                <div className="landing__social-item">
                    <i className="fab fa-instagram" />
                </div>
                <div className="landing__social-item">
                    <i className="fab fa-telegram-plane" />
                </div>
            </div>
        )
    }

    function _renderUsers() {
        return (
            <div className="landing__users">
                <Scrollbars
                    autoHeight
                    hideTracksWhenNotNeeded
                    renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}
                    renderView={props => <div {...props} className="scrollbar__content"/>}
                >
                    {
                        orderBy(usersList, v => v.name).filter(userItem => userItem.role === 'teacher').map(userItem => {
                            return (
                                <div className="landing__user" key={userItem.id}>
                                    <div className="landing__user-avatar">
                                        <div className="landing__user-avatar-inner" style={{backgroundImage: 'url(' + userItem.avatar + ')'}}>
                                            {
                                                userItem.avatar ?
                                                    null
                                                    :
                                                    <div className="landing__user-avatar-placeholder">
                                                        <i className="fa fa-user" />
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="landing__user-name">{ userItem.name }</div>
                                    <div className="landing__user-descr">
                                        {/* Placeholder */}
                                        Сюда идет описание учителя, например: предметы, которые он преподает, дополнительные уроки и т.д.
                                    </div>
                                </div>
                            )
                        })
                    }
                </Scrollbars>
            </div>
        )
    }

    function _renderMap() {
        return (
            <div className="landing__contact">
                <div className="landing__map">
                    {
                        geolocation && geolocation.lat && geolocation.lng ?
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: 'AIzaSyAP1mtGvLFJGu-LMzwIOJrqabTF3oDKgMw' }}
                                defaultCenter={{lat: geolocation.lat, lng: geolocation.lng}}
                                defaultZoom={15}
                                yesIWantToUseGoogleMapApiInternals
                            >
                                <div className="map__marker" lat={geolocation.lat} lng={geolocation.lng}>
                                    <i className="fas fa-map-marker-alt" />
                                </div>
                            </GoogleMapReact>
                            :
                            null
                    }
                </div>
            </div>
        )
    }

    function _renderModelLesson() {
        return (
            <div className="landing__video">
                {/* Placeholder */}
                <ReactPlayer url="https://www.youtube.com/watch?v=0bvZfJ8cjYc&feature=youtu.be" width={'100%'} height={'100%'} controls />
            </div>
        )
    }

    function handleMouseEnter() {
        document.querySelector('body').classList.add('isNavOver');
    }

    function handleMouseLeave() {
        document.querySelector('body').classList.remove('isNavOver');
    }

    function setViewport(index) {
        const screenHeight = window.innerHeight - 120;

        window.scrollTo({
            top: screenHeight * index,
            behavior: 'smooth'
        });
    }

    function handleResize() {
        if ( document.getElementById('block' + currentScreen) ) {
            const screenHeight = window.innerHeight - 120;

            window.scrollTo({
                top: screenHeight * currentScreen
            });
        }
    }

    function handleScroll() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight - 120;
        const increment = Math.round(parseFloat(scrollTop / windowHeight.toFixed(1)));

        if ( currentScreenVar !== increment ) {
            currentScreenVar = increment;
            setCurrentScreen(increment);
        }
    }
}

const mapStateToProps = state => {
    return {
        logo: state.siteSettingsReducer.siteSettingsList ? state.siteSettingsReducer.siteSettingsList.logo : null,
        siteName: state.siteSettingsReducer.siteSettingsList ? state.siteSettingsReducer.siteSettingsList.siteName : null,
        address: state.siteSettingsReducer.siteSettingsList ? state.siteSettingsReducer.siteSettingsList.address : null,
        usersList: state.usersReducer.usersList
    }
};

const mapDispatchToProps = dispatch => ({
    fetchSiteSettings: dispatch(fetchSiteSettings()),
    fetchUsers: dispatch(fetchUsers('teacher')),
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);