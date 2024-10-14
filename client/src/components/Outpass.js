import React, { useState } from 'react';
import './styles/Pass.css'; // Ensure you import the CSS file for styling
import jsPDF from 'jspdf';
import axios from 'axios';

const Outpass = () => {
  const [rollNo, setRollNo] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [error1, setError1] = useState('');

  const [fingerprintData, setFingerprintData] = useState(null);

  // Function to verify and fetch full data for Pink Pass
  const handleVerifyPinkPass = async () => {
    setFingerprintData(null);
    setError1(null);
    if (rollNo.trim() === '') {
      setError('Please enter a valid Roll Number.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3300/verify-roll-outpass/${rollNo}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setError(''); // Clear error

        // After fetching user data, update the gatepass table
        await updateGatepass(rollNo,data.parentno);
      } else if (response.status === 404) {
        setError('User not found');
        setUserData(null);
      } else {
        setError('Error fetching user data');
        setUserData(null);
      }
    } catch (err) {
      console.log(err);
      setError('Server error');
      setUserData(null);
    }
  };

  // Function to update gate pass with current date and time
  const updateGatepass = async (rollNo, parentWhatsAppNumber) => {
    try {
      const response = await fetch(`http://localhost:3300/update-outpass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roll_no: rollNo }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        setError1(data.message);
        console.error('Error updating out pass:', data.message);
      } else {
        console.log('Gate pass updated successfully.');
  
        // Send a WhatsApp message to the parent
        // await sendWhatsAppMessage(parentWhatsAppNumber, 'The MSG SENT successfully.');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };
  // const sendWhatsAppMessage = async (phoneNumber, message) => {
  //   try {
  //     const response = await fetch('http://localhost:3300/send-whatsapp', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ phoneNumber, message }),
  //     });
  
  //     const data = await response.json();
  //     if (!response.ok) {
  //       console.error('Error sending WhatsApp message:', data);
  //     } else {
  //       console.log('WhatsApp message sent successfully.');
  //     }
  //   } catch (err) {
  //     console.error('Error sending WhatsApp message:', err);
  //   }
  // };
  
  
  // Function to generate Pink Pass PDF
  const generatePinkPassPDF = () => {
    if (userData) {
      const doc = new jsPDF();
      doc.setFontSize(10);
      doc.setFontSize(16);
      doc.text('GMR VARALAKSHMI FOUNDATION', 60, 20);
      doc.setFontSize(12);
      doc.text('REQUISITION FOR PERMISSION TO LEAVE THE HOSTEL', 50, 28);
      doc.text('GMR Nagar, RAJAM-532 127', 80, 36);
      doc.text('No: ', 160, 36); // Template No field (blank)
      doc.rect(15, 10, 180, 30);

      // Student Information Section
      doc.setFontSize(10);
      doc.text('1. Name of the Student:', 20, 50);
      doc.text(userData.sname || '', 70, 50);
      doc.text('2. JNTU Registration No:', 20, 60);
      doc.text(userData.studentId || '', 70, 60);
      doc.text('3. Branch & Year of Study:', 20, 70);
      doc.text(`${userData.branch} & ${userData.year}` || '', 70, 70);
      doc.text('4. Name of the Hostel:', 20, 80);
      doc.text(userData.hostelblock || '', 70, 80);
      doc.text('5. Room No:', 20, 90);
      doc.text(userData.roomno || '', 70, 90);
      doc.text('6. Whether on request from the Parent on Emergency:', 20, 100);

      doc.rect(15, 45, 180, 60); // Student Information Section border


      // sendSMS(userData.parentno, `Pink Pass generated for ${userData.sname}`);
      const fileName = `${userData.studentId}_PinkPass.pdf`;
      doc.save(fileName);
    } else {
      alert("No user data to generate the Pink Pass.");
    }
  };
  const generatePinkPassPDF1 = () => {
    if (fingerprintData) {
      const doc = new jsPDF();
      doc.setFontSize(10);
      doc.setFontSize(16);
      doc.text('GMR VARALAKSHMI FOUNDATION', 60, 20);
      doc.setFontSize(12);
      doc.text('REQUISITION FOR PERMISSION TO LEAVE THE HOSTEL', 50, 28);
      doc.text('GMR Nagar, RAJAM-532 127', 80, 36);
      doc.text('No: ', 160, 36); // Template No field (blank)
      doc.rect(15, 10, 180, 30);

      // Student Information Section
      doc.setFontSize(10);
      doc.text('1. Name of the Student:', 20, 50);
      doc.text(fingerprintData.sname || '', 70, 50);
      doc.text('2. JNTU Registration No:', 20, 60);
      doc.text(fingerprintData.studentId || '', 70, 60);
      doc.text('3. Branch & Year of Study:', 20, 70);
      doc.text(`${fingerprintData.branch} & ${fingerprintData.year}` || '', 70, 70);
      doc.text('4. Name of the Hostel:', 20, 80);
      doc.text(fingerprintData.hostelblock || '', 70, 80);
      doc.text('5. Room No:', 20, 90);
      doc.text(fingerprintData.roomno || '', 70, 90);
      doc.text('6. Whether on request from the Parent on Emergency:', 20, 100);

      doc.rect(15, 45, 180, 60); // Student Information Section border


      // sendSMS(userData.parentno, `Pink Pass generated for ${userData.sname}`);
      const fileName = `${fingerprintData.studentId}_PinkPass.pdf`;
      doc.save(fileName);
    } else {
      alert("No user data to generate the Pink Pass.");
    }
  };
  const sendSMS = (toNumber, message) => {
    // Make a POST request to the server to send the SMS
    axios.post('/send-sms', { toNumber, message })
      .then(response => {
        console.log('SMS sent successfully!');
      })
      .catch(error => {
        console.error('Error sending SMS:', error);
      });
  };
  // Function to generate Outpass PDF
  const generateOutpassPDF = () => {
    if (userData) {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Outpass', 90, 20);
      doc.setFontSize(12);
      doc.text('Name:', 20, 40);
      doc.text(userData.sname || '', 60, 40);
      doc.text('Roll No:', 20, 50);
      doc.text(userData.studentId || '', 60, 50);
      doc.text('Branch:', 20, 60);
      doc.text(userData.branch || '', 60, 60);
      doc.text('Room No:', 20, 70);
      doc.text(userData.roomno || '', 60, 70);
      doc.text('Purpose:', 20, 80); // Leave blank for user to fill
      doc.text('Signature:', 20, 90); // Leave blank for user to sign

      const fileName = `${userData.studentId}_Outpass.pdf`;
      doc.save(fileName);
    } else {
      alert("No user data to generate the Outpass.");
    }
  };
  const generateOutpassPDF1 = () => {
    if (fingerprintData) {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Outpass', 90, 20);
      doc.setFontSize(12);
      doc.text('Name:', 20, 40);
      doc.text(fingerprintData.sname || '', 60, 40);
      doc.text('Roll No:', 20, 50);
      doc.text(fingerprintData.studentId || '', 60, 50);
      doc.text('Branch:', 20, 60);
      doc.text(fingerprintData.branch || '', 60, 60);
      doc.text('Room No:', 20, 70);
      doc.text(fingerprintData.roomno || '', 60, 70);
      doc.text('Purpose:', 20, 80); // Leave blank for user to fill
      doc.text('Signature:', 20, 90); // Leave blank for user to sign

      const fileName = `${fingerprintData.studentId}_Outpass.pdf`;
      doc.save(fileName);
    } else {
      alert("No user data to generate the Outpass.");
    }
  };


  const handleVerifyFingerprint = async () => {
    setUserData(null);
    try {
        const response = await axios.post('http://localhost:3300/run-jar-verify');
        const data = response.data;

        // Assuming data is the student object now
        if (data && Object.keys(data).length > 0) {
            setFingerprintData(data); // Set the entire student data
            await updateGatepass(data.studentId); // Use data.studentId
        } else {
            alert("No user found.");
        }
    } catch (error) {
        console.error('Error running JAR:', error);
        // alert('Error occurred while adding fingerprint.');
    }
};

  return (
    <div className="p-5">
      <h1 className="text-center text-2xl font-bold">OutPass Generation</h1>
      {/* <p className="text-center">Welcome to the Gate Pass Generation system.</p> */}
      
      <div className="button-container text-center mb-5">
        <button className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200" onClick={handleVerifyFingerprint}>
          Verify Fingerprint
        </button>
        <button className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200 ml-2" onClick={handleVerifyPinkPass}>
          Verify Roll Number
        </button>
      </div>

      <input 
        type="text" 
        value={rollNo} 
        onChange={(e) => setRollNo(e.target.value)} 
        placeholder="Enter Roll Number" 
        className="border rounded w-1/3 px-3 py-2 mx-auto mb-4 block"
      />

      {fingerprintData && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3>Student Data</h3>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Student ID</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Year</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Branch</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Hostel Block</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Room No</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Parent No</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Fee Due</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>{fingerprintData.studentId}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{fingerprintData.sname}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{fingerprintData.syear}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{fingerprintData.branch}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{fingerprintData.hostelblock}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{fingerprintData.roomno}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{fingerprintData.parentno}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{fingerprintData.feeDue}</td>
              </tr>
            </tbody>
          </table>
          <br />
          {/* <div style={{ margin: '20px 0' }}>
            <strong>Outing Count for Current Month: {fingerprintData.gatepassCount}</strong>
            {fingerprintData.gatepassCount > 4 && (
                <button className="bg-gray-500 text-white font-semibold py-2 ml-4 px-4 rounded hover:bg-gray-700 transition duration-200">
                    Get Permission
                </button>
            )}
        </div> */}
          {/* <button className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-200 " onClick={generatePinkPassPDF1}>
            Print Pink Pass
          </button> */}
          <button className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-200 ml-2" onClick={generateOutpassPDF1}>
            Print Outpass
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {userData && (!error1) && (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h3>Student Data</h3>
        <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Student ID</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Year</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Branch</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Hostel Block</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Room No</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Parent No</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Fee Due</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{userData.studentId}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{userData.sname}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{userData.syear}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{userData.branch}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{userData.hostelblock}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{userData.roomno}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{userData.parentno}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{userData.feeDue}</td>
                </tr>
            </tbody>
        </table>
        <br />
        
        {/* Display Gatepass Count */}
        {/* <div style={{ margin: '20px 0' }}>
            <strong>Outing Count for Current Month: {userData.gatepassCount}</strong>
            {userData.gatepassCount > 4 && (
                <button className="bg-gray-500 text-white font-semibold py-2 ml-4 px-4 rounded hover:bg-gray-700 transition duration-200">
                    Get Permission
                </button>
            )}
        </div> */}

        {/* Print Buttons */}
        {/* <button className=" bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-200" onClick={generatePinkPassPDF}>
            Print Pink Pass
        </button> */}
        <button className=" bg-gray-800 text-white font-semibold py-2 ml-3 px-4 rounded hover:bg-gray-700 transition duration-200" onClick={generateOutpassPDF}>
            Print Outpass
        </button>
    </div>
)}
      {error1 && <p style={{ color: 'red', textAlign: 'center' }}>{error1}</p>}

    </div>
  );
};

export default Outpass;
