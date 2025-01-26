import React, { useState, useMemo } from 'react';
import './App.css'
import {useTable, useGlobalFilter, useSortBy,usePagination} from 'react-table';
import axios from 'axios';


function App() {

  const [employees, setEmployees]= useState([]);
  const [employeesData, setEmployeesData] = useState({firstName: "", lastName: "", managerName: "", salary: ""});
  const [showCancle, setShowCancel]= useState(false);
  const [errMsg, setErrMsg]= useState("");
  const columns = useMemo(
    () => [
      { Header: "Employee ID", accessor: "empId" },
      { Header: "First Name", accessor: "firstName" },
      { Header: "Last Name", accessor: "lastName" },
      { Header: "Manager Name", accessor: "managerName" },
      { Header: "Salary", accessor: "salary" },
      {
        Header: "Edit",
        Cell: ({ row }) => (
          <button
            onClick={() => handleEdit(row.original)}
            className="!bg-gray-100 !text-gray-700 px-2 py-1 text-xs font-medium rounded hover:!bg-gray-200 active:!bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400 transition-all duration-200"
          >
            Edit
          </button>
        ),
      },
      {
        Header: "Delete",
        Cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.original.empId)}
            className="!bg-gray-100 !text-black-700 px-2 py-1 text-xs font-medium rounded hover:!bg-gray-200 active:!bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400 transition-all duration-200"
          >
            Delete
          </button>
        ),
      }
    ],
    []
  );

  const data = React.useMemo(() => employees, []);
  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setGlobalFilter, page, // Only the rows for the current page
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    setPageSize} = useTable({columns, data: employees, initialState: { pageSize: 5 } }, useGlobalFilter, useSortBy, usePagination);

    const { globalFilter, pageIndex, pageSize } = state;

  const getAllEmployees = ()=> {
    axios.get("http://localhost:8005/employees").then((res) => {
      console.log(res.data);
      setEmployees(res.data);
    })
  }

  const handleChange = (e) => {
    setEmployeesData({...employeesData, [e.target.name]:e.target.value})
    setErrMsg("");
  }

  const clearAll = () => {
    setEmployeesData({firstName: "", lastName: "", managerName: "", salary: ""})
    getAllEmployees();
  }

  const handleCancle = () => {
    setEmployeesData({firstName: "", lastName: "", managerName: "", salary: ""})
    setShowCancel(false);
  }

  const handleEdit = (employee) => {
    setEmployeesData(employee);
    setShowCancel(true);
  };

  const handleDelete = async(employeeId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Employee ID: ${employeeId}?`
    );
    if (confirmDelete) {
      await axios.delete(`http://localhost:8005/employees/${employeeId}`).then((res) => {
        console.log(res.data);
        setEmployees(res.data);
      })
      window.location.reload();
      // clearAll();
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    let errorMessage = "";
    if(!employeesData.firstName || ! employeesData.lastName || ! employeesData.managerName || ! employeesData.salary){
      errorMessage="All fields are required !!";
      setErrMsg(errorMessage);
    }
    if(errorMessage.length == 0 && employeesData.empId){
      await axios.patch(`http://localhost:8005/employees/${employeesData.empId}`, employeesData).then((res) => {
        console.log(res.data);
      })
    }else if(errorMessage.length == 0){
      await axios.post("http://localhost:8005/employees", employeesData).then((res) => {
        console.log(res.data);
      })
    }
    
    clearAll();
  }

  React.useEffect(() => {
    getAllEmployees();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
  <div className="w-full max-w-4xl px-8 py-12 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
      Employee Management System
    </h2>
    {errMsg && <span className='block mt-2 text-sm font-medium text-red-600' >{errMsg}</span>}
    <div className="border-b border-gray-900/10 pb-12">
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-900"
          >
            First name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={employeesData.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              className="block w-full rounded-md bg-gray-100 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-900"
          >
            Last name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={employeesData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              className="block w-full rounded-md bg-gray-100 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="managerName"
            className="block text-sm font-medium text-gray-900"
          >
            Manager Name
          </label>
          <div className="mt-2">
            <input
              id="managerName"
              name="managerName"
              type="managerName"
              value={employeesData.managerName}
              onChange={handleChange}
              autoComplete="managerName"
              className="block w-full rounded-md bg-gray-100 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-900"
          >
            Salary
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="salary"
              id="salary"
              value={employeesData.salary}
              onChange={handleChange}
              autoComplete="off"
              className="block w-full rounded-md bg-gray-100 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
    <div className="mt-6 flex items-center justify-end gap-x-2">
    <button
        type="submit"
        onClick={handleSubmit}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600"
      >
        {employeesData.empId ? "Update" : "Add"}
      </button>
      <button
        type="button"
        onClick={handleCancle}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        disabled={!showCancle}
      >
        Cancel
      </button>
     
    </div>

    {/* Search Bar */}
    <div className="mt-8 p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
  <label
    htmlFor="search"
    className="block text-sm font-medium text-gray-900 mb-2"
  >
    Search Employee
  </label>
  <div>
    <input
      type="text"
      id="search"
      placeholder="Search..."
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value)}
      className="block w-full rounded-md bg-white px-4 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
    />
  </div>

  {/* Table */}
  <div className="mt-6 overflow-auto">
    <table {...getTableProps()} className="w-full border-collapse border border-gray-300">
    <thead className="bg-gray-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-900"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ⬇️"
                          : " ⬆️"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()} key={row.id}
                  className="odd:bg-white even:bg-gray-50"
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()} key={cell.id}
                      className="border border-gray-300 px-4 py-2 text-sm text-gray-700"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
    </table>
  </div>

    <div className="flex items-center justify-between mt-4">
        <div className='mt-6 flex items-center justify-end gap-x-2'>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div>
          <span className="text-sm text-gray-700">
            Page <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>
          </span>
        </div>
        <div>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
</div>
  </div>
</div>
  )
}

export default App
