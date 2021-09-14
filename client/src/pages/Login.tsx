import React from 'react';
import Button from "@material-tailwind/react/Button";
import Input from "@material-tailwind/react/Input";

const Login: React.FC = () => {
  return (
    <div className="w-full flex flex-wrap justify-center">
      <div className="flex flex-col pt-4">
        <Input
          type="text"
          color="green"
          size="lg"
          outline={true}
          placeholder="Username"
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
        >
            Submit
        </Button>
      </div>
    </div>
  )
}

export default Login;

