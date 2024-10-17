import React, { useState } from 'react';
import './styles/StudentDetails.css';

function StudentDetails() {
    const [rollNo, setRollNo] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [monthout, setMonthout] = useState('');
    const [yearout, setYearout] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [filteredoutData, setFilteredOutData] = useState([]);
    const [error1, setError1] = useState('');

    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [outcurrentPage, setOutCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const fetchStudentDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3300/get-student-details/${rollNo}`);
            if (!response.ok) {
                throw new Error('User not found');
            }
            const data = await response.json();
            setStudentData(data);
            setError(''); // Clear any previous errors
            setFilteredData(data.gatepasses); 
            setFilteredOutData(data.outpasses);
        } catch (err) {
            setError(err.message);
            setStudentData(null); // Reset student data on error
        }
    };

   

    const fetchFilteredData = async () => {
        setError(null);
        if (!year) {
            alert('Please enter a year.');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3300/get-filtered-gatepasses/${rollNo}?month=${month}&year=${year}`);
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error fetching filtered gatepasses');
            }
    
            const data = await response.json();
            console.log('Filtered Data:', data); // Log the response type
    
            // Check if data is an array
            if (Array.isArray(data)) {
                setFilteredData(data);
            } else {
                setFilteredData([]); // Reset if not an array
            }
    
            setCurrentPage(1); // Reset to first page
        } catch (err) {
            setError(err.message);
            setFilteredData([]); // Reset filtered data on error
        }
    };
    const fetchFilteredDataOut = async () => {
        setError1(null);
        if (!yearout) {
            alert('Please enter a year.');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3300/get-filtered-outpasses/${rollNo}?month=${monthout}&year=${yearout}`);
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error fetching filtered outpasses');
            }
    
            const data = await response.json();
            console.log('Filtered Data:', data); // Log the response type
    
            // Check if data is an array
            if (Array.isArray(data)) {
                setFilteredOutData(data);
            } else {
                setFilteredOutData([]); // Reset if not an array
            }
    
            setCurrentPage(1); // Reset to first page
        } catch (err) {
            setError1(err.message);
            setFilteredOutData([]); // Reset filtered data on error
        }
    };
    

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (isoString) => {
        if (!isoString) return ''; // Return empty string if time is not available
        const time = new Date(isoString);
        return time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const handlePagination = (direction) => {
        if (direction === 'next') {
            setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredData.length / itemsPerPage)));
        } else {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
        }
    };

    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const handlePaginationout = (direction) => {
        if (direction === 'next') {
            setOutCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredoutData.length / itemsPerPage)));
        } else {
            setOutCurrentPage((prev) => Math.max(prev - 1, 1));
        }
    };

    const currentItemsout = filteredoutData.slice((outcurrentPage - 1) * itemsPerPage, outcurrentPage * itemsPerPage);
    
    return (
        <div className="form-container">
            <div className="form-grid1">
                <label htmlFor="rollNo">Enter Register ID:</label>
                <input
                    type="text"
                    id="rollNo"
                    placeholder="Enter Roll No"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                />
            </div>
            <div className="button-container1">
                <button className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-200" onClick={fetchStudentDetails}>Get Details</button>
            </div>

            {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}


            <div className="mb-4 flex flex-col items-center"> 
            
        </div>
            {studentData && (
                <> 
                {studentData.imageUrl ? (
                <img 
                    src={studentData.imageUrl} 
                    alt="Student" 
                    className=" h-48 w-48 object-cover rounded " 
                />
            ) : (
                <span>No image available</span>
            )}
                   <table className="w-full mt-4 bg-white shadow-md rounded">
  <thead>
    <tr>
      <th className="px-4 py-2 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Column</th>
      <th className="px-4 py-2 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Details</th>
    </tr>
  </thead>
  <tbody>
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">
        <strong>Name:</strong>
      </td>
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">{studentData.sname}</td>
    </tr>
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">
        <strong>Roll No:</strong>
      </td>
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">{studentData.studentId}</td>
    </tr>
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">
        <strong>Branch:</strong>
      </td>
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">{studentData.branch}</td>
    </tr>
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">
        <strong>Year:</strong>
      </td>
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">{studentData.syear}</td>
    </tr>
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">
        <strong>Parent Phone:</strong>
      </td>
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">{studentData.parentno}</td>
    </tr>
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">
        <strong>Hostel Name:</strong>
      </td>
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">{studentData.hostelblock}</td>
    </tr>
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">
        <strong>Room No:</strong>
      </td>
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">{studentData.roomno}</td>
    </tr>
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">
        <strong>Gatepass Count:</strong>
      </td>
      <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200">{studentData.gatepassCount}</td>
    </tr>
  </tbody>
</table>
                  
                    <div className="mt-5">
                    <hr className="border-t-2 border-gray-400 my-4" />

    <label htmlFor="month" className="mr-2">Month:</label>
    <input
        type="text"
        id="month"
        placeholder="(e.g., 01 for January)"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border border-gray-300 rounded p-2 mr-4"
    />
    <label htmlFor="year" className="mr-2">Year:</label>
    <input
        type="text"
        id="year"
        placeholder="e.g., 2024"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="border border-gray-300 rounded p-2 mr-4"
    />
    <button
        onClick={fetchFilteredData}
        className="bg-gray-600 text-white rounded p-2 hover:bg-gray-500"
    >
        Get Filtered Passes
    </button>
</div>

{error && <p className='text-center text-red-500 mt-5'>{error}</p>}

{filteredData.length > 0 && (
    <>
        <h2 className="text-xl font-bold mt-5 ">GatePass Details</h2>
        <table className="w-full border-collapse mt-2">
            <thead>
                <tr>
                    <th className="border border-gray-300 p-2 text-left font-bold">Date</th>
                    <th className="border border-gray-300 p-2 text-left font-bold">Out Time</th>
                    <th className="border border-gray-300 p-2 text-left font-bold">In Time</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map((gatepass, index) => (
                    gatepass.outTime ? (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">{formatDate(gatepass.date)}</td>
                            <td className="border border-gray-300 p-2">{formatTime(gatepass.outTime)}</td>
                            <td className="border border-gray-300 p-2">{formatTime(gatepass.inTime)}</td>
                        </tr>
                    ) : null
                ))}
            </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
            <button
                onClick={() => handlePagination('prev')}
                disabled={currentPage === 1}
                className={`bg-gray-300 text-gray-700 rounded p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
            >
                Previous
            </button>
            <span>{` Page ${currentPage} of ${Math.ceil(filteredData.length / itemsPerPage)} `}</span>
            <button
                onClick={() => handlePagination('next')}
                disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                className={`bg-gray-300 text-gray-700 rounded p-2 ${currentPage === Math.ceil(filteredData.length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
            >
                Next
            </button>
        </div>



        

    </>

)}




<div className="mt-5">
                    <hr className="border-t-2 border-gray-400 my-4" />

    <label htmlFor="monthout" className="mr-2">Month:</label>
    <input
        type="text"
        id="monthout"
        placeholder="(e.g., 01 for January)"
        value={monthout}
        onChange={(e) => setMonthout(e.target.value)}
        className="border border-gray-300 rounded p-2 mr-4"
    />
    <label htmlFor="yearout" className="mr-2">Year:</label>
    <input
        type="text"
        id="yearout"
        placeholder="e.g., 2024"
        value={yearout}
        onChange={(e) => setYearout(e.target.value)}
        className="border border-gray-300 rounded p-2 mr-4"
    />
    <button
        onClick={fetchFilteredDataOut}
        className="bg-gray-600 text-white rounded p-2 hover:bg-gray-500"
    >
        Get Filtered Passes
    </button>
</div>

{error1 && <p className='text-center text-red-500 mt-5'>{error1}</p>}

{filteredoutData.length > 0 && (
    <>
        <h2 className="text-xl font-bold mt-5 ">OutPass Details</h2>
        <table className="w-full border-collapse mt-2">
            <thead>
                <tr>
                    <th className="border border-gray-300 p-2 text-left font-bold">Date</th>
                    <th className="border border-gray-300 p-2 text-left font-bold">Out Time</th>
                    <th className="border border-gray-300 p-2 text-left font-bold">In Time</th>
                </tr>
            </thead>
            <tbody>
                {currentItemsout.map((outpass, index) => (
                    outpass.outTime ? (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">{formatDate(outpass.date)}</td>
                            <td className="border border-gray-300 p-2">{formatTime(outpass.outTime)}</td>
                            <td className="border border-gray-300 p-2">{formatTime(outpass.inTime)}</td>
                        </tr>
                    ) : null
                ))}
            </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
            <button
                onClick={() => handlePagination('prev')}
                disabled={outcurrentPage === 1}
                className={`bg-gray-300 text-gray-700 rounded p-2 ${outcurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
            >
                Previous
            </button>
            <span>{` Page ${outcurrentPage} of ${Math.ceil(filteredoutData.length / itemsPerPage)} `}</span>
            <button
                onClick={() => handlePagination('next')}
                disabled={outcurrentPage === Math.ceil(filteredoutData.length / itemsPerPage)}
                className={`bg-gray-300 text-gray-700 rounded p-2 ${outcurrentPage === Math.ceil(filteredoutData.length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
            >
                Next
            </button>
        </div>



        

    </>

)}


                </>
            )}
        </div>
    );
}

export default StudentDetails;
