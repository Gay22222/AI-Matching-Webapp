import { MetadataProvider } from "@/hooks/useMetadata";
import ProfileSetup from "./components/ProfileSetup"; // if you have a component

export default function ProfileSetupPage() {
    return (
        <MetadataProvider>
            <ProfileSetup />
        </MetadataProvider>
    );
}
