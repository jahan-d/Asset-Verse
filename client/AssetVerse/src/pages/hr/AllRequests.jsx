import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const AllRequests = () => {
    const axiosSecure = useAxiosSecure();

    const { data: requests = [], refetch, isLoading } = useQuery({
        queryKey: ['hr-requests'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/requests');
            return res.data;
        }
    });

    const handleAction = async (id, status) => {
        try {
            await axiosSecure.patch(`/api/requests/${id}`, { status });
            toast.success(`Request ${status} successfully`);
            refetch();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message); // Package Limit Error
            } else {
                toast.error("Action failed");
            }
        }
    }

    if (isLoading) return <div className="p-10 text-center"><span className="loading loading-bars loading-lg"></span></div>;

    return (
        <div className="p-4 md:p-10">
            <h2 className="text-3xl font-bold mb-8">All Requests</h2>

            <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl border">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Requester</th>
                            <th>Asset</th>
                            <th>Date</th>
                            <th>Note</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">No requests found.</td></tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req._id}>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-bold">{req.requesterName}</span>
                                            <span className="text-xs text-gray-500">{req.requesterEmail}</span>
                                        </div>
                                    </td>
                                    <td>{req.assetName}</td>
                                    <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                                    <td>
                                        <div className="tooltip" data-tip={req.note || "No note"}>
                                            <button className="btn btn-xs btn-circle btn-ghost">ℹ️</button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`badge ${req.requestStatus === 'pending' ? 'badge-warning' :
                                            req.requestStatus === 'approved' ? 'badge-success' : 'badge-error'
                                            } badge-outline capitalize`}>
                                            {req.requestStatus}
                                        </div>
                                    </td>
                                    <th>
                                        {req.requestStatus === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAction(req._id, 'approved')}
                                                    className="btn btn-xs btn-success text-white"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req._id, 'rejected')}
                                                    className="btn btn-xs btn-error text-white"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
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

export default AllRequests;
