import {supabaseClient} from './supabaseDB'

type UserProps ={
    email:string,
    whitelist?:boolean,
    user_id?:string
}

 const emailExists = async (props:UserProps):Promise<boolean> => {
    const supabase = await supabaseClient();
    const { data,error } = await supabase.from('aegis').select('email').eq('email', props.email).single();
    if(error) return false;
    if(data) return true;
    return false;
}
export const getWhitelistStatus = async (props:UserProps):Promise<boolean>=> {
    console.log("props at getWhitelistStatus",props) 
    const userExists = await emailExists(props);
    if(!userExists) {
        await updateUser(props)
        return false
    }

else    {const supabase = await supabaseClient();
const { data,error } = await supabase.from('aegis').select('whitelisted').eq('email', props.email).single()
if(error) {console.log(error) 
    return false}
console.log(data)
return Boolean(data)
}}

export const updateUser = async (props:UserProps) => {
    const userExists = await emailExists(props);
    const supabase = await supabaseClient();

    if(!userExists) {
        const { data,error } = await supabase.from('aegis').insert(
            {
            email: props.email,
            whitelisted: false,
            user_d: props.user_id,
            }
        )
        if(error){
            console.log("Insertion failed with error",error)
        }
    
    }
    else{

        const { data,error } = await supabase.from('aegis').upsert(
            {
            email: props.email,
            user_Id: props.user_id,
            whitelisted: props.whitelist?props.whitelist:false,
            }
        )
        if(error){
            console.log("Upsertion failed with error",error)
        }
        
    }
}