// app/(main)/layout.tsx

import AppLayout from "@/components/layout/AppLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { MetadataProvider } from "@/hooks/useMetadata";
import { Toaster } from "react-hot-toast";

import { setupAxios } from "@/app/auth/_helpers";
import axios from "axios";
setupAxios(axios);
export default function MainLayout({ children }) {
    return (
        <AuthProvider>
            <MetadataProvider>
                <AppLayout>{children}</AppLayout>
                <Toaster position="top-right" reverseOrder={false} />
            </MetadataProvider>
        </AuthProvider>
    );
}
