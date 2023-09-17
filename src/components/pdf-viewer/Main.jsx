import { helper } from "../../utils"

function Main({ pdfBase64 }) {
    const handleViewPDF = () => {
        // console.log(pdfBase64)
        const cleanedBase64 = pdfBase64.replace(/[^A-Za-z0-9+/=]/g, '');

        const blob = helper.base64ToBlob(cleanedBase64, 'application/pdf');
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, '_blank');
    };

    return (
        <div>
            <button className="btn btn-primary" onClick={handleViewPDF}>View Statute</button>
        </div>
    );
};

export default Main;
