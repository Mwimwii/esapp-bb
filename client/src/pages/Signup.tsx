import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from "@material-tailwind/react/Button";
import Input from "@material-tailwind/react/Input";

import TitlLogo from 'assets/logo.svg';
import { signUp } from 'api/auth';

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [,setError] = useState(false);

  const history = useHistory();

  const { uuid } = useParams<{ uuid: string }>();

  const loginAndRedirect = async () => {
    setError(false);
    try {
      const user = await signUp({ email, password });
      console.log(user);
      history.push('/');
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setEmail('');
    setPassword('');
    loginAndRedirect();
  }

  useEffect(() => {
    if (!uuid) {
      history.push('/login');
    }
  }, [uuid, history])


  return (
    <div className="w-full flex flex-col items-center min-h-screen p-4 text-white sm:p-8 md:p-12">
      <img
        src={TitlLogo}
        alt="Titl"
        width="140"
        className="inline-block"
      />
      <h1 className="text-black text-3xl font-serif font-bold leading-normal mt-8 mb-2">Signup</h1>
      <p className="text-green text-center">Welcome! Please enter an email and password to continue</p>
      <form className="flex flex-col pt-8 space-y-6 w-full sm:max-w-md" onSubmit={onSubmit}>
        <Input
          type="text"
          color="green"
          size="lg"
          value={email}
          outline={true}
          placeholder="Email Address"
          onChange={(e: React.FormEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
        />
        <Input
          type="password"
          color="green"
          size="lg"
          outline={true}
          placeholder="Password"
          onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
        />
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

export default Signup;

