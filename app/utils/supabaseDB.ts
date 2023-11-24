// import { createClient } from '@supabase/supabase-js'


// export const supabaseClient = async(supabaseToken:any)=>{
//     const supabase = createClient(
//     String(process.env.NEXT_PUBLIC_SUPABASE_URL),
//     String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
//     {
//         global:{headers: {
//         Authorization: `Bearer ${supabaseToken}`
//         }},
//     }
//     )
//     return supabase;
// }

import { createClient } from '@supabase/supabase-js'


export const supabaseClient = async()=>{
    const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    )
    return supabase;
}
