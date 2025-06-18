import logger from "./logger.js";

export function formatUser(user) {
    if (!user) {
        logger.warn("No user provided to formatUser");
        return null;
    }
    const mainInf = user?.Bio?.main_inf || {};
    const baseInf = user?.Bio?.Base_inf || {};
    const lifestyle = user?.Bio?.Lifestyle || {};
    const formattedUser = {
        id: user?.id,
        displayName: user?.display_name,
        email: user?.email ?? "", // Sử dụng nullish coalescing để tránh 
        password: user?.password,
        gender: user?.gender,
        preferredGender: user?.preferred_gender,
        name: user?.Bio?.name,
        age: user?.Bio?.age,
        aboutMe: user?.Bio?.about_me,
        height: mainInf?.height,
        location: mainInf?.location,
        languageId: mainInf?.Language?.id,
        religionId: mainInf?.Religion?.id,
        careerId: mainInf?.Career?.id,
        educationId: mainInf?.Education?.id,
        zodiacId: baseInf?.Zodiac?.id,
        characterId: baseInf?.Character?.id,
        communicateStyleId: baseInf?.Communicate_style?.id,
        loveLanguageId: baseInf?.Love_language?.id,
        futureFamilyId: baseInf?.FutureFamily?.id,
        sexualOrientationId: baseInf?.Sexual_orientation?.id,
        drink: lifestyle?.drink,
        smoke: lifestyle?.smoke,
        train: lifestyle?.train,
        petId: lifestyle?.Pet?.id,
        dietId: lifestyle?.Diet?.id,
        sleepId: lifestyle?.Sleep?.id,
        snuId: lifestyle?.SNU?.id,
        photos: user?.Bio?.Photo?.map((photo, index) => ({
            id: photo.id,
            url: photo.url,
            is_profile_pic: photo.is_profile_pic // Sử dụng giá trị từ DB
        })) || [],
        bioId: user?.Bio?.id,
        favorites: user?.user_favorites?.map((item) => item?.favorite_id) || [],
        searchingFor: user?.Bio?.Searchingfor?.id,
        isFullInformation: user?.is_full_information,
    };
    logger.debug("Formatted user:", {
        id: formattedUser.id,
        email: formattedUser.email,
        displayName: formattedUser.displayName,
        fields: Object.keys(formattedUser)
    });
    return formattedUser;
}