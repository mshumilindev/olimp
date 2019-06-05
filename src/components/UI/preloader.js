import React from 'react';
import Loader from "../../assets/img/loader.svg";

export const Preloader = ({size = 100}) => {
    return (
        <div className="preloader">
            <img src={Loader} alt="Loading" width={size} height={size}/>
        </div>
    )
};