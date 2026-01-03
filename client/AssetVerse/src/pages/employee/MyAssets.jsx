import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useState } from "react";
import toast from "react-hot-toast";

const MyAssets = () => {
    const axiosSecure = useAxiosSecure();
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");

    const { data: myAssets = [], refetch } = useQuery({
        queryKey: ['my-assets', search, filter],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/my-assets?search=${search}&type=${filter}`);
            return res.data;
        }
    });

    const handleReturn = async (id) => {
        if (!window.confirm("Are you sure you want to return this asset?")) return;
        try {
            await axiosSecure.patch(`/api/return-asset/${id}`);
            toast.success("Asset Returned Successfully");
            refetch();
        } catch (error) {
            console.error(error);
            toast.error("Return failed");
        }
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-4 md:p-10">
            <div className="flex justify-between items-center mb-6 print:hidden">
                <h2 className="text-3xl font-bold">My Assets</h2>
                <button onClick={handlePrint} className="btn btn-neutral">
                    Print Assets
                </button>
            </div>

            {/* Print Header (Only visible when printing) */}
            <div className="hidden print:block mb-6 text-center">
                <h1 className="text-2xl font-bold">AssetVerse - Employee Asset Report</h1>
                <p className="text-sm">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            <div className="flex gap-4 mb-6 print:hidden">
                <input
                    type="text"
                    placeholder="Search "
                    className="input input-bordered"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="select select-bordered" onChange={(e) => setFilter(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="Returnable">Returnable</option>
                    <option value="Non-returnable">Non-returnable</option>
                </select>
            </div>

            <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl border">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Asset Name</th>
                            <th>Type</th>
                            <th>Request Date</th>
                            <th>Approval Date</th>
                            <th>Status</th>
                            <th className="print:hidden">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myAssets.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">No assets found.</td></tr>
                        ) : (
                            myAssets.map(item => (
                                <tr key={item._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="text-sm font-bold">{item.assetName}</div>
                                            <div className="text-xs text-gray-500">{item.companyName}</div>
                                        </div>
                                    </td>
                                    <td>{item.assetType}</td>
                                    <td>{new Date(item.requestDate).toLocaleDateString()}</td>
                                    <td>{item.approvalDate ? new Date(item.approvalDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <div className="badge badge-success badge-outline">Approved</div>
                                    </td>
                                    <td className="print:hidden">
                                        {item.assetType === 'Returnable' && (
                                            <button
                                                onClick={() => handleReturn(item._id)}
                                                className="btn btn-sm btn-warning"
                                                disabled={item.requestStatus === 'returned'}
                                            >
                                                Return
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyAssets;
