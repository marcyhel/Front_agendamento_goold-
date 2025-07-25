"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ProfileResponse } from "@/core/models/profile.model";
import { getProfileService } from "@/core/service/profile";

type ProfileContextType = {
    profile: ProfileResponse | null;
    refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);

    const refreshProfile = async () => {
        const data = await getProfileService();
        setProfile(data);
    };

    useEffect(() => {
        refreshProfile();
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, refreshProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) throw new Error("useProfile must be used within a ProfileProvider");
    return context;
};
