export const productValid = (values)=>{
    if(!values.title){
        return{error:"*Enter the Product Name.", valid:false}
    }
    if(!values.category){
        return{error:"*Enter the Product Category.", valid:false}
    }
    if(!values.subCategory){
        return{error:"*Enter the Product Sub Category.", valid:false}
    }
    if(!values.image){
        return{error:"*Upload Product Image.", valid:false}
    }
    return {error:"All are valid -- Saving...", valid:true}
}

export const marketerValid = (values)=>{
    if(!values.name){
        return{error:"*Enter the Marketer Name.", valid:false}
    }
    if(!values.email){
        return{error:"*Enter the E-mail.", valid:false}
    }
    if(!values.phone){
        return{error:"*Enter the Phone Number.", valid:false}
    }
    if(!values.password){
        return{error:"*Enter a password.", valid:false}
    }
    return {error:"All are valid -- Saving...", valid:true}
}

export const distributerValid=(values)=>{
    if(!values.name){
        return{error:"*Enter the Marketer Name.", valid:false}
    }
    if(!values.phone){
        return{error:"*Enter the Phone Number.", valid:false}
    }
    if(!values.email){
        return{error:"*Enter the E-mail.", valid:false}
    }
    if(!values.password){
        return{error:"*Enter a password.", valid:false}
    }
    if(!values.basePrice){
        return{error:"*Enter the Base Price.", valid:false}
    }
    if(!values.deliveryPrice){
        return{error:"*Enter a Delivery Price.", valid:false}
    }
    return {error:"All are valid -- Saving...", valid:true}
}