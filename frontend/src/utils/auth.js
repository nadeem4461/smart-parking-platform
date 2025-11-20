export const saveAuth =({token, name,role })=>{
    localStorage.setItem("token",token);
    localStorage.setItem("name",name || "");
    localStorage.setItem("role",role || "user");
}
export const clearAuth =()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
}
export const isAuthed = () => !!localStorage.getItem("token");