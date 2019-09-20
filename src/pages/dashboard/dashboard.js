import React from 'react';
import './dashboard.scss';
import Aside from "../../components/aside/aside";

export default function Dashboard() {
    return (
        <>
            <div className="grid_col laptop-col-9 tablet-col-8">
                <section className="section">
                    Modules
                </section>
                <section className="section">
                    Grades graph
                </section>
            </div>
            <div className="grid_col laptop-col-3 tablet-col-4">
                <Aside/>
            </div>
        </>
    )
}
