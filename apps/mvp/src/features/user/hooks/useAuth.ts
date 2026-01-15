import { auth, provider } from "@/src/app/lib/firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";

export function useAuth(){
    async function handleSignIn(){
        try{
            const signInObserver = await signInWithPopup(auth, provider);
            const token = await signInObserver.user.getIdToken();

            await fetch("api/auth/", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

        }
        catch(err){
            console.error(err);
        }
    }

    async function handleSignOut(){
        try{
            await signOut(auth);
            location.reload();
        }
        catch(err){
            console.error(err);
        }
    }

    return { handleSignIn, handleSignOut }
}