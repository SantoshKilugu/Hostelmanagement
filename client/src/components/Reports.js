import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios for API calls
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight ,faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import '../components/styles/Registration.css';

function Reports() {
    const [gatepassData, setGatepassData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportTime, setReportTime] = useState('');
    const [fromDate, setFromDate] = useState(''); // State for "from" date
    const [toDate, setToDate] = useState(''); // State for "to" date
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const rowsPerPage = 10; // Rows per page

    // Function to handle the filter button click
    const handleFilter = () => {
        if (fromDate && toDate) {
            fetchData(); // Fetch data only if both dates are provided
        } else {
            alert("Please select both 'From' and 'To' dates.");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3300/current-gatepass-report-filtered', {
                params: { from: fromDate, to: toDate } // Send date range as params
            });
            setGatepassData(response.data);
            setCurrentPage(1); // Reset to first page on new data fetch
        } catch (error) {
            console.error('Error fetching gatepass data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3300/current-gatepass-report'); // Adjust API endpoint
                setGatepassData(response.data);
            } catch (error) {
                console.error('Error fetching gatepass data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to download the current transactions
    const handleDownload = async () => {
        try {
            const response = await axios.get('http://localhost:3300/download-current-gatepass-report', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'CurrentGatepassData.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    // Function to save the report time
    const handleSaveTime = async () => {
        try {
            await axios.post('http://localhost:3300/save-report-time', { time: reportTime }); // Adjust API endpoint
            alert('Report time saved successfully!');
        } catch (error) {
            console.error('Error saving report time:', error);
        }
    };

    //report
    const handleSendReport = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:3300/send-report', { fromDate, toDate });
            alert('Report sent successfully!');
        } catch (error) {
            console.error('Error sending report:', error);
        } finally {
            setLoading(false);
        }
    };


    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = gatepassData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(gatepassData.length / rowsPerPage);

    return (
        <div>
            <h1 className="text-center font-bold text-gray-800 mb-4 mt-4">Current Gatepass Report</h1>
            <div className="flex justify-center mb-4 ml-56 mr-56">
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="mr-2"
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="mr-2"
                />
                <button
                    className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200"
                    onClick={handleFilter}
                >
                    Filter
                </button>
                <button
                    className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200 ml-2"
                    onClick={handleSendReport}
                >
                    <FontAwesomeIcon icon={faPaperPlane} /> Send Report
                </button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Roll No</th>
                            <th>Year</th>
                            <th>Branch</th>
                            <th>Hostel Block Name</th>
                            <th>Room No</th>
                            <th>Parent No</th>
                            <th>Out Time</th>
                            <th>In Time</th>
                            <th>Date</th>
                            <th>Fine</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row, index) => (
                            <tr key={index}>
                                <td>{row.sname}</td>
                                <td>{row.studentId}</td>
                                <td>{row.syear}</td>
                                <td>{row.branch}</td>
                                <td>{row.hostelblock}</td>
                                <td>{row.roomno}</td>
                                <td>{row.parentno}</td>
                                <td>{row.outTime}</td>
                                <td>{row.inTime}</td>
                                <td>{row.date}</td>
                                <td>{row.fine}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="flex justify-between mt-4">
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={` text-dark font-bold py-2 px-3 rounded shadow-md hover:bg-gray-300 transition duration-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={` font-bold py-2 px-3 rounded shadow-md hover:bg-gray-300 transition duration-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
            <div className="flex items-center justify-between mt-4">
                <button className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200" onClick={handleDownload}>
                    Download Current Report
                </button>

                <div className="flex items-center">
                    <input
                        type="time"
                        value={reportTime}
                        onChange={(e) => setReportTime(e.target.value)}
                        className="mr-2 w-30 bg-transparent outline-none" // Adjust width as needed
                    />
                    <button className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200" onClick={handleSaveTime}>
                        Save Time
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Reports;
