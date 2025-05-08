// app/(main)/layout.tsx

import AppLayout from "@/components/layout/AppLayout";
import { MetadataProvider } from "@/hooks/useMetadata";

import { setupAxios } from "@/app/auth/_helpers";
import axios from "axios";
setupAxios(axios);
export default function MainLayout({ children }) {
    return (
        <MetadataProvider>
            <AppLayout>{children}</AppLayout>
        </MetadataProvider>
    );
}
