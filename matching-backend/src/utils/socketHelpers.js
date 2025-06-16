export const findSocketId = (users = [], userId) => {
    return users?.find((user) => user?.id === userId)?.socket_id;
};
