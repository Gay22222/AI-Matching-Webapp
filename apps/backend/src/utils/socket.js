let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error(" Socket.IO instance chưa được khởi tạo!");
  }
  return ioInstance;
};
