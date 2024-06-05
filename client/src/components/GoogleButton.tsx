import axios from "axios";
import React from "react";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { clientId } from "../redux/types";
import { sendGoogleLogin } from "../apis/auth.api";
import { AiFillGoogleCircle } from "react-icons/ai";
import { Button } from "@chakra-ui/react";
import { checkProfileAsync } from "../redux/user/userSlice";
import { useAppDispatch } from "../redux/hooks";

/**
 * Modify if needed
 */
function GoogleButton() {
  const dispatch = useAppDispatch();

  const handleSuccess = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if ("accessToken" in response) {
      const accessToken = response.accessToken;

      await sendGoogleLogin(accessToken);
      dispatch(checkProfileAsync());

    }
  };
  const handleFailure = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    console.log(response);
  };

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Google"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      render={(renderProps) => (
        <Button
          size="md"
          w="full"
          onClick={renderProps.onClick}
          // disabled={renderProps.disabled}
          disabled={true}
          colorScheme="teal"
          variant="outline"
          leftIcon={<AiFillGoogleCircle />}
        >
          Google
        </Button>
      )}
    />
  );
}

export default GoogleButton;
