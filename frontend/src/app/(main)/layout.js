import AppLayout from "@/components/layout/AppLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { MetadataProvider } from "@/hooks/useMetadata";
import { ProfileProvider } from "@/context/ProfileContext"; // Thêm import
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@/hooks/useSocket";

import { setupAxios } from "@/app/auth/_helpers";
import axios from "axios";
setupAxios(axios);

export default function MainLayout({ children }) {
    return (
        <AuthProvider>
            <SocketProvider>
                <MetadataProvider>
                    <ProfileProvider>
                        <AppLayout>{children}</AppLayout>
                        <Toaster position="top-right" reverseOrder={false} />
                    </ProfileProvider>
                </MetadataProvider>
            </SocketProvider>
        </AuthProvider>
    );
}