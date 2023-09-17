import {
    Lucide,
    Tippy,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    Modal,
    ModalBody,
} from "@/base-components";
import classnames from "classnames";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectAllInstitutions, fetchInstitutions, deleteInstitution } from "../../features/institutions/institutionSlice"
import { selectAllCourses, fetchCourses } from "../../features/courses/courseSlice";
import Toastify from "toastify-js";



function Main() {
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const dispatch = useDispatch();
    const institutions = useSelector(selectAllInstitutions);
    const courses = useSelector(selectAllCourses);

    useEffect(() => {
        dispatch(fetchInstitutions());
        dispatch(fetchCourses());
    }, [dispatch]);

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
        dispatch(deleteInstitution(selectedId))
            .then((res) => {
                console.log(res)
                if (res.type === "institutions/deleteInstitution/fulfilled") {
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



    return (
        <>
            <h2 className="intro-y text-lg font-medium mt-10">Institutions List</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    <Link to="/add-institution">
                        <button className="btn btn-primary shadow-md mr-2">
                            Add New Institution
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

                                <th className="whitespace-nowrap">Institution</th>
                                <th className="whitespace-nowrap">Acronymn</th>
                                <th className="whitespace-nowrap">State</th>
                                <th className="text-center whitespace-nowrap">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {institutions.map((item) => (
                                <tr key={item._id} className="intro-x">

                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.institutionName}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.acronymn}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.state}
                                        </div>
                                    </td>


                                    <td className="table-report__action w-56">
                                        <div className="flex justify-center items-center">

                                            <Link className="flex items-center mr-3" to={`/edit-institution/${item._id}`}>
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
                    <nav className="w-full sm:w-auto sm:mr-auto">
                        <ul className="pagination">
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    <Lucide icon="ChevronLeft" className="w-4 h-4" />
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    ...
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    1
                                </a>
                            </li>
                            <li className="page-item active">
                                <a className="page-link" href="#">
                                    2
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    3
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    ...
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    <Lucide icon="ChevronRight" className="w-4 h-4" />
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    <Lucide icon="ChevronsRight" className="w-4 h-4" />
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <select className="w-20 form-select box mt-3 sm:mt-0">
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
        </>
    );
}

export default Main;