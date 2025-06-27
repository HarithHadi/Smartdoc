import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase";
import { Button } from "@/components/ui/button";
import { doc, setDoc } from "firebase/firestore";


const GoogleSignInButton = () =>{
    const handleGoogleSignIn = async () => {

        try{
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("User signed in with Google !");
            console.log("User data:", {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                uid: user.uid,
            });

            await setDoc(doc(db, "userData", user.uid), {
                username: user.displayName,
                email: user.email,
                createdAt: new Date().toISOString()
            });

        }catch(error){
            console.error("Error signing in with google : ", error.message );
        }

    };
    return(
        <button
            onClick={handleGoogleSignIn}
            className="w-full bg-[#f4f4f4] text-black hover:bg-black hover:text-[#a3a3a3] hover:border hover:border-black transition duration-300 py-2 px-4 rounded-md flex items-center justify-center gap-2">
    <img src="/Google__G__logo.png" alt="Google logo" className="w-5 h-5" />
    Sign in with Google
    </button>
    );
};

export default GoogleSignInButton;