import React, { createContext, useState } from 'react';
import { User } from 'types';

import { ContextProviderType } from './types';

export const UserContext = createContext<{
  user?: User | null | undefined;
  setUser: React.Dispatch<
    React.SetStateAction<User | null | undefined>
  >;
  isSet: boolean;
  setIsSet: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  user: null,
  setUser: () => undefined,
  isSet: false,
  setIsSet: () => undefined,
});

export const UserContextProvider: React.FC<ContextProviderType> = ({
  children,
}: ContextProviderType) => {
  const [user, setUser] = useState<
    User | null | undefined
  >();
  const [isSet, setIsSet] = useState<boolean>(false);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isSet,
        setIsSet,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
