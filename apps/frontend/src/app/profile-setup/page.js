import { MetadataProvider } from "@/hooks/useMetadata";
import ProfileSetup from "./components/ProfileSetup"; // if you have a component
import { setupAxios } from "@/app/auth/_helpers";
import axios from "axios";
setupAxios(axios);
export default function ProfileSetupPage() {
    return (
        <MetadataProvider>
            <ProfileSetup />
        </MetadataProvider>
    );
}
