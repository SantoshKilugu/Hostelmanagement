import React, { useState } from 'react';
import axios from 'axios';
import './styles/Registration.css';

const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        roll_no: '',
        year: '',
        branch: '',
        hostel_block_name: '',
        room_no: '',
        parent_no: ''
    });
    const [isRegistered, setIsRegistered] = useState(false);
    const [userData, setUserData] = useState(null);
    const [activeButton, setActiveButton] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // State to hold the selected file

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3300/register', formData);
            alert(response.data.message);

            setFormData({
                name: '',
                roll_no: '',
                year: '',
                branch: '',
                hostel_block_name: '',
                room_no: '',
                parent_no: ''
            });
            setIsRegistered(true);
        } catch (error) {
            console.error('Error:', error);
            alert('Registration failed. Please try again.');
        }
    };

    const handleAddFingerprint = async () => {
        try {
            const response = await axios.post('http://localhost:3300/run-jar');
            const data = response.data;

            if (data.length > 0) {
                setUserData(data[0]);
                alert("Fingerprint added successfully.");
            } else {
                alert("No user found.");
            }
        } catch (error) {
            console.error('Error running JAR:', error);
            // alert('Error occurred while adding fingerprint.');
        }
    };

    const handleUpdateFingerprint = async () => {
        try {
            const response = await axios.post('http://localhost:3300/run-jar-update');
            const data = response.data;

            if (data.length > 0) {
                setUserData(data[0]);
                alert("Fingerprint updated successfully.");
            } else {
                alert("No user found.");
            }
        } catch (error) {
            console.error('Error running JAR:', error);
            // alert('Error occurred while adding fingerprint.');
        }
    };

    const handleExcelSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('excelFile', selectedFile); // Ensure this matches the server's expected field name

        try {
            const response = await axios.post('http://localhost:3300/upload-excel', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error uploading Excel file:', error);
            alert('Failed to upload Excel file.');
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // Set the selected file
    };

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);

        // if (buttonName === 'addFingerprint') {
        //     handleAddFingerprint();
        // }
        // if (buttonName === 'updateFingerprint') {
        //     handleUpdateFingerprint();
        // }
    };

    const handleBack = () => {
        setActiveButton(null);
        setIsRegistered(false); // Reset registration state on back
    };

    return (
        <div className="registration-container">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration</h2>

            {!activeButton && (
                <div className="button-container">
                    <button onClick={() => handleButtonClick('singleUser')} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                        Single User
                    </button>
                    <button onClick={() => handleButtonClick('addFingerprint')} className="bg-gray-800 text-white font-semibold py-2  px-4 rounded hover:bg-gray-700 transition duration-200">
                        Add Fingerprint
                    </button>
                    <button onClick={() => handleButtonClick('updateFingerprint')} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                        Update Fingerprint
                    </button>
                    <button onClick={() => handleButtonClick('moreUsers')} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                        More Users
                    </button>

                </div>
            )}

            {activeButton === 'singleUser' && (
                <div>
                    <form className="registration-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Roll No:</label>
                            <input type="text" name="roll_no" value={formData.roll_no} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Year:</label>
                            <input type="text" name="year" value={formData.year} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Branch:</label>
                            <input type="text" name="branch" value={formData.branch} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Hostel Block Name:</label>
                            <input type="text" name="hostel_block_name" value={formData.hostel_block_name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Room No:</label>
                            <input type="text" name="room_no" value={formData.room_no} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Parent No:</label>
                            <input type="text" name="parent_no" value={formData.parent_no} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="bg-gray-800 text-white font-semibold py-2 px-4 rounded w-24 mx-auto block hover:bg-gray-700 transition duration-200">Register</button>
                    </form>

                    {/* Back button */}
                    <div className="button-container">
                        <button onClick={handleBack} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded w-24 mx-auto block hover:bg-gray-700 transition duration-200">Back</button>
                    </div>

                    {isRegistered && ( // Show Add Fingerprint button after registration
                        <button onClick={handleAddFingerprint} className="bg-gray-800 text-white font-semibold mx-auto block mt-4 py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                            Add Fingerprint
                        </button>
                    )}
                </div>
            )}

            {activeButton === 'moreUsers' && (
                <div>
                    <form onSubmit={handleExcelSubmit}>
                        <input type="file" name="excelFile" accept=".xlsx, .xls" onChange={handleFileChange} required />
                        <button type="submit" className="bg-gray-800 text-white font-semibold py-2 px-4 rounded ml-3 hover:bg-gray-700 transition duration-200">Upload Excel</button>
                    </form>

                    {/* Back button */}
                    <div className="button-container">
                        <button onClick={handleBack} className="bg-gray-800 text-white font-semibold mx-auto block py-2 px-4 rounded hover:bg-gray-700 transition duration-200">Back</button>
                    </div>
                </div>
            )}

            {activeButton === 'addFingerprint' && (
                <div>
                    {/* Add Fingerprint logic can be placed here or kept in the same handler */}
                    <div className="button-container">
                        <button onClick={handleAddFingerprint} className="bg-gray-800 text-white font-semibold py-2 mx-auto block px-4 rounded hover:bg-gray-700 transition duration-200"> Fingerprint</button>
                    </div>

                    {/* Back button for Add Fingerprint */}
                    <div className="button-container">
                        <button onClick={handleBack} className="bg-gray-800 text-white font-semibold py-2 mx-auto block px-4 rounded hover:bg-gray-700 transition duration-200">Back</button>
                    </div>
                </div>
            )}

{activeButton === 'updateFingerprint' && (
                <div>
                    {/* Add Fingerprint logic can be placed here or kept in the same handler */}
                    <div className="button-container">
                        <button onClick={handleUpdateFingerprint} className="bg-gray-800 text-white font-semibold py-2 mx-auto block px-4 rounded hover:bg-gray-700 transition duration-200"> Fingerprint</button>
                    </div>

                    {/* Back button for Add Fingerprint */}
                    <div className="button-container">
                        <button onClick={handleBack} className="bg-gray-800 text-white font-semibold py-2 mx-auto block px-4 rounded hover:bg-gray-700 transition duration-200">Back</button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Registration;
