import React, { useState } from 'react';
import axios from 'axios';
import './styles/Registration.css';
import { useParams } from 'react-router-dom';
const Registration = ({ type }) => {
  const { type1 } = useParams();
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
    // const [activeButton, setActiveButton] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // State to hold the selected file
    const [errors, setErrors] = useState({});
  
    const validateForm = () => {
        const newErrors = {};
        const phoneRegex = /^[0-9]{10}$/; // Regex for a 10-digit phone number

        // Validate year
        if (!Number.isInteger(Number(formData.year))) {
            newErrors.year = 'Year must be an integer';
        }

        // Validate room number
        if (!Number.isInteger(Number(formData.room_no))) {
            newErrors.room_no = 'Room number must be an integer';
        }

        // Validate parent phone number
        if (!phoneRegex.test(formData.parent_no)) {
            newErrors.parent_no = 'Parent number must be a valid 10-digit phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };
        

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert('Please correct the errors in the form.');
            return;
        }

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
    const [rollNo, setRollNo] = useState('');

    const handleVerifyRollNo = async () => {
        try {
          const response = await axios.get(`http://localhost:3300/verify-rollupdate/${rollNo}`);
          if (response.data.length > 0) {
            const user = response.data[0];
            setUserData(user);
            setFormData({
              name: user.sname,
              roll_no: user.studentId,
              year: user.syear,
              branch: user.branch,
              hostel_block_name: user.hostelblock,
              room_no: user.roomno,
              parent_no: user.parentno
            });
          } else {
            alert("No user found with that roll number.");
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          alert('Failed to verify roll number.');
        }
      };
    
      const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
          alert('Please correct the errors in the form.');
          return;
        }
    
        try {
          const response = await axios.put(`http://localhost:3300/update-user`, formData);
          alert(response.data.message);
          setUserData(null); // Clear user data after updating
          setFormData({ // Reset form data
            name: '',
            roll_no: '',
            year: '',
            branch: '',
            hostel_block_name: '',
            room_no: '',
            parent_no: ''
          });
        } catch (error) {
          console.error('Error updating user:', error);
          alert('Update failed. Please try again.');
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
    const handleImageExcelSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('imageExcelFile', selectedFile); // Ensure this matches the server's expected field name

      try {
          const response = await axios.post('http://localhost:3300/upload-images-excel', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          alert(response.data.message);
      } catch (error) {
          console.error('Error uploading image Excel file:', error);
          alert('Failed to upload image Excel file.');
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

   

   
    return (
        <div className="registration-container">
          
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration</h2>

            {/* {!activeButton && (
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
            )} */}


{type === 'updateUser' && (
        <div>
                <input 
        type="text" 
        value={rollNo} 
        onChange={(e) => setRollNo(e.target.value)} 
        placeholder="Enter Roll Number" 
        className="border rounded w-1/2 px-3 py-2 mx-auto mb-4 block"
      />
          <button onClick={handleVerifyRollNo} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded w-44 mx-auto block hover:bg-gray-700 transition duration-200">
            Verify Roll Number
          </button>

          {userData && (
            <form className="max-w-md mx-auto mt-4" onSubmit={handleUpdateUser}>
              <div className="relative z-0 w-full mb-5 group">
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="name"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Name
    </label>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
      type="text"
      name="roll_no"
      value={formData.roll_no}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="roll_no"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Roll No
    </label>
  </div>

              <div className="relative z-0 w-full mb-5 group">
    <input
      type="number"
      name="year"
      value={formData.year}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="year"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Year
    </label>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
      type="text"
      name="branch"
      value={formData.branch}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="branch"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Branch
    </label>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
      type="text"
      name="hostel_block_name"
      value={formData.hostel_block_name}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="hostel_block_name"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Hostel Block Name
    </label>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
      type="number"
      name="room_no"
      value={formData.room_no}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="room_no"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Room No
    </label>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
      type="text"
      name="parent_no"
      value={formData.parent_no}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="parent_no"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Parent No
    </label>
    {errors.parent_no && <p className="text-red-600 text-xs italic">{errors.parent_no}</p>} {/* Display error message */}
    {/* {errors.parent_no && <p className="error-message">{errors.parent_no}</p>} */}
  </div>
              

              <button type="submit" className="bg-gray-800 text-white font-semibold py-2 px-4 rounded w-24 mx-auto block hover:bg-gray-700 transition duration-200">Update</button>
            </form>
          )}
        </div>
      )}







            {type === 'singleUser' && (
                <div>
                   <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
  <div className="relative z-0 w-full mb-5 group">
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="name"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Name
    </label>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
      type="text"
      name="roll_no"
      value={formData.roll_no}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="roll_no"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Roll No
    </label>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
      type="number"
      name="year"
      value={formData.year}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="year"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Year
    </label>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
      type="text"
      name="branch"
      value={formData.branch}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="branch"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Branch
    </label>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
      type="text"
      name="hostel_block_name"
      value={formData.hostel_block_name}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="hostel_block_name"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Hostel Block Name
    </label>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
      type="number"
      name="room_no"
      value={formData.room_no}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="room_no"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Room No
    </label>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
      type="text"
      name="parent_no"
      value={formData.parent_no}
      onChange={handleChange}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
      placeholder=" "
      required
    />
    <label
      htmlFor="parent_no"
      className="peer-focus:font-medium absolute text-sm text-gray-800 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      Parent No
    </label>
    {errors.parent_no && <p className="text-red-600 text-xs italic">{errors.parent_no}</p>} {/* Display error message */}
    {/* {errors.parent_no && <p className="error-message">{errors.parent_no}</p>} */}
  </div>

  <button type="submit" className="bg-gray-800 text-white font-semibold py-2 px-4 rounded w-24 mx-auto block hover:bg-gray-700 transition duration-200">Register</button>
</form>
                    {/* Back button */}
                    {/* <div className="button-container">
                        <button onClick={handleBack} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded w-24 mx-auto block hover:bg-gray-700 transition duration-200">Back</button>
                    </div> */}

                    {isRegistered && ( // Show Add Fingerprint button after registration
                        <button onClick={handleAddFingerprint} className="bg-gray-800 text-white font-semibold mx-auto block mt-4 py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                            Add Fingerprint
                        </button>
                    )}
                </div>
            )}

            {type === 'moreUsers' && (
                <div>
                    <form onSubmit={handleExcelSubmit}>
                        <input type="file" name="excelFile" accept=".xlsx, .xls" onChange={handleFileChange} required />
                        <button type="submit" className="bg-gray-800 text-white font-semibold py-2 px-4 rounded ml-3 hover:bg-gray-700 transition duration-200">Upload Excel</button>
                    </form>

                    {/* Back button */}
                    {/* <div className="button-container">
                        <button onClick={handleBack} className="bg-gray-800 text-white font-semibold mx-auto block py-2 px-4 rounded hover:bg-gray-700 transition duration-200">Back</button>
                    </div> */}
                </div>
            )}

{type === 'moreImages' && (
                <div>
                    <form onSubmit={handleImageExcelSubmit}>
                        <input type="file" name="imageExcelFile" accept=".xlsx, .xls" onChange={handleFileChange} required />
                        <button type="submit" className="bg-gray-800 text-white font-semibold py-2 px-4 rounded ml-3 hover:bg-gray-700 transition duration-200">Upload Excel with Images</button>
                    </form>
                </div>
            )}

            {type === 'addFingerprint' && (
                <div>
                    {/* Add Fingerprint logic can be placed here or kept in the same handler */}
                    <div className="button-container">
                        <button onClick={handleAddFingerprint} className="bg-gray-800 text-white font-semibold py-2 mx-auto block px-4 rounded hover:bg-gray-700 transition duration-200"> Fingerprint</button>
                    </div>

                    {/* Back button for Add Fingerprint */}
                    {/* <div className="button-container">
                        <button onClick={handleBack} className="bg-gray-800 text-white font-semibold py-2 mx-auto block px-4 rounded hover:bg-gray-700 transition duration-200">Back</button>
                    </div> */}
                </div>
            )}

{type === 'updateFingerprint' && (
                <div>
                    {/* Add Fingerprint logic can be placed here or kept in the same handler */}
                    <div className="button-container">
                        <button onClick={handleUpdateFingerprint} className="bg-gray-800 text-white font-semibold py-2 mx-auto block px-4 rounded hover:bg-gray-700 transition duration-200"> Fingerprint</button>
                    </div>

                    {/* Back button for Add Fingerprint */}
                    {/* <div className="button-container">
                        <button onClick={handleBack} className="bg-gray-800 text-white font-semibold py-2 mx-auto block px-4 rounded hover:bg-gray-700 transition duration-200">Back</button>
                    </div> */}
                </div>
            )}


        </div>
    );
};

export default Registration;
