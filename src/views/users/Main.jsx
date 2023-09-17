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
    const [total_rows, setTotal_rows] = useState(0);
    const dispatch = useDispatch();
    const users = useSelector(selectAllUsers);
    const [headerFooterModalPreview, setHeaderFooterModalPreview] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers({ page, limit }))
            .then((response) => {
                // Assuming your API response includes the total number of pages
                setTotalPages(response.payload.pagination.total_pages);
                setTotal_rows(response.payload.pagination.total)
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

    const firstEntry = (page - 1) * limit + 1;
    const lastEntry = Math.min(page * limit, total_rows);

    const handleShowModalForDelete = (id) => {
        setDeleteConfirmationModal(true)
        setSelectedId(id)
    }

    const handleHideModalForDelete = () => {
        setDeleteConfirmationModal(false)
        setSelectedId('')
    }
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
                    {/* <Link to="/add-user">
                        <button className="btn btn-primary shadow-md mr-2">
                            Add New User
                        </button>
                    </Link> */}

                    <div className="hidden md:block mx-auto text-slate-500">
                        Showing {firstEntry} to {lastEntry} of {total_rows} entries
                    </div>
                    <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                        {/* <div className="w-56 relative text-slate-500">
                            <input
                                type="text"
                                className="form-control w-56 box pr-10"
                                placeholder="Search..."
                            />
                            <Lucide
                                icon="Search"
                                className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                            />
                        </div> */}
                        <Dropdown>
                            <DropdownToggle className="btn px-2 box">
                                <span className="w-32 h-5 flex items-center justify-center relative">
                                    <span className="pr-10">Create Filter</span>
                                    <Lucide
                                        icon="Search"
                                        className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                    />
                                </span>

                            </DropdownToggle>
                            <DropdownMenu className="inbox-filter__dropdown-menu pt-2">
                                <DropdownContent tag="div">
                                    <div className="grid grid-cols-12 gap-4 gap-y-3 p-3">
                                        <div className="col-span-6">
                                            <label
                                                htmlFor="input-filter-1"
                                                className="form-label text-xs"
                                            >
                                                Name
                                            </label>
                                            <input
                                                id="input-filter-1"
                                                type="text"
                                                className="form-control flex-1"
                                                placeholder="Type the Name"
                                            />
                                        </div>
                                        <div className="col-span-6">
                                            <label
                                                htmlFor="input-filter-2"
                                                className="form-label text-xs"
                                            >
                                                Email
                                            </label>
                                            <input
                                                id="input-filter-2"
                                                type="text"
                                                className="form-control flex-1"
                                                placeholder="example@gmail.com"
                                            />
                                        </div>
                                        <div className="col-span-6">
                                            <label
                                                htmlFor="input-filter-3"
                                                className="form-label text-xs"
                                            >
                                                Country
                                            </label>
                                            <select
                                                id="input-filter-4"
                                                className="form-select flex-1"
                                            >
                                                <option>--Select--</option>
                                                <option value="Ghana">Ghana</option>
                                                <option value="Nigeria">Nigeria</option>

                                            </select>
                                        </div>
                                        <div className="col-span-6">
                                            <label
                                                htmlFor="input-filter-4"
                                                className="form-label text-xs"
                                            >
                                                Status
                                            </label>
                                            <select
                                                id="input-filter-4"
                                                className="form-select flex-1"
                                            >
                                                <option>--Select--</option>
                                                <option value="PENDING">Pending</option>
                                                <option value="TIER_1_VERIFIED">Tier 1</option>
                                                <option value="TIER_2_VERIFIED">Tier 2</option>
                                                <option value="TIER_3_VERIFIED">Tier 3</option>
                                            </select>
                                        </div>
                                        <div className="col-span-12 flex items-center mt-3">

                                            <button className="btn btn-primary w-32 ml-2">
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </DropdownContent>
                            </DropdownMenu>
                        </Dropdown>
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
                            {users.data && users.data.map((item, nom) => (

                                <tr key={item.user_id} className="intro-x">

                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {(page - 1) * limit + nom + 1}
                                        </div>
                                    </td>
                                    <td onClick={() => {
                                        viewUser(item.user_id);
                                    }}>
                                        <div className="font-medium whitespace-nowrap text-primary cursor-pointer">
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
                    <div className="flex flex-wrap mb-1">
                        <div className="w-3/12">
                            <b>User Id:</b>
                        </div>
                        <div className="w-9/12">
                            {userDetail.user_id}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-3/12">
                            <b>Name:</b>
                        </div>
                        <div className="w-9/12">
                            {userDetail.name}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-3/12">
                            <b>Email:</b>
                        </div>
                        <div className="w-9/12">
                            {userDetail.email}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-3/12">
                            <b>Phone:</b>
                        </div>
                        <div className="w-9/12">
                            {userDetail.phone_number}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-3/12">
                            <b>Occupation:</b>
                        </div>
                        <div className="w-9/12">
                            {userDetail.occupation}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-3/12">
                            <b>Country:</b>
                        </div>
                        <div className="w-9/12">
                            {userDetail.country}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-3/12">
                            <b>Status:</b>
                        </div>
                        <div className="w-9/12">
                            {userDetail.status}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-3/12">
                            <b>Confirmed:</b>
                        </div>
                        <div className="w-9/12">
                            {userDetail.confirmed}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-3/12">
                            <b>Confirmation Time:</b>
                        </div>
                        <div className="w-9/12">
                            {userDetail.confirmed_at}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-3/12">
                            <b>Last Login:</b>
                        </div>
                        <div className="w-9/12">
                            {userDetail.last_login}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-3/12">
                            <b>Verified:</b>
                        </div>
                        <div className="w-9/12">
                            {`${userDetail.verified}`}
                        </div>
                    </div>

                    {/* <div className="flex">
                        <b><h4 className="mr-2"></h4></b>
                        <p></p>
                    </div> */}


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