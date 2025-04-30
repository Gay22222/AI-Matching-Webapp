import { metadataRepository } from "../repository/metadata.repository.js";

export const metadataService = {
    get: () => {
        return metadataRepository.get();
    },
};
