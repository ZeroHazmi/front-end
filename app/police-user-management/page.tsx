import React from 'react';
import './app/globals.css';

const PoliceUserManagement = () => {
    return (
            <form action="">
            
            <nav>
                <div class="police-user-management-user-navbar-container">
                    <div class="police-user-management-user-navbar-left">
                        <img src="/Images/navbarlogo.png" class="police-user-management-logo" alt="Logo" />
                        <div class="police-user-management-user-navbar-title">
                            Police
                            <div class="police-user-management-user-navbar-subtitle">
                                Reporting AI System
                            </div>
                        </div>
                    </div>
                    <div class="police-user-management-user-navbar-links">
                        <div class="police-user-management-user-navbar-items">Communication</div>
                        <div class="police-user-management-user-navbar-items">FAQ</div>
                        <div class="police-user-management-user-navbar-logout-container">
                            <button class="police-user-management-user-navbar-logout-button">Logout</button>
                            <img src="https://via.placehopolice-user-management-lder.com/50x50" class="police-user-management-user-navbar-icon" alt="User" />
                        </div>
                    </div>
                </div>
            </nav>
            
            <div class="police-user-management-container">
                <div class="police-user-management-searchbar">
                    <div class="police-user-management-textfield-container">
                        <input type="text" placehopolice-user-management-lder="Search..." class="police-user-management-police-user-management-textfield">
                    </div>
                    <button class="police-user-management-searchbar-button">
                        <span class="police-user-management-material-symbols-outlined type-icon">
                            search
                        </span>
                    </button>
                </div>
                <div class="police-user-management-overview-issues">
                    <div class="police-user-management-overview-issues-header">
                        <div class="police-user-management-overview-text">
                            <div class="police-user-management-title">
                                <h2>Overview</h2>
                                <p class="police-user-management-subtitle">Issues</p>
                            </div>
                        </div>
                        <select class="police-user-management-overview-issues-dropdown" name="" id="">
                            <option>Select Option 1</option>
                            <option>Select Option 2</option>
                        </select>
                    </div>
                    <div class="police-user-management-overview-issues-graph">
                        <div class="police-user-management-chart">
                            <div class="police-user-management-bar" style="height: 60%;">
                                <span>Jan</span>
                            </div>
                            <div class="police-user-management-bar" style="height: 50%;">
                                <span>Feb</span>
                            </div>
                            <div class="police-user-management-bar" style="height: 70%;">
                                <span>Mar</span>
                            </div>
                            <div class="police-user-management-bar" style="height: 40%;">
                                <span>Apr</span>
                            </div>
                            <div class="police-user-management-bar" style="height: 65%;">
                                <span>May</span>
                            </div>
                            <div class="police-user-management-bar" style="height: 75%;">
                                <span>Jun</span>
                            </div>
                            <div class="police-user-management-bar" style="height: 85%;">
                                <span>Jul</span>
                            </div>
                            <div class="police-user-management-bar highlighted" style="height: 100%;">
                                <span>Aug</span>
                            </div>
                            <div class="police-user-management-bar" style="height: 65%;">
                                <span>Sep</span>
                            </div>
                            <div class="police-user-management-bar" style="height: 55%;">
                                <span>Oct</span>
                            </div>
                            <div class="police-user-management-bar" style="height: 70%;">
                                <span>Nov</span>
                            </div>
                            <div class="police-user-management-bar" style="height: 60%;">
                                <span>Dec</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="police-user-management-bottom">
                    <div class="police-user-management-user-per">
                        <div class="police-user-management-user-per-title">
                            <div class="police-user-management-title">
                                <h2>Users</h2>
                                <p class="police-user-management-subtitle">User percentage</p>
                            </div>
                        </div>
                        <div class="police-user-management-user-per-graph">
                            <div class="police-user-management-user-per-bg">
                                <div class="police-user-management-user-per-chart">
                                <div class="police-user-management-user-per-circle">
                                    <div class="police-user-management-user-per-inner-circle">
                                    <p class="police-user-management-user-per-percentage">65%</p>
                                    <p class="police-user-management-user-per-label"police-user-management->Total New User</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="police-user-management-issue-solve-per">
                        <div class="police-user-management-issue-solve-per-title">
                            <div class="police-user-management-title">
                                <h2>Overview</h2>
                                <p class="police-user-management-subtitle">Issues solve percentage</p>
                            </div>
                        </div>
                        <div class="police-user-management-issue-solve-per-graph">
                            <div class="police-user-management-issue-solve-per-bg">
                                <div class="police-user-management-issue-solve-per-chart-container">
                                    <div class="police-user-management-issue-solve-per-chart">
                                        <div class="police-user-management-issue-solve-per-circle">
                                            <div class="police-user-management-issue-solve-per-inner-circle">
                                                <p class="police-user-management-issue-solve-per-percentage">45%</p>
                                                <p class="police-user-management-issue-solve-per-label"police-user-management->Total Solved Problem</p>
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