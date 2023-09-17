import {
    Lucide,
    Tippy,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TinySlider,
} from "@/base-components";
import classnames from "classnames";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectAllUsers, fetchUsers, deleteUser } from "../../features/users/usersSlice"
import Toastify from "toastify-js";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


function Main() {
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [userDetail, setUserDetail] = useState({
        confirm_code_sent_at: '',
        confirmed: '',
        confirmed_at: '',
        country: '',
        created_at: '',
        deleted_at: '',
        email: '',
        last_login: '',
        last_login_attempt: '',
        login_attempts: '',
        name: '',
        phone_number: '',
        status: '',
        updated_at: '',
        user_id: '',
        verified: '',
        occupation: ''
    }
    );
    const [page, setPage] = useState(1); // Current page
    const [limit, setLimit] = useState(10); // Items per page
    const [totalPages, setTotalPages] = useState(0); // Total number of pages
    const dispatch = useDispatch();
    const users = useSelector(selectAllUsers);
    const [headerFooterModalPreview, setHeaderFooterModalPreview] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers({ page, limit }))
            .then((response) => {
                // Assuming your API response includes the total number of pages
                setTotalPages(response.payload.pagination.total_pages);
                console.log(response.payload.pagination.totalPages)
            })
            .catch((error) => {
                // Handle error if needed
            });
    }, [dispatch, page, limit]);
    // }, [dispatch]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleLimitChange = (event) => {
        const newLimit = event.target.value;
        setLimit(newLimit);
        setPage(1); // Reset to the first page when the limit changes
    };

    const handleShowModalForDelete = (id) => {
        setDeleteConfirmationModal(true)
        setSelectedId(id)
    }

    const handleHideModalForDelete = () => {
        setDeleteConfirmationModal(false)
        setSelectedId('')
    }
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to the first page when searching
    };
    const filteredData = users.data && users.data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData && filteredData.slice(startIndex, endIndex);

    const handleDelete = () => {
        setDeleteConfirmationModal(false)
        dispatch(deleteUser(selectedId))
            .then((res) => {
                console.log(res)
                if (res.type === "users/deleteUser/fulfilled") {
                    Toastify({
                        node: dom("#success-notification-content")
                            .clone()
                            .removeClass("hidden")[0],
                        duration: 10000,
                        newWindow: true,
                        close: true,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                    }).showToast();
                } else {
                    Toastify({
                        node: dom("#failed-notification-content")
                            .clone()
                            .removeClass("hidden")[0],
                        duration: 10000,
                        newWindow: true,
                        close: true,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                    }).showToast();
                }
            })
    }

    const viewUser = (id) => {
        const singleUser = users.data.find(obj => obj.user_id === id);
        const { confirm_code_sent_at,
            confirmed,
            confirmed_at,
            country,
            created_at,
            deleted_at,
            email,
            last_login,
            last_login_attempt,
            login_attempts,
            name,
            phone_number,
            status,
            updated_at,
            user_id,
            verified,
            occupation,
        } = singleUser
        setUserDetail({
            confirm_code_sent_at,
            confirmed,
            confirmed_at,
            country,
            created_at,
            deleted_at,
            email,
            last_login,
            last_login_attempt,
            login_attempts,
            name,
            phone_number,
            status,
            updated_at,
            user_id,
            verified,
            occupation,
        })
        setHeaderFooterModalPreview(true)
    }



    return (
        <>
            <h2 className="intro-y text-lg font-medium mt-10">Users List</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    <Link to="/add-user">
                        <button className="btn btn-primary shadow-md mr-2">
                            Add New User
                        </button>
                    </Link>

                    <div className="hidden md:block mx-auto text-slate-500">
                        Showing 1 to 10 of 150 entries
                    </div>
                    <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                        <div className="w-56 relative text-slate-500">
                            <input
                                type="text"
                                className="form-control w-56 box pr-10"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <Lucide
                                icon="Search"
                                className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                            />
                        </div>
                    </div>
                </div>
                {/* BEGIN: Data List -*/}
                <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                    <table className="table table-report -mt-2">
                        <thead>
                            <tr>

                                <th className="whitespace-nowrap">S/N</th>
                                <th className="whitespace-nowrap">Name</th>
                                <th className="whitespace-nowrap">Email</th>
                                <th className="whitespace-nowrap">Phone Number</th>
                                <th className="whitespace-nowrap">Occupation</th>
                                <th className="whitespace-nowrap">Country</th>
                                <th className="whitespace-nowrap">Status</th>
                                <th className="text-center whitespace-nowrap">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData && paginatedData.map((item, nom) => (

                                <tr onClick={() => {
                                    viewUser(item.user_id);
                                }} key={item.user_id} className="intro-x">

                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {(page - 1) * limit + nom + 1}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.name}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.email}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.phone_number}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.occupation}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.country}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.status}
                                        </div>
                                    </td>


                                    <td className="table-report__action w-56">
                                        <div className="flex justify-center items-center">

                                            <Link className="flex items-center mr-3" to={`/edit-user/${item._id}`}>
                                                <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" /> Edit
                                            </Link>
                                            <a
                                                className="flex items-center text-danger"
                                                href="#"
                                                onClick={() => { handleShowModalForDelete(item._id) }}
                                            >
                                                <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                                            </a>
                                        </div>
                                    </td>
                                </tr>


                            ))}
                        </tbody>
                    </table>
                </div>
                {/* END: Data List -*/}
                {/* BEGIN: Pagination -*/}
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                    <Stack>
                        <Pagination
                            count={totalPages}
                            // count={Math.ceil(filteredData && filteredData.length / limit)}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Stack>
                    <select className="w-20 form-select box mt-3 sm:mt-0" onChange={handleLimitChange}>
                        <option>10</option>
                        <option>25</option>
                        <option>35</option>
                        <option>50</option>
                    </select>

                </div>
                {/* END: Pagination -*/}
                {/* BEGIN: Success Notification Content */}
                <div
                    id="success-notification-content"
                    className="toastify-content hidden flex"
                >
                    <Lucide icon="CheckCircle" className="text-success" />
                    <div className="ml-4 mr-4">
                        <div className="font-medium">Success!</div>
                        <div className="text-slate-500 mt-1">
                            Statute has been deleted successfully!
                        </div>
                    </div>
                </div>
                {/* END: Success Notification Content */}
                {/* BEGIN: Failed Notification Content */}
                <div
                    id="failed-notification-content"
                    className="toastify-content hidden flex"
                >
                    <Lucide icon="XCircle" className="text-danger" />
                    <div className="ml-4 mr-4">
                        <div className="font-medium">Statute delete failed!</div>
                        <div className="text-slate-500 mt-1">
                            Error Occured
                        </div>
                    </div>
                </div>
                {/* END: Failed Notification Content */}
            </div>
            {/* BEGIN: Delete Confirmation Modal -*/}
            <Modal
                show={deleteConfirmationModal}
                onHidden={handleHideModalForDelete}
            >
                <ModalBody className="p-0">
                    <div className="p-5 text-center">
                        <Lucide
                            icon="XCircle"
                            className="w-16 h-16 text-danger mx-auto mt-3"
                        />
                        <div className="text-3xl mt-5">Are you sure?</div>
                        <div className="text-slate-500 mt-2">
                            Do you really want to delete these records? <br />
                            This process cannot be undone.
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <button
                            type="button"
                            onClick={handleHideModalForDelete}
                            className="btn btn-outline-secondary w-24 mr-1"
                        >
                            Cancel
                        </button>
                        <button type="button" className="btn btn-danger w-24" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </ModalBody>
            </Modal>
            {/* END: Delete Confirmation Modal -*/}
            <Modal
                show={headerFooterModalPreview}
                onHidden={() => {
                    setHeaderFooterModalPreview(false);
                }}
            >
                <ModalHeader>
                    <h2 className="font-medium text-base mr-auto">
                        User Detail
                    </h2>
                </ModalHeader>

                <ModalBody>
                    <div className="flex">
                        <b><h4 className="mr-2">User Id:</h4></b>
                        <p>{userDetail.user_id}</p>
                    </div>
                    <div className="flex">
                        <b><h4 className="mr-2">Name:</h4></b>
                        <p>{userDetail.name}</p>
                    </div>
                    <div className="flex">
                        <b><h4 className="mr-2">Email:</h4></b>
                        <p>{userDetail.email}</p>
                    </div>
                    <div className="flex">
                        <b><h4 className="mr-2">Phone:</h4></b>
                        <p>{userDetail.phone_number}</p>
                    </div>
                    <div className="flex">
                        <b><h4 className="mr-2">Occupation:</h4></b>
                        <p>{userDetail.occupation}</p>
                    </div>
                    <div className="flex">
                        <b><h4 className="mr-2">Country:</h4></b>
                        <p>{userDetail.country}</p>
                    </div>
                    <div className="flex">
                        <b><h4 className="mr-2">Status:</h4></b>
                        <p>{userDetail.status}</p>
                    </div>
                    <div className="flex">
                        <b><h4 className="mr-2">Confirmed:</h4></b>
                        <p>{userDetail.confirmed}</p>
                    </div>
                    <div className="flex">
                        <b><h4 className="mr-2">Confirmation Time:</h4></b>
                        <p>{userDetail.confirmed_at}</p>
                    </div>
                    <div className="flex">
                        <b><h4 className="mr-2">Last Login:</h4></b>
                        <p>{userDetail.last_login}</p>
                    </div>
                    <div className="flex">
                        <b><h4 className="mr-2">Verified:</h4></b>
                        <p>{`${userDetail.verified}`}</p>
                    </div>
                    {/* <div> */}
                    {/* </div> */}


                </ModalBody>
                <ModalFooter>
                    <button
                        type="button"
                        onClick={() => {
                            setHeaderFooterModalPreview(false);
                        }}
                        className="btn btn-outline-secondary w-20 mr-1"
                    >
                        Close
                    </button>

                </ModalFooter>
            </Modal>
        </>
    );
}

export default Main;