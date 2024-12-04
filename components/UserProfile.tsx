"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/profileProvider";
import { signout } from "@/lib/auth-actions";
import LoginButton from "./Log";

export function UserProfile() {
  const { profile, loading } = useProfile();
  const router = useRouter();

  const handleLogout = async () => {
    await signout(); 
    router.push("/login");
  };

  if (loading) {
    return <Loader className="w-5 h-5 animate-spin" />;
  }

  if (!profile) {
    return (
      <div className="w-[2.25rem] h-[2.25rem]">
        <Link href="/login">
          <LoginButton />
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-[2.25rem] h-[2.25rem] cursor-pointer">
        <Avatar>
          <AvatarImage src={profile.avatar_url || undefined} alt="User Profile" />
          <AvatarFallback>{profile.email?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 cursor-pointer">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          
        </DropdownMenuGroup>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}