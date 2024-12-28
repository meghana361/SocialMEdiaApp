import React, { useEffect, useState } from 'react'
import Userheader from '../header/Userheader'
import UserPost from '../UserPosts/UserPost'
import { Box, useColorMode,Flex } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import useShowtoast from '../../hooks/useShowtoast'
import { useRecoilState } from 'recoil'
import PostsAtom from '../../atoms/PostsAtom'
import useGetUserProfile from '../../hooks/useGetUserProfile'
import {ColorRing} from "react-loader-spinner"

const Userpage = () => {
  const{user,loading}=useGetUserProfile()
  const {username}=useParams()
  const showToast = useShowtoast();
  const[posts,setPosts]=useRecoilState(PostsAtom);
  const[fetchingPosts,setFetchingPosts]=useState(true)
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const{colorMode}=useColorMode()
  useEffect(()=>{
    const getPosts=async()=>{
      if(!user) return;
      setFetchingPosts(true)
      try {
        
        const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				setPosts(data);
				console.log(data);
        
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};
    getPosts()
   
  },[username,showToast,user,setPosts])
  if (!user && loading) {
		return (
			<Flex justifyContent={'center'} >
				<ColorRing
  visible={true}
  height="50"
  width="50"
  ariaLabel="color-ring-loading"
  wrapperStyle={{}}
  wrapperClass="color-ring-wrapper"
  colors={['#e03541', '#218ccf', '#d7ea27', '#342aff', '#849b87']}

  />
			</Flex>
		);
	}

	if (!user && !loading) return <h1>User not found</h1>;

  return (
    <Flex flex={1} alignItems={'flex-start'} >

 <Box border={"solid 1px"} borderColor={colorMode==='light'?'gray':'gray.900'} p={6} rounded={"lg"} flex={1} >
  {!fetchingPosts&&posts.length===0&&<h3>User has not posts.</h3>}
{
  fetchingPosts&&<Flex ml={"100px"}>
    <ColorRing
  visible={true}
  height="60"
  width="60"
  ariaLabel="color-ring-loading"
  wrapperStyle={{}}
  wrapperClass="color-ring-wrapper"
  colors={['#e03541', '#218ccf', '#d7ea27', '#342aff', '#849b87']}
  />
  </Flex>
}
   <Userheader user={user}/>


   {posts.map((post)=>(
     
     <UserPost key={post._id} post={post} postedBy={post.postedBy} replies={post.replies.length} likes={post.likes.length}/>
    ))
}
   </Box>
    </Flex>
  )
}

export default Userpage
