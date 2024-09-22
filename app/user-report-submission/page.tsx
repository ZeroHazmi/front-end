import React from 'react';
import '../globals.css';

const UserReportingSubmission = () => {
    return (
        <form action="">
            <nav>
                <div class="user-navbar-container">
                    <div class="user-navbar-left">
                        {/* !! gambaq dalam public/image if x muncul !! */}
                        <img src="/Images/navbarlogo.png" class="logo" alt="Logo"/>
                        <div class="user-navbar-title">
                            Police
                            <div class="user-navbar-subtitle">
                                Reporting AI System
                            </div>
                        </div>
                    </div>
                    <div class="user-navbar-links">
                        <div class="user-navbar-items">Communication</div>
                        <div class="user-navbar-items">FAQ</div>
                        <div class="user-navbar-logout-container">
                            <button class="user-navbar-logout-button">Logout</button>
                            <img src="https://via.placeholder.com/50x50" class="user-navbar-icon" alt="User" />
                        </div>
                    </div>
                </div>
            </nav>
            <div class="user-reporting-submisison-layout">
                <div class="user-reporting-submisison-title">
                    <h1>Reporting Submission</h1>
                </div>
                <div class="user-reporting-submisison-container">
                    <div class="user-reporting-submisison-options">
                        <!-- Typing Report Card -->
                        <div class="user-reporting-submisison-typing-card">
                            <div class="user-reporting-submisison-typing-card-format">
                                <span class="user-reporting-submisison-typing-card-text">
                                    Before you continue to <b>Typing Report</b>, it's important to know that you'll have to type out your report yourself on this page. Just use your keyboard to input all the important information about the incident.
                                </span>
                            </div>
                            <button class="user-reporting-submisison-card-btn">
                                <div class="user-reporting-submisison-card-btn-logo">
                                    <span class="user-reporting-submisison-material-symbols-outlined type-icon">
                                        keyboard
                                    </span>
                                </div>
                            </button>
                        </div>
                        <div class="user-reporting-submisison-or">OR</div>
                        <div class="user-reporting-submisison-speech-card">
                            <div class="user-reporting-submisison-speech-card-main-format">
                                <div class="user-reporting-submisison-speech-card-red-text">
                                    Required Microphone or Audio input
                                </div>
                                <div class="user-reporting-submisison-speech-card-format">
                                    <span class="speech-card-text">
                                        Before you continue to <b>Ai Speech to text conversation</b>, remember that you'll need to speak clearly for the AI system to understand and summarize your report correctly. Find a quiet place and make sure to pronounce your words clearly for the best outcome.
                                    </span>
                                </div>
                            </div>
                            <button class="user-reporting-submisison-card-btn">
                                <div class="user-reporting-submisison-card-btn-logo">
                                    <span class="user-reporting-submisison-material-symbols-outlined talk-icon">
                                        record_voice_over
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default UserReportingSubmission;