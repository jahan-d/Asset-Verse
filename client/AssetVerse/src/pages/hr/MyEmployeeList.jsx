import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const MyEmployeeList = () => {
    const axiosSecure = useAxiosSecure();

    const { data: employees = [], refetch, isLoading } = useQuery({
        queryKey: ['hr-employees'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/hr/employees');
            return res.data;
        }
    });

    const handleRemove = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove ${name} from your team? This will return all their assets.`)) return;

        try {
            await axiosSecure.delete(`/api/hr/employees/${id}`);
            toast.success(`${name} removed from team.`);
            refetch();
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove employee");
        }
    }

    if (isLoading) return <div className="p-10 text-center"><span className="loading loading-bars loading-lg"></span></div>;

    return (
        <div className="p-4 md:p-10">
            <h2 className="text-3xl font-bold mb-8">My Employees</h2>
            <div className="bg-base-100 shadow-xl rounded-xl border overflow-hidden">
                <table className="table">
                    <thead className="bg-base-200">
                        <tr>
                            <th>Employee</th>
                            <th>Role</th>
                            <th>Pending Assets</th>
                            <th>Assigned Assets</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr><td colSpan="5" className="text-center p-6">No employees found.</td></tr>
                        ) : (
                            employees.map(emp => (
                                <tr key={emp._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={emp.profileImage || "https://i.ibb.co.com/6AD8S0D/profile.png"} alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{emp.name}</div>
                                                <div className="text-sm opacity-50">{emp.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Employee</td>
                                    <td>{/* Todo: Count pending? For now N/A */} - </td>
                                    <td>
                                        <div className="badge badge-lg">{emp.assetCount || 0}</div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleRemove(emp._id, emp.name)}
                                            className="btn btn-error btn-sm text-white"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-sm text-gray-500">
                Total Employees: {employees.length}
            </div>
        </div>
    );
};

export default MyEmployeeList;
