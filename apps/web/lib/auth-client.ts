import { authClient } from "@workspace/auth"; //import the auth client


export async function loginWithGoogle() {
  const data = await authClient.signIn.social({
    provider: "google",
  });
  console.log(data);
}
