export const getRoom = async (req, res) => {
    try {
        const { room } = req;
        console.log(room, "room");

        res.status(200).json({
            statusCode: 200,
            room,
        });
    } catch (error) {
        console.error("Error getting room:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};

export const createRoomController = async (req, res) => {
    try {
        const { match_id, user_id } = req.body;
        const room = await createRoom(match_id, user_id);
        res.status(201).json({
            statusCode: 201,
            message: "Room created successfully",
            room,
        });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};
