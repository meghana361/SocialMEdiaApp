import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";
const useShowtoast = () => {
  const toast = useToast();
  const showToast = useCallback(
    (title, description, status) => {
      toast({
        title,
        description,
        status,
        duration: 3000,
        isClosable: true,
      });
    },
    [toast]
  );
  return showToast;
};
//status: The type of the notification, which determines the visual style (e.g., "success", "error", "warning", "info").
export default useShowtoast;
