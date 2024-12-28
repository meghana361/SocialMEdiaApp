import { atom } from "recoil";
import {selector} from 'recoil'
// import userAtom from "./userAtom";
// const userfollowing=selector({
//     key:'userfollowing',
//     get:({ get})=>{
//         const currentUser=get(userAtom);
//         return currentUser.following.includes();
//     }
// })
const FollowUnfollow=atom({
    
    key:"FollowUnfollow",
    default:'false'
})
export default FollowUnfollow;