import axios from "axios";

export const commonAPI = async(httprequest,url,reqBody,reqheader)=>{
    let reqConfig={
        method:httprequest,
        url:url,
        data:reqBody,
        // Headers:reqheader?reqheader:{            "Content-Type":"application/json"
        headers:reqheader?reqheader:{
            "Content-Type":"application/json"
        //there are two types of content to upload
    }
    }
    return await axios(reqConfig).then((result)=>{
        return result
    }).catch((err)=>{
        return err
    })

}