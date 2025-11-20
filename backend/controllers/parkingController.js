import {pool} from '../db.js';

export const getFilteredParking=async(req,res)=>{
try {
    const {type,minAvailable,ev }= req.query;
    let query= 'SELECT * FROM parking_locations WHERE 1=1';
    
    const params=[];

    if(type){
        params.push(type);
        query+=' AND type= $${params.length}';
    }
    if(minAvailable){
        params.push(minAvailable);
        query+=' AND available_slots >= $${params.length}';
    }
    if(ev=='true'){
        
    }
} catch (error) {
    
}
}