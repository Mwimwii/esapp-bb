import React from 'react';

interface Props {
  color: string;
}

const RoundedBox: React.FC<Props> =({
  children,
  color,
}) => {
  return (
    <div className={`${color} w-1/2 rounded-lg p-2`}>
      {children}
    </div>
  )
}

export default RoundedBox;
