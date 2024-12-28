import { AnimatePresence } from "framer-motion";
import { Button, Container } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Navigate, Route, Routes } from "react-router-dom";
import Userpage from "./components/pages/Userpage";
import PostPage from "./components/pages/PostPage";
import Header from "./components/header/Header";
import Homepage from "./components/pages/Homepage";
import Authpage from "./components/pages/Authpage";

import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import LogoutButton from "./components/Auth/LogoutButton";
import UpdateProfilePage from "./components/update/UpdateProfilePage";
import CreatePosts from "./components/createPosts/CreatePosts";
import FloatingShape from "./components/FloatingShape";
// import Buttons from "./components/Buttons";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <>
      <div
       
      >
        <Container maxW={"620px"}>
          <Header />
          {/* <Buttons/> */}
          <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-purple-700' size='w-48 h-48' top='90%' left='40%' delay={5} />
			{/* <FloatingShape color='bg-lime-500' size='w-32 h-32' top='80%' left='-10%' delay={2} /> */}
			<FloatingShape color='bg-yellow-500' size='w-32 h-32' top='-90%' left='70%' delay={2} />
          <AnimatePresence>
            <Routes>
              <Route
                path="/"
                element={user ? <Homepage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/auth"
                element={!user ? <Authpage /> : <Navigate to="/" />}
              />
              <Route
                path="/update"
                element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
              />{" "}
              //if logged in update else take to login page
              <Route path="/:username" element={<Userpage />} />
              <Route path="/:username/post/:pid" element={<PostPage />} />
            </Routes>
          </AnimatePresence>
          {/* {user && <LogoutButton />} */}
          {user && <CreatePosts />}
        </Container>
      </div>
    </>
  );
}

export default App;
