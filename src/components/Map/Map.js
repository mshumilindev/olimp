import React, { useState, useEffect } from 'react';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';
import './map.scss';
import {Preloader} from "../UI/preloader";

function MapContainer({address, small}) {
    const [ width, setWidth ] = useState(null);
    const [ height, setHeight ] = useState(null);
    const parsedAddres = address.split(', ');

    useEffect(() => {
        if ( !width && !height ) {
            setSize();
        }
    }, [address]);

    return (
        <div className="map">
            {
                width && height ?
                    <Map center={[parseFloat(parsedAddres[0]), parseFloat(parsedAddres[1])]} zoom={15} width={width} height={height}>
                        <Marker anchor={[parseFloat(parsedAddres[0]), parseFloat(parsedAddres[1])]} payload={1} />
                    </Map>
                    :
                    <Preloader/>
            }
        </div>
    );

    function setSize() {
        const mapContainer = document.querySelector('.mapContainer');

        setWidth(mapContainer.getBoundingClientRect().width);

        if ( window.outerWidth > 769 ) {
            if ( small ) {
                setHeight(mapContainer.getBoundingClientRect().width * 28.125 / 100);
            }
            else {
                setHeight(mapContainer.getBoundingClientRect().width * 56.25 / 100);
            }
        }
        else {
            setHeight(mapContainer.getBoundingClientRect().width * 56.25 / 100);
        }
    }
}

export default MapContainer;