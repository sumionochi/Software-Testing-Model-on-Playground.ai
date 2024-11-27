"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader } from "lucide-react";

const ProfileContext = createContext<any>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchProfile = async () => {
      try {
        const { data, error: userError } = await supabase.auth.getUser();

        if (userError || !data?.user) {
          console.error("Error fetching user:", userError);
          setLoading(false);
          return;
        }

        const userId = data.user.id;

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Error in fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50"
        style={{ height: "100vh", width: "100vw" }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full animate-spin border-4 border-white border-t-transparent"></div>
          <p className="text-white text-lg font-medium"><Loader className="w-7 h-7 animate-spin"/></p>
        </div>
      </div>
    );
  }

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
