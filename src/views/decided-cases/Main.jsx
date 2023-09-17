import {
    Lucide,
    Modal,
    ModalBody,
} from "@/base-components";
import classnames from "classnames";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectAllDecidedCases, fetchDecidedCases, deleteDecidedCase } from "../../features/decided-cases/decidedCasesSlice"
import Toastify from "toastify-js";



function Main() {
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const dispatch = useDispatch();
    const decidedCases = useSelector(selectAllDecidedCases);

    useEffect(() => {
        dispatch(fetchDecidedCases());
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
        dispatch(deleteDecidedCase(selectedId))
            .then((res) => {
                console.log(res)
                if (res.type === "decidedCases/deleteDecidedCase/fulfilled") {
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
            <h2 className="intro-y text-lg font-medium mt-10">Drafts List</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    <Link to="/add-decided-case">
                        <button className="btn btn-primary shadow-md mr-2">
                            Add New Decided Case
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

                                {/* <th className="whitespace-nowrap">Draft Topic</th> */}
                                <th className="whitespace-nowrap">Course</th>
                                {/* <th className="whitespace-nowrap">Week</th> */}
                                <th className="text-center whitespace-nowrap">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {decidedCases.map((item) => (
                                <tr key={item._id} className="intro-x">

                                    {/* <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.title}
                                        </div>
                                    </td> */}
                                    <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.courseName}
                                        </div>
                                    </td>
                                    {/* <td>
                                        <div className="font-medium whitespace-nowrap">
                                            {item.week}
                                        </div>
                                    </td> */}
                                    {/* <td className="w-40">
                                        <div className="flex">
                                            <div className="w-10 h-10 image-fit zoom-in">
                                                <Tippy
                                                    tag="img"
                                                    alt="Midone Tailwind HTML Admin Template"
                                                    className="rounded-full"
                                                    src={faker.images[0]}
                                                    content={`Uploaded at ${faker.dates[0]}`}
                                                />
                                            </div>
                                            <div className="w-10 h-10 image-fit zoom-in -ml-5">
                                                <Tippy
                                                    tag="img"
                                                    alt="Midone Tailwind HTML Admin Template"
                                                    className="rounded-full"
                                                    src={faker.images[1]}
                                                    content={`Uploaded at ${faker.dates[1]}`}
                                                />
                                            </div>
                                            <div className="w-10 h-10 image-fit zoom-in -ml-5">
                                                <Tippy
                                                    tag="img"
                                                    alt="Midone Tailwind HTML Admin Template"
                                                    className="rounded-full"
                                                    src={faker.images[2]}
                                                    content={`Uploaded at ${faker.dates[2]}`}
                                                />
                                            </div>
                                        </div>
                                    </td> */}

                                    <td className="table-report__action w-56">
                                        <div className="flex justify-center items-center">
                                            <a className="flex items-center mr-3" href="#">
                                                <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                                                Edit
                                            </a>
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