import React from 'react';
import './app/globals.css';

const login = () => {
    return (
        <form action="">
            <div className={login-container}>
                <div className={login-logo-text}>
                    <img className={login-logo} src="/img/loginlogo.png"/>
                    <div className={login-text}>
                        <div className={login-font-police}>Police</div>
                        <div className={login-font-reporting}>Reporting</div>
                        <div className={login-font-ai}>Artificial Intelligence</div>
                        <div className={login-font-system}>System</div>
                    </div>
                </div>
                <div className={login-form}>
                    <div className={login-form-container}>
                    <div className={login-form-bg}></div>
                        <button className={login-login-button}>
                            login
                        </button>
                    <div className={login-form-or}>
                        Or
                    </div>
                        <button className={login-register-button}>
                            Register
                        </button>
                    <div className={login-username-id}>
                        <input type="text" placeholder="Username or id..." className={login-username-id-textfield}>
                    </div>
                    <div className={login-password}>
                        <input type="password" placeholder="Password" className={login-password-textfield}>
                    </div>
                    <div className={login-leftformmustache}></div>
                    <div className={login-rightformmustache}></div>
                    <div className={login-discription}>
                        This is an AI powered Police Reporting system. It provide online convenience for the public to submit police complaint via the Internet. This facility is specially provided for lodging police report pertaining to case of lost document or item that does not relate to crime.
                    </div>
                    <div className={login-title}>
                        Welcome to
                    </div>
                    <div className={login-subtitle}>
                        Police Reporting Ai System
                    </div>
                </div>
                </div>
            </div>
        </form>
    );
};

export default login;