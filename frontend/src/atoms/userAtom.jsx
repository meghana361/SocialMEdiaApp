import { atom } from "recoil";
const userAtom =atom({
    key:'userAtom',
    default:JSON.parse(localStorage.getItem("user-threads")) || null,
    effects_UNSTABLE: [
      ({ onSet }) => {
          onSet((newUser) => {
              if (newUser) {
                  localStorage.setItem("user-threads", JSON.stringify(newUser));
              } else {
                  localStorage.removeItem("user-threads");
              }
          });
      },
  ],
})

export default userAtom;
/*const userAtom = atom({
  key: 'userAtom',
  default: (() => {
    try {
      const savedUser = localStorage.getItem("user-threads");
      return savedUser ? JSON.parse(savedUser) : null; // or default to '' as per your case
    } catch (e) {
      console.error("Error parsing user data from localStorage", e);
      return null; // Handle it gracefully
    }
  })(),
});
*/