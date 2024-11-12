import React ,{ useState, useEffect }from 'react';
import { Link } from 'react-router-dom';
import { FaFemale, FaMale, FaWpforms, FaBan } from 'react-icons/fa';
import axios from 'axios';
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the dashboard data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3300/dashboard-data');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  if (loading) {
    return <div className='text-center'>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
 <div className="grid grid-cols-3 m-4">
    <div className='flex flex-col col-span-2 '>
      <div className="flex flex-row justify-evenly mb-2 ">
        <div className="w-full max-w-sm  p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <Link to="/getStudents">
            <h6 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{dashboardData.totalStudents}</h6>
            <h5 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white">Total Students</h5>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="" className="flex items-center">
              <FaFemale className="text-pink-300 w-6 h-6" />
              <p className="ml-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
                Girls : {dashboardData.totalGirls}
              </p>
            </Link>
            <div className="border-l-2 border-gray-300 mx-4 h-8" />
            <Link to="#" className="flex items-center">
              <FaMale className="text-blue-300 w-6 h-6" />
              <p className="ml-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
                Boys : {dashboardData.totalBoys}
              </p>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-sm  p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <Link to="/passes">
            <h6 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{dashboardData.totalPasses}</h6>
            <h5 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white">Total Passes</h5>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="#" className="flex items-center">
              <FaWpforms className="text-pink-300 w-6 h-6" />
              <p className="ml-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
                Pinkpass : {dashboardData.pinkPass}
              </p>
            </Link>
            <div className="border-l-2 border-gray-300 mx-4 h-8" />
            <Link to="#" className="flex items-center">
              <FaWpforms className="text-gray-400 w-6 h-6" />
              <p className="ml-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
                Outpass : {dashboardData.outPass}
              </p>
            </Link>
          </div>
        </div>
        </div>
        <div className="flex flex-row justify-evenly">
        <div className="w-full max-w-sm  p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <Link to="/present">
            <h6 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{dashboardData.present}</h6>
            <h5 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white">Present</h5>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="#" className="flex items-center">
              <FaFemale className="text-pink-300 w-6 h-6" />
              <p className="ml-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
                Girls : {dashboardData.presentGirls}
              </p>
            </Link>
            <div className="border-l-2 border-gray-300 mx-4 h-8" />
            <Link to="#" className="flex items-center">
              <FaMale className="text-blue-300 w-6 h-6" />
              <p className="ml-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
                Boys : {dashboardData.presentBoys}
              </p>
            </Link>
          </div>
        </div>
       
        <div className="w-full max-w-sm p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <Link to="/notpresent">
            <h6 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{dashboardData.notRet}</h6>
            <h5 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white">Yet to return</h5>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="#" className="flex items-center">
              <FaFemale className="text-pink-300 w-6 h-6" />
              <p className="ml-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
                Girls : {dashboardData.notRetGirls}
              </p>
            </Link>
            <div className="border-l-2 border-gray-300 mx-4 h-8" />
            <Link to="#" className="flex items-center">
              <FaMale className="text-blue-300 w-6 h-6" />
              <p className="ml-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
                Boys : {dashboardData. notRetBoys}
              </p>
            </Link>
          </div>
        </div>
       
      </div>
      </div>
      <div className="col-span-1  w-full  p-8  mr-4 mt-4 mb-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-4 text-xl text-center font-semibold tracking-tight text-gray-700 dark:text-white">Daily Report</h5>
        <div className="flex flex-row justify-evenly">
          <div>
            <h4 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white">Girls</h4>
            <p className="mt-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
              Pinkpass: 50
            </p>
            <p className="mt-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
              <div className="flex flex-row">
                Outpass: <FaBan className="text-gray-500 w-4 h-3 ml-1 mt-1" />
              </div>
            </p>
            <p className="mt-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
              CheckOut: 50
            </p>
            <p className="mt-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
              CheckIn: 50
            </p>
          </div>
          <div className="border-l-2 border-gray-300 mx-4 h-35" />

          <div>
            <h4 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white">Boys</h4>
            <p className="mt-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
              Pinkpass: 50
            </p>
            <p className="mt-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
              Outpass: 10
            </p>
            <p className="mt-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
              CheckOut: 50
            </p>
            <p className="mt-2 font-semibold text-gray-500 dark:text-white" style={{ fontSize: "13px" }}>
              CheckIn: 50
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
