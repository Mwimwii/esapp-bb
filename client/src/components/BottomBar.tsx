import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { StackedIconButton } from 'components';
import { ReactComponent as DashboardIcon } from 'assets/dashboard.svg';
import { ReactComponent as TenantsIcon } from 'assets/tenants.svg';
import { ReactComponent as CommunicateIcon } from 'assets/communicate.svg';
import { ReactComponent as ProfileIcon } from 'assets/profile.svg';

const BottomBar: React.FC =() => {
  const history = useHistory();
  const location = useLocation();
  console.log(location)

  const routeClick = (route: string) => {
    history.push(`/${route}`);
  }

  return (
    <div className="bg-beige-900 w-full">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex flex-col items-stretch justify-center py-3 px-3">
          <div className="grid grid-flow-col gap-5 text-xs auto-cols-fr">
            <StackedIconButton
              icon={DashboardIcon}
              onClick={e => routeClick('dashboard')}
              label="Dashboard"
              active={location.pathname === '/dashboard'}
            />
            <StackedIconButton
              icon={TenantsIcon}
              onClick={e => routeClick('tenants')}
              label="Tenants"
              active={location.pathname === '/tenants'}
            />
              <StackedIconButton
              icon={CommunicateIcon}
              onClick={e => routeClick('communicate')}
              label="Communicate"
              active={location.pathname === '/communicate'}
            />
              <StackedIconButton
                icon={ProfileIcon}
                onClick={e => routeClick('profile')}
                label="Profile"
                active={location.pathname === '/profile'}
              />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomBar;

