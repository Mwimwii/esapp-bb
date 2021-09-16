import React, { useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";

import { UserContext } from 'global-state';
import { getApi } from 'api';

const Home: React.FC = () => {
  const history = useHistory();

  const { user } = useContext(UserContext);

  useEffect(() => {
    async function fetchMyAPI() {
      let response = await getApi()
      console.log(response)
    }

    if (!user) {
      history.push('/login');
    } else {
      fetchMyAPI()
    }
  }, [history, user])
  return (
      <div className="bg-green h-screen grid">
        <div className="w-3/4 my-auto ml-20">
          <h1 className="text-5xl font-bold mb-10 text-white">Titl</h1>
          <p className="text-beige">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo officia earum ducimus neque obcaecati consequuntur ratione accusamus at officiis tempore,
            magnam non debitis fugit unde alias id quidem necessitatibus.
          </p>
        </div>
      </div>
    )
}

export default Home;
