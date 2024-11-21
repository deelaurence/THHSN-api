
const successResponse = <T>(payload:T, statusCode:number, message:string)=>{
    return {
        status:"success",
        message,
        statusCode,
        payload 
    }
}



export{successResponse}




