import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from "@material-tailwind/react/Button";
import Input from "@material-tailwind/react/Input";

import TitlLogo from 'assets/logo.svg';
import { UserContext } from 'global-state';
import { logIn, userExists, contactExists } from 'api/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [,setError] = useState(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState('');

  const [showContactDetails, setShowContactDetails] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<number>(0);

  const {
    setUser,
    setIsSet: setIsUserSet,
  } = useContext(UserContext);

  const history = useHistory();

  const getUserOrContact = async () => {
    console.log(email)
    if (email) {
        const isUser = await userExists(email);
        if (isUser) {
          setShowPassword(true);
          setShowContactDetails(false);
        } else {
            // TODO show error message
            setError(true);
        }
    } else if (firstName && lastName && phoneNumber) {
        const isContact = await contactExists({ firstName, lastName, phoneNumber});
        if (isContact) {
          history.push(`/signup/${isContact}`);
        } else {
          console.log(isContact);
        }
    } else {
        // throw a validation error
    }
  }

  const loginAndRedirect = async () => {
    setError(false);
    try {
      const user = await logIn({ email, password });
      setUser(user);
      setIsUserSet(true);
      await logIn({ email, password });
      history.push('/dashboard');
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (showContactDetails) {
      getUserOrContact();
    } else {
      loginAndRedirect();
    }
  }

  return (
    <div className="w-full flex flex-col items-center min-h-screen p-4 text-white sm:p-8 md:p-12">
      <img
        src={TitlLogo}
        alt="Titl"
        width="140"
        className="inline-block"
      />
      <h1 className="text-black text-3xl font-serif font-bold leading-normal mt-8 mb-2">Login</h1>
      <form className="flex flex-col pt-8 space-y-6 w-full sm:max-w-md" onSubmit={onSubmit}>
        <Input
          type="text"
          color="green"
          size="lg"
          outline={true}
          placeholder="Email Address"
          onChange={(e: React.FormEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
        />
        {showPassword && (
          <>
            <Input
              type="password"
              color="green"
              size="lg"
              outline={true}
              placeholder="Password"
              onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
             />
          </>
         )}
         {showContactDetails && (
           <>
              <span className="text-black text-center">-OR-</span>
              <Input
                type="text"
                color="green"
                size="lg"
                outline={true}
                placeholder="First Name"
                onChange={(e: React.FormEvent<HTMLInputElement>) => setFirstName(e.currentTarget.value)}
              />
              <Input
                type="text"
                color="green"
                size="lg"
                outline={true}
                placeholder="Last Name"
                onChange={(e: React.FormEvent<HTMLInputElement>) => setLastName(e.currentTarget.value)}
              />
              <Input
                type="number"
                color="green"
                size="lg"
                outline={true}
                placeholder="Phone Number"
                onChange={(e: React.FormEvent<HTMLInputElement>) => setPhoneNumber(Number(e.currentTarget.value))}
              />
           </>
        )}
        <Button
          color="green"
          buttonType="filled"
          size="regular"
          rounded={false}
          block={false}
          iconOnly={false}
          ripple="light"
          className="bg-green"
          type="submit"
        >
            Submit
        </Button>
      </form>
    </div>
  )
}

export default Login;
