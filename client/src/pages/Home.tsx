import React from 'react';
import Button from "@material-tailwind/react/Button";
//import { Redirect } from 'react-router';

const Home: React.FC = () => {
  return (
      <div className="bg-blue-400 h-screen grid">
        <div className="w-3/4 my-auto ml-20">
          <h1 className="text-5xl font-bold mb-10 text-white">Titl</h1>
          <p className="text-white">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo officia earum ducimus neque obcaecati consequuntur ratione accusamus at officiis tempore,
            magnam non debitis fugit unde alias id quidem necessitatibus.
          </p>
          <Button color="lightBlue" ripple="light">Button</Button>
        </div>
      </div>
    )
}

export default Home;
