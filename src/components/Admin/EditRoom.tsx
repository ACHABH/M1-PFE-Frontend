import { useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";

interface RoomType {
    room: string;
}

interface EditRoomProps {
    room: RoomType;
    onUpdate: (room: RoomType) => void;
    onCancel: () => void;
}


const EditRoom = ({ room, onUpdate, onCancel }: EditRoomProps) => {
    const [formData, setFormData] = useState(room);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onUpdate(formData);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div
        className="container my-4 component-bg shadow p-3 rounded"
        style={{ width: "500px" }}
        >
            <h3>Edit Room</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="room">Room</label>
                    <input
                        // {...form.register("rooms", { required: true })}
                        type="text"
                        className="form-control"
                        name="rooms"
                        value={formData.room}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary me-2">
                    Update
                </button>
                <button type="reset" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditRoom;