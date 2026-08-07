"use client"
import { loginWithGoogle } from "@/lib/auth-client"
import { authClient} from "@workspace/auth" // import the auth client

import React from 'react'


const page = () => {

  const handleLogin = async () => {
    loginWithGoogle()
    console.log("signed in")
  }

  const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession() 
  return (
    <div>
      {
        isPending ? "Loading..." : session ? "Signed in as " + session.user.email : "Not signed in"
      }
        <button  type="button" onClick={handleLogin}>
          login with google
        </button>
      
    </div>
  )
}

export default page