export const saved=[];
export const user={id:'test-user',email:'test@example.invalid',user_metadata:{display_name:'Test'}};
export const supabase={auth:{getUser:async()=>({data:{user}})},from(){return {insert:async row=>{saved.push(row);return {error:null}}}}};
