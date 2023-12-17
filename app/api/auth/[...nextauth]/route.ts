import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import supabase from "@/server/supabase"
export const authOptions:AuthOptions = {
  // Configure one or more authentication providers
  providers: [

CredentialsProvider({
    name: 'Credentials',
    credentials: {},
    async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied
      const { email, password } = credentials
      const { data:user, error } = await supabase.from('users').select().eq('email', email).single()
        console.log(user)
    //   const user = { id: "1", name: "J Smith", email: "" }
        if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user
        } else {
            // If you return null or false then the credentials will be rejected
            return null
            // You can also Reject this callback with an Error or with a URL:
            // throw new Error('error message') // Redirect to error page
            // throw '/path/to/redirect'        // Redirect to a URL
        }
    }
})
    // ...add more providers here
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: '/signin',
    signOut: '/logout',
    error: '/login', // Error code passed in query string as ?error=
    verifyRequest: '/login', // (used for check email message)
  },
  
  
}

const handler = NextAuth(authOptions)
export {handler as GET , handler as POST}