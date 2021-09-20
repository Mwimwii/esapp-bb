import React, { useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";

import { UserContext } from 'global-state';
import { getApi } from 'api';
import { BottomBar, RoundedBox } from 'components';

const Dashboard: React.FC = () => {
  const history = useHistory();

  const { user } = useContext(UserContext);

  useEffect(() => {
    async function fetchMyAPI() {
      let response = await getApi()
      console.log(response)
    }

    console.log(user)
    if (!user) {
      //history.push('/login');
    } else {
      fetchMyAPI()
    }
  }, [history, user])
  return (
      <div className="flex flex-col bg-white h-screen justify-between">
        <div className="w-full pt-20 px-4">
          <h1 className="text-2xl font-bold mb-10 text-beige-900 text-center">Overall</h1>
          <div className="flex space-between justify-center space-x-2">
              <RoundedBox color="bg-beige-900">
                  <div className="text-green-300 text-md">1 320</div>
                  <div className="text-white text-sm font-light">Tenants</div>
              </RoundedBox>
              <RoundedBox color="bg-beige-900">
                  <div className="text-green-300 text-md">125 024 UGX</div>
                  <div className="text-white text-sm font-light">Collected today</div>
              </RoundedBox>
          </div>
          <div className="">
          </div>
        </div>
        <BottomBar />
      </div>
    )
}

export default Dashboard;

