// app/(main)/layout.tsx

import AppLayout from "@/components/layout/AppLayout";
import { MetadataProvider } from "@/hooks/useMetadata";

export default function MainLayout({ children }) {
    return (
        <MetadataProvider>
            <AppLayout>{children}</AppLayout>
        </MetadataProvider>
    );
}
