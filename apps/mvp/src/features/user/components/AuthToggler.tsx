"use client";
import { Popover } from "../../../components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Card } from "../../../components/ui/card";
import { LogIn, LogOut, User } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useFirebaseUser } from "@/src/hooks/useFirebaseUser";
import { useAuth } from "../hooks/useAuth";

export default function AuthToggler() {
  const { user, token } = useFirebaseUser();
  const { handleSignIn, handleSignOut } = useAuth();

  return (
    <div>
      <Popover>
        <PopoverTrigger className={`${!token ? '' : ''} flex cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-accent/50 items-center gap-2`}>
          {user ? (
            <img className="w-10 h-10 rounded-lg" src={user?.photoURL as string} alt="" />
          ) : (
            <span className="font-semibold bg-primary p-2 h-10 w-10 flex items-center justify-center rounded-full"><User /></span>
          )}
          <div className="grid place-items-start">
           {user ? (
            <>
             <span className="text-gray-600 dark:text-gray-200 text-sm">{user.displayName}</span>
             <span className="text-gray-600 dark:text-gray-200 text-[10px]">{user.email}</span>
            </>
           ): (
            <div className="grid gap-1">
             <div className="bg-gray-200 dark:bg-accent w-24 h-3 text-sm"></div>
             <div className="bg-gray-200 dark:bg-accent w-32 h-2 text-[11px]"></div>
            </div>
           )}
          </div>          
        </PopoverTrigger>
        <PopoverContent className="w-32">
          <Card className="p-3">
            {user ? (
              <Button onClick={handleSignOut} ><LogOut />Logout</Button>
            ) : (
              <Button onClick={handleSignIn}><LogIn />Sign in</Button>
            )}
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  ) 
}
