import React, { useState } from 'react'
import useShowtoast from './useShowtoast';

const useImageDisplay = () => {
    const [imgUrl,setImgUrl]=useState(null);
    const showToast=useShowtoast()
    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        if(file&&file.type.startsWith("image/")){
            const reader=new FileReader();
            reader.onloadend=()=>{
                setImgUrl(reader.result)
            };
            reader.onerror=()=>{
                showToast("File read error", "There was an error reading the file", "error");
            }
            reader.readAsDataURL(file)
        }else{
            showToast("Invalid file type", "Please select an image file", "error");
           setImgUrl(null)
        }
    };
    // const clearImage=()=>{
    //     setImgUrl(null)
    // }
    // console.log(imgUrl)
  return {handleImageChange,imgUrl,setImgUrl}
}

export default useImageDisplay;
