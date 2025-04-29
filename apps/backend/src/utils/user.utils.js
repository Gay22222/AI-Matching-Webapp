export function formatUser(user) {
    if (!user) return null;

    const mainInf = user?.Bio?.main_inf || {};
    const baseInf = user?.Bio?.Base_inf || {};
    const lifestyle = user?.Bio?.Lifestyle || {};

    return {
        id: user?.id,
        displayName: user?.display_name,
        password: user?.password,
        email: user?.email,
        gender: user?.gender,
        preferredGender: user?.preferred_gender,
        name: user?.Bio?.name,
        age: user?.Bio?.age,
        aboutMe: user?.Bio?.about_me,
        height: mainInf?.height,
        location: mainInf?.location,
        languageId: mainInf?.language_id,
        religionId: mainInf?.religion_id,
        careerId: mainInf?.career_id,
        educationId: mainInf?.education_id,
        zodiacId: baseInf?.zodiac_id,
        characterId: baseInf?.character_id,
        communicateStyleId: baseInf?.communicate_style_id,
        loveLanguageId: baseInf?.love_language_id,
        futureFamilyId: baseInf?.future_family_id,
        drink: lifestyle?.drink,
        smoke: lifestyle?.smoke,
        train: lifestyle?.train,
        petId: lifestyle?.pet_id,
        dietId: lifestyle?.diet_id,
        sleepId: lifestyle?.sleep_id,
        snuId: lifestyle?.snu_id,
        photoId: user?.Bio?.Photo?.map((item) => item?.id),
    };
}
