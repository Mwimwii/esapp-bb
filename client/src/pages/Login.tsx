import React from 'react';
import Button from "@material-tailwind/react/Button";
import Input from "@material-tailwind/react/Input";
import TitlLogo from 'assets/logo.svg';

const Login: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center min-h-screen p-4 text-white sm:p-8 md:p-12">
      <img
        src={TitlLogo}
        alt="Titl"
        width="140"
        className="inline-block"
      />
      <div className="flex flex-col pt-8 space-y-6 w-full sm:max-w-md">
        <Input
          type="text"
          color="green"
          size="lg"
          outline={true}
          placeholder="Email Address"
        />
        <Input
          type="password"
          color="green"
          size="lg"
          outline={true}
          placeholder="Password"
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
        >
            Submit
        </Button>
      </div>
    </div>
  )
}

export default Login;

