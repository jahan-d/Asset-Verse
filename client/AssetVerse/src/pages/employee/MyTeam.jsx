import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyTeam = () => {
    const axiosSecure = useAxiosSecure();

    const { data: teamMembers = [], isLoading } = useQuery({
        queryKey: ['my-team'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/my-team');
            return Array.isArray(res.data) ? res.data : [];
        }
    });

    // Upcoming Birthdays Logic (Current Month)
    const currentMonth = new Date().getMonth();
    const upcomingBirthdays = teamMembers.filter(member => {
        if (!member.dateOfBirth) return false;
        const dob = new Date(member.dateOfBirth);
        return dob.getMonth() === currentMonth;
    });

    if (isLoading) return <div className="p-10 text-center"><span className="loading loading-bars loading-lg"></span></div>;

    return (
        <div className="p-4 md:p-10">
            <h2 className="text-3xl font-bold mb-8">My Team</h2>

            {/* Upcoming Birthdays Section */}
            {upcomingBirthdays.length > 0 && (
                <div className="mb-10 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
                    <h3 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">
                        🎂 Upcoming Birthdays
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {(Array.isArray(upcomingBirthdays) ? upcomingBirthdays : []).map(member => (
                            <div key={member._id} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                                <div className="avatar">
                                    <div className="w-10 h-10 rounded-full">
                                        <img src={member.profileImage || "https://i.ibb.co.com/6AD8S0D/profile.png"} />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">{member.name}</div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(member.dateOfBirth).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(Array.isArray(teamMembers) ? teamMembers : []).map(member => (
                    <div key={member._id} className="card bg-base-100 shadow-xl border">
                        <figure className="px-10 pt-10">
                            <div className="avatar">
                                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={member.profileImage || "https://i.ibb.co.com/6AD8S0D/profile.png"} />
                                </div>
                            </div>
                        </figure>
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">{member.name}</h2>
                            <p className="text-sm text-gray-500">{member.role === 'hr' ? 'HR Manager' : 'Employee'}</p>
                        </div>
                    </div>
                ))}
            </div>
            {teamMembers.length === 0 && <p className="text-center text-gray-500">No team members found. You might not be affiliated with any company yet.</p>}
        </div>
    );
};

export default MyTeam;
