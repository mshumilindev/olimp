import React, { useContext } from 'react';
import userContext from "../../context/userContext";

export const Preloader = ({size = 100, color}) => {
    const { user } = useContext(userContext);

    return (
        <div className="preloader">
            <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
                 preserveAspectRatio="xMidYMid" className="lds-dual-ring">
                <circle cx="50" cy="50" fill="none" strokeLinecap="round" r="40" strokeWidth="4" stroke={color ? color : user && user.role === 'student' ? '#7f00a3' : '#ffba41'} strokeDasharray="62.83185307179586 62.83185307179586" transform="rotate(185.935 50 50)">
                    <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/>
                </circle>
            </svg>
        </div>
    )
};