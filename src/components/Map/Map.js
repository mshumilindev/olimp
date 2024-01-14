/* global google */

import React, { useState, useEffect } from "react";
import "./map.scss";
import Preloader from "../UI/preloader";
import GoogleMapReact from "google-map-react";

function MapContainer({ address }) {
  const [geolocation, setGeolocation] = useState(null);
  const geocoder = new google.maps.Geocoder();

  useEffect(() => {
    if (address) {
      geocoder.geocode({ address: address }, (res) => {
        if (res && res.length) {
          setGeolocation({
            lat: res[0].geometry.location.lat(),
            lng: res[0].geometry.location.lng(),
          });
        }
      });
    }
  }, [address]);

  return (
    <div className="map">
      <div className="map__inner">
        {geolocation ? (
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyAP1mtGvLFJGu-LMzwIOJrqabTF3oDKgMw",
            }}
            defaultCenter={{ lat: geolocation.lat, lng: geolocation.lng }}
            defaultZoom={15}
            yesIWantToUseGoogleMapApiInternals
          >
            <div
              className="map__marker"
              lat={geolocation.lat}
              lng={geolocation.lng}
            >
              <i className="fas fa-map-marker-alt" />
            </div>
          </GoogleMapReact>
        ) : (
          <Preloader />
        )}
      </div>
    </div>
  );
}

export default MapContainer;
