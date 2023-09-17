import {
    Lucide,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    Modal,
    ModalBody,
} from "@/base-components";
import Toastify from "toastify-js";
import classnames from "classnames";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAllAds, fetchAds, deleteAd } from "../../features/ads/adSlice";

function Main() {
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [data, setData] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const dispatch = useDispatch();
    const ads = useSelector(selectAllAds);

    useEffect(() => {
        dispatch(fetchAds())
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
        dispatch(deleteAd(selectedId))
            .then((res) => {
                console.log(res)
                if (res.type === "ads/deleteAd/fulfilled") {
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
            <h2 className="intro-y text-lg font-medium mt-10">Ads</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    <Link to="/add-ad">
                        <button className="btn btn-primary shadow-md mr-2">
                            Add New Ad
                        </button>
                    </Link>
                </div>
                {/* BEGIN: Users Layout */}
                {ads.length > 0 ? ads.map((itm) => (
                    <div
                        key={itm._id}
                        className="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
                    >
                        <div className="box">
                            <div className="p-5">
                                <div className="h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                    <img
                                        alt={itm.adTitle}
                                        className="rounded-md"
                                        src={itm.backgroundImages[0].image}
                                    />

                                    <div className="absolute bottom-0 text-white px-5 pb-6 z-10">
                                        <a href={itm.backgroundImages[0].link} target="_blank" className="block font-medium text-base">
                                            {itm.adTitle}
                                        </a>

                                    </div>
                                </div>
                                {/* <div className="text-slate-600 dark:text-slate-500 mt-5">
                  <div className="flex items-center">
                    <Lucide icon="Link" className="w-4 h-4 mr-2" /> Price: $
                    {faker.totals[0]}
                  </div>
                  
                </div> */}
                            </div>
                            <div className="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                <a className="flex items-center text-primary mr-auto" href="#">
                                    <Lucide icon="Eye" className="w-4 h-4 mr-1" /> Preview
                                </a>
                                <Link className="flex items-center mr-3" to={`/edit-ad/${itm._id}`}>
                                    {/* <a className=""> */}

                                    <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" /> Edit
                                    {/* </a> */}
                                </Link>
                                <a
                                    className="flex items-center text-danger"
                                    href="#"
                                    onClick={() => { handleShowModalForDelete(itm._id) }}
                                >
                                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                                </a>
                            </div>
                        </div>
                    </div>
                )) : (<div className="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 text-danger"><p>No ads available</p></div>)}
                {/* END: Users Layout */}
                {/* BEGIN: Success Notification Content */}
                <div
                    id="success-notification-content"
                    className="toastify-content hidden flex"
                >
                    <Lucide icon="CheckCircle" className="text-success" />
                    <div className="ml-4 mr-4">
                        <div className="font-medium">Success!</div>
                        <div className="text-slate-500 mt-1">
                            Ad has been deleted successfully!
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
                        <div className="font-medium">Ad delete failed!</div>
                        <div className="text-slate-500 mt-1">
                            Error Occured
                        </div>
                    </div>
                </div>
                {/* END: Failed Notification Content */}

            </div>
            {/* BEGIN: Delete Confirmation Modal */}
            <Modal
                show={deleteConfirmationModal}
                onHidden={handleHideModalForDelete}>
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
                        <button type="button" onClick={handleDelete} className="btn btn-danger w-24">
                            Delete
                        </button>
                    </div>
                </ModalBody>
            </Modal>
            {/* END: Delete Confirmation Modal */}
        </>
    );
}

export default Main;
