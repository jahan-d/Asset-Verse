import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useState } from "react";
import toast from "react-hot-toast";

const RequestAsset = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState("");
    const [selectedAsset, setSelectedAsset] = useState(null);

    const { data: assets = [], isLoading } = useQuery({
        queryKey: ['request-assets', search],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/assets?search=${search}&available=true`);
            const data = Array.isArray(res.data) ? res.data : [];
            return data.filter(a => a.availableQuantity > 0);
        }
    });

    const handleRequest = async (e) => {
        e.preventDefault();
        const note = e.target.note.value;

        try {
            await axiosSecure.post('/api/requests', {
                assetId: selectedAsset._id,
                assetName: selectedAsset.productName,
                assetType: selectedAsset.productType,
                assetImage: selectedAsset.productImage,
                companyName: selectedAsset.companyName || "Unknown Company", // Should be in asset record
                hrEmail: selectedAsset.hrEmail,
                note
            });
            toast.success("Request Sent Successfully!");
            setSelectedAsset(null); // Close modal
            document.getElementById('request_modal').close();
        } catch (error) {
            console.error(error);
            toast.error("Failed to send request");
        }
    }

    return (
        <div className="p-4 md:p-10">
            <h2 className="text-3xl font-bold mb-6">Request Assets</h2>

            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search for items..."
                    className="input input-bordered w-full max-w-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="text-center"><span className="loading loading-bars loading-lg"></span></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {(Array.isArray(assets) ? assets : []).map(asset => (
                        <div key={asset._id} className="card bg-base-100 shadow-xl border">
                            <figure className="px-4 pt-4">
                                <img src={asset.productImage} alt={asset.productName} className="rounded-xl h-48 object-cover w-full" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{asset.productName}</h2>
                                <p className="text-sm text-gray-500">Type: {asset.productType}</p>
                                <p className="text-sm">Available: {asset.availableQuantity}</p>
                                <div className="card-actions justify-end">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            setSelectedAsset(asset);
                                            document.getElementById('request_modal').showModal();
                                        }}
                                    >
                                        Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <dialog id="request_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Request {selectedAsset?.productName}</h3>
                    <p className="py-2 text-sm text-gray-500">Please include any specific notes for the HR manager.</p>
                    <form onSubmit={handleRequest} method="dialog">
                        <textarea
                            name="note"
                            className="textarea textarea-bordered w-full my-4"
                            placeholder="Additional notes..."
                        ></textarea>
                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => document.getElementById('request_modal').close()}
                            >
                                Cancel
                            </button>
                            <button className="btn btn-primary text-white">Send Request</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default RequestAsset;
