import React from 'react';
import './app/globals.css';

const SignUpPage = () => {
    return (
        <form action="">
            <div className="user-signup-main-container">
                <div className="user-signup-container">
                    <div className="user-signup-title">
                        Register
                    </div>
                    <div className="user-signup-left-form">
                        <div className="user-signup-left-form-bg"></div>
                        <div className="user-signup-username">
                            User Name
                        </div>
                        <input className="user-signup-username-textfield"></input>
                        <div className="user-signup-password">
                            Password
                        </div>
                        <input className="user-signup-password-textfield"></input>
                        <div className="user-signup-repassword">
                            Re-enter Password
                        </div>
                        <input className="user-signup-repassword-textfield"></input>
                        <div className="user-signup-birthday">
                            Birthday
                        </div>
                        <input className="user-signup-birthday-textfield-l"></input>
                        <input className="user-signup-birthday-textfield-r"></input>
                        <div className="user-signup-gender">
                            Gender
                        </div>
                         <select className="user-signup-gender-dropdown">
                            <option value="place holder">Select your Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="mentalillness">Other</option>
                        </select>
                        <div className="user-signup-nationality">
                            Nationality
                        </div>
                        <select className="user-signup-nationality-dropdown">
                            <option value="place holder">Select your Nationality</option>
                            <option value="malay">Malay</option>
                            <option value="chinese">Chinese</option>
                            <option value="indian">Indian</option>
                            <option value="other">Other</option>
                        </select>
                        <div className="user-signup-descendants">
                            Descendants
                        </div>
                        <select className="user-signup-descendants-dropdown">
                            <option value="place holder">Select your Descendants</option>
                            <option value="malay">Malay</option>
                            <option value="chinese">Chinese</option>
                            <option value="indian">Indian</option>
                            <option value="other">Other</option>
                        </select>
                        <div className="user-signup-religion">
                            Religion
                        </div>
                        <select className="user-signup-religion-dropdown">
                            <option value="place holder">Select your Religion</option>
                            <option value="islam">Islam</option>
                            <option value="buddhism">Buddhism</option>
                            <option value="christianity">Christianity</option>
                            <option value="hinduism">Hinduism</option>
                            <option value="aetheist">atheist</option>
                            <option value="other">Other</option>
                        </select>
                        <div className="user-signup-phone-no">
                            Phone Number
                        </div>
                        <input className="user-signup-phone-no-textfield"></input>
                        <div className="user-signup-rephone-no">
                            Re-Enter Phone Number
                        </div>
                        <input className="user-signup-rephone-no-textfield"></input>
                        <div className="user-signup-housephone-no">
                            House Phone Number
                        </div>
                        <input className="user-signup-housephone-no-textfield"></input>

                        <div className="user-signup-officephone-no">
                            Office Phone Number
                        </div>
                        <input className="user-signup-officephone-no-textfield"></input>
                    </div>
                    <div className="user-signup-right-form">
                        <div className="user-signup-left-form-bg"></div>
                        <div className="user-signup-address">
                            Address
                        </div>
                        <input className="user-signup-address-textfield-1"></input>
                        <input className="user-signup-address-textfield-2"></input>
                        <input className="user-signup-address-textfield-3"></input>
                        <input className="user-signup-address-textfield-4"></input>
                        <input className="user-signup-address-textfield-5"></input>
                        <div className="user-signup-passcode">
                            Passcode
                        </div>
                        <input className="user-signup-passcode-textfield"></input>
                        <div className="user-signup-state-region">
                            State and Region
                        </div>
                        <select className="user-signup-state-region-dropdown-1">
                            <option value="place holder">Select your Region</option>
                            <option value="johor">Johor</option>
                            <option value="kedah">Kedah</option>
                            <option value="kelantan">Kelantan</option>
                            <option value="melaka">Melaka</option>
                            <option value="negeri_sembilan">Negeri Sembilan</option>
                            <option value="pahang">Pahang</option>
                            <option value="penang">Penang</option>
                            <option value="perak">Perak</option>
                            <option value="perlis">Perlis</option>
                            <option value="selangor">Selangor</option>
                            <option value="terengganu">Terengganu</option>
                            <option value="sabah">Sabah</option>
                            <option value="sarawak">Sarawak</option>
                            <option value="kuala_lumpur">Kuala Lumpur</option>
                            <option value="putrajaya">Putrajaya</option>
                            <option value="labuan">Labuan</option>
                        </select>
                        <select className="user-signup-state-region-dropdown-2">
                            <option value="place holder">Select your States</option>
                            <option value="peninsular_malaysia">Peninsular Malaysia (West Malaysia)</option>
                            <option value="east_malaysia">East Malaysia (Malaysian Borneo)</option>
                        </select>
                        <div className="user-signup-email">
                            Email
                        </div>
                        <input className="user-signup-email-textfield"></input>
                        <div className="user-signup-reemail">
                            Re-Enter Email
                        </div>
                        <input className="user-signup-reemail-textfield"></input>
                        <div className="user-signup-red-text">
                            All of above need to be filled
                        </div>
                        <button className="user-signup-signup-button">
                            Register
                        </button>
                        <button className="user-signup-return-button">
                            Return
                        </button>
                    </div>
                    <div className="user-signup-upper-form">
                        <div className="user-signup-upper-form-bg"></div>
                        <div className="user-signup-icid">
                            IC or ID Card Number
                        </div>
                        <input type="text" className="user-signup-icid-textfield" />

                        <div className="user-signup-icid-img">
                            IC or ID Card image
                        </div>
                        <div className="user-signup-or" style={{ width: '61px', left: '285px', top: '114px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '16px', fontWeight: 500, wordWrap: 'break-word' }}>
                            Or
                        </div>
                        <button className="user-signup-icid-img-button">
                            <span className="material-symbols-outlined">
                                flip
                                </span>
                            Scan IC/ID
                        </button>
                        <div className="user-signup-mustaches-right"></div>
                        <div className="user-signup-mustaches-left"></div>
                        {/*  chechbox&button position */}
                        <div className="user-signup-icmissing-bg">
                            <input  className="user-signup-checkbox" type="checkbox" id="icmissing" name="icmissing" value="icmissing" />
                            <label>
                            {/* onclick="document.getElementById('icmissing').checked = !document.getElementById('icmissing').checked;" */}
                                <button  className="user-signup-checkbox-button" type="button" >
                                    IC only missing
                                </button>
                            </label>

                        </div>
                    </div>
                </div>
                <div className="user-signup-description">
                    If there are any problems while using the Ai Police Reporting system, please email the IT department: zalhazmi@gmail.com
                </div>
            </div>
        </form>
    );
};

export default SignUpPage;