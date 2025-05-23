import { MetadataProvider } from "@/hooks/useMetadata";
import ProfileSetup from "./components/ProfileSetup";
import { setupAxios } from "@/app/auth/_helpers";
import axios from "axios";
import { AuthProvider } from "@/hooks/useAuth";
setupAxios(axios);
export default function ProfileSetupPage() {
    return (
        <AuthProvider>
            <MetadataProvider>
                <ProfileSetup />
            </MetadataProvider>
        </AuthProvider>
    );
}
