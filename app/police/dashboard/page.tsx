'use client'

import React from 'react';
import "../../global.css"
import Image from 'next/image';
import NavBar from '@/components/NavBar';

export default function PoliceUserManagement(){
    return (
        <form action="">
            <NavBar />
            
            <div className="police-user-management-container">
                <div className="police-user-management-searchbar">
                    <div className="police-user-management-textfield-container">
                        <input type="text" placeholder="Search..." className="police-user-management-textfield" />
                    </div>
                    <button className="police-user-management-searchbar-button">
                        <span className="police-user-management-material-symbols-outlined type-icon">
                            search
                        </span>
                    </button>
                </div>
                <div className="police-user-management-overview-issues">
                    <div className="police-user-management-overview-issues-header">
                        <div className="police-user-management-overview-text">
                            <div className="police-user-management-title">
                                <h2>Overview</h2>
                                <p className="police-user-management-subtitle">Issues</p>
                            </div>
                        </div>
                        <select className="police-user-management-overview-issues-dropdown" name="" id="">
                            <option>Select Option 1</option>
                            <option>Select Option 2</option>
                        </select>
                    </div>
                    <div className="police-user-management-overview-issues-graph">
                        <div className="police-user-management-chart">
                            <div className="police-user-management-bar" style={{ height: '60%' }}>
                                <span>Jan</span>
                            </div>
                            <div className="police-user-management-bar" style={{ height: '50%' }}>
                                <span>Feb</span>
                            </div>
                            <div className="police-user-management-bar" style={{ height: '70%' }}>
                                <span>Mar</span>
                            </div>
                            <div className="police-user-management-bar" style={{ height: '40%' }}>
                                <span>Apr</span>
                            </div>
                            <div className="police-user-management-bar" style={{ height: '65%' }}>
                                <span>May</span>
                            </div>
                            <div className="police-user-management-bar" style={{ height: '75%' }}>
                                <span>Jun</span>
                            </div>
                            <div className="police-user-management-bar" style={{ height: '85%' }}>
                                <span>Jul</span>
                            </div>
                            <div className="police-user-management-bar highlighted" style={{ height: '100%' }}>
                                <span>Aug</span>
                            </div>
                            <div className="police-user-management-bar" style={{ height: '65%' }}>
                                <span>Sep</span>
                            </div>
                            <div className="police-user-management-bar" style={{ height: '55%' }}>
                                <span>Oct</span>
                            </div>
                            <div className="police-user-management-bar" style={{ height: '70%' }}>
                                <span>Nov</span>
                            </div>
                            <div className="police-user-management-bar" style={{ height: '60%' }}>
                                <span>Dec</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="police-user-management-bottom">
                    <div className="police-user-management-user-per">
                        <div className="police-user-management-user-per-title">
                            <div className="police-user-management-title">
                                <h2>Users</h2>
                                <p className="police-user-management-subtitle">User percentage</p>
                            </div>
                        </div>
                        <div className="police-user-management-user-per-graph">
                            <div className="police-user-management-user-per-bg">
                                <div className="police-user-management-user-per-chart">
                                    <div className="police-user-management-user-per-circle">
                                        <div className="police-user-management-user-per-inner-circle">
                                            <p className="police-user-management-user-per-percentage">65%</p>
                                            <p className="police-user-management-user-per-label">Total New User</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="police-user-management-issue-solve-per">
                        <div className="police-user-management-issue-solve-per-title">
                            <div className="police-user-management-title">
                                <h2>Overview</h2>
                                <p className="police-user-management-subtitle">Issues solve percentage</p>
                            </div>
                        </div>
                        <div className="police-user-management-issue-solve-per-graph">
                            <div className="police-user-management-issue-solve-per-bg">
                                <div className="police-user-management-issue-solve-per-chart-container">
                                    <div className="police-user-management-issue-solve-per-chart">
                                        <div className="police-user-management-issue-solve-per-circle">
                                            <div className="police-user-management-issue-solve-per-inner-circle">
                                                <p className="police-user-management-issue-solve-per-percentage">45%</p>
                                                <p className="police-user-management-issue-solve-per-label">Total Solved Problem</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        </form>
    );
};