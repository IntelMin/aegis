import supabase from '../../server/supabase.js'
export const getWhitelistStatus = async (email:string): Promise<boolean> => {
    {
      const { data, error } = await supabase.from('users').select('whitelisted').eq('email',email).single()
      console.log("status at getWhitelistStatus", data?.whitelisted)
      if (error) {
        console.log(error)
        return false
      }
  
      return Boolean(data.whitelisted)
    }
  }
  