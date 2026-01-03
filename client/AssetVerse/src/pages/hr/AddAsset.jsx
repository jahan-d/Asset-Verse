import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddAsset = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // Basic validation
        if (!data.productName || !data.productQuantity) return;

        try {
            const assetData = {
                productName: data.productName,
                productImage: data.productImage, // URL from input
                productType: data.productType, // "Returnable" | "Non-returnable"
                productQuantity: parseInt(data.productQuantity),
            };

            await axiosSecure.post("/api/assets", assetData);
            toast.success("Asset Added Successfully!");
            reset();
            navigate("/hr/assets"); // Redirect to list
        } catch (error) {
            console.error(error);
            toast.error("Failed to add asset");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-base-100 shadow-xl rounded-2xl mt-10">
            <h2 className="text-3xl font-bold text-center mb-6">Add New Asset</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Product Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Macbook Pro M3"
                        className="input input-bordered w-full"
                        {...register("productName", { required: true })}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Image URL</span>
                    </label>
                    <input
                        type="url"
                        placeholder="https://..."
                        className="input input-bordered w-full"
                        {...register("productImage", { required: true })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Product Type</span>
                        </label>
                        <select className="select select-bordered w-full" {...register("productType")}>
                            <option value="Returnable">Returnable</option>
                            <option value="Non-returnable">Non-returnable</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Quantity</span>
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            className="input input-bordered w-full"
                            {...register("productQuantity", { required: true, min: 1 })}
                        />
                    </div>
                </div>

                <button className="btn btn-primary w-full text-white mt-4">
                    Add Asset
                </button>
            </form>
        </div>
    );
};

export default AddAsset;
