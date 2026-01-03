import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useState } from "react";
import { Link } from "react-router-dom";

const AssetList = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState(""); // "Returnable", "Non-returnable", "Available"

    const { data: assets = [], refetch } = useQuery({
        queryKey: ['hr-assets', search, filter],
        queryFn: async () => {
            // Construct query params
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            // Backend filtering need implementation details, for now we filter client side or basic backend search
            const res = await axiosSecure.get(`/api/assets?${params.toString()}`);
            return res.data;
        }
    });

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this asset?");
        if (confirm) {
            // Delete logic (TODO backend delete route)
            // await axiosSecure.delete(`/api/assets/${id}`);
            // refetch();
            alert("Delete feature coming soon in API");
        }
    }

    // Client-side filter for now if backend doesn't support all
    const filteredAssets = assets.filter(asset => {
        if (!filter) return true;
        if (filter === "Available") return asset.availableQuantity > 0;
        return asset.productType === filter;
    });

    return (
        <div className="p-4 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold">Asset Inventory</h2>
                <Link to="/hr/add-asset" className="btn btn-primary text-white">
                    + Add New Asset
                </Link>
            </div>

            {/* Filters/Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="input input-bordered w-full md:w-80"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="select select-bordered"
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter}
                >
                    <option value="">All Types</option>
                    <option value="Returnable">Returnable</option>
                    <option value="Non-returnable">Non-returnable</option>
                    <option value="Available">Available Stock</option>
                </select>
            </div>

            <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl">
                <table className="table">
                    {/* head */}
                    <thead className="bg-base-200">
                        <tr>
                            <th>Product Name</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Date Added</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssets.length === 0 ? (
                            <tr><td colSpan="5" className="text-center p-4">No assets found.</td></tr>
                        ) : (
                            filteredAssets.map(asset => (
                                <tr key={asset._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={asset.productImage} alt={asset.productName} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{asset.productName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`badge ${asset.productType === 'Returnable' ? 'badge-warning' : 'badge-ghost'}`}>
                                            {asset.productType}
                                        </div>
                                    </td>
                                    <td>
                                        {asset.availableQuantity} / {asset.productQuantity}
                                    </td>
                                    <td>{new Date(asset.dateAdded).toLocaleDateString()}</td>
                                    <th>
                                        <button className="btn btn-ghost btn-xs">Edit</button>
                                        <button onClick={() => handleDelete(asset._id)} className="btn btn-ghost btn-xs text-error">Delete</button>
                                    </th>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetList;
