import React, { useEffect } from "react";
import { HeartIcon, MessageCircleIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
const MatchModal = ({ user, onClose }) => {
    const navigate = useNavigate();
    // Add a small vibration effect when the match modal appears
    useEffect(() => {
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }, []);
    const handleSendMessage = () => {
        onClose();
        navigate(`/chat/${user.id}`);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-2xl animate-[heartbeat_1s_ease-in-out]">
                <div className="p-4 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white"
                    >
                        <XIcon size={24} />
                    </button>
                    <HeartIcon size={50} className="mx-auto text-white mb-2" />
                    <h2 className="text-2xl font-bold text-white mb-1">
                        It's a Match!
                    </h2>
                    <p className="text-white/90">
                        You and {user.name} have liked each other.
                    </p>
                </div>
                <div className="flex justify-center -mt-10">
                    <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden">
                        <img
                            src={user.photos[0]}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {user.name}, {user.age}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-2">
                        {user.bio}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleSendMessage}
                            className="w-full py-3 bg-gradient-to-r from-[#FF5864] to-[#FF655B] text-white rounded-lg flex items-center justify-center gap-2"
                        >
                            <MessageCircleIcon size={20} />
                            <span>Send Message</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg"
                        >
                            Keep Swiping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MatchModal;
