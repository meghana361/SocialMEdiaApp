import React, { useState, useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowtoast from './useShowtoast';

const useFollowUnfollow = (user) => {
    const showToast = useShowtoast();
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [followerCount, setFollowerCount] = useState(user.followers.length); // Initialize follower count

    // Fetch initial follow status and follower count when component mounts
    useEffect(() => {
        if (user && currentUser) {
            
            setFollowing(user.followers.includes(currentUser._id));
            console.log(following,"initial");
            setFollowerCount(user.followers.length); // Initialize count on first render
        }
    }, [user, currentUser]);
    console.log(following,"oustide useefct");

    const handleFollowUnfollow = useCallback(async () => {
        if (!currentUser) {
            showToast("Error", "Please login to follow", "error");
            return;
        }

        if (updating) return;
        setUpdating(true);

        try {
            const res = await fetch(`/api/users/followunfollow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify({ userid: currentUser._id })
            });
            
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            // Toggle follow state and update follower count based on the server response
            setFollowing((prevFollowing) => {
                console.log("prev",prevFollowing);
                
                const newFollowingStatus = !prevFollowing;
                console.log("prevafter",newFollowingStatus);
                setFollowerCount((prevCount) => prevFollowing ? prevCount - 1 : prevCount + 1); // Adjust count
                return newFollowingStatus;
            });

            // Show success message
            if (following) {
                showToast("Success", `Unfollowed ${user.name}`, "success");
            } else {
                showToast("Success", `Followed ${user.name}`, "success");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
        }
    }, [currentUser, user, updating, showToast, following]);

    return { handleFollowUnfollow, updating, following, followerCount };
};

export default useFollowUnfollow;