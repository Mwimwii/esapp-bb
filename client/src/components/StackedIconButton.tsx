import React from 'react';
import classNames from 'classnames';

import { SVGComponent } from './types';
import Icon from './Icon';

// won't be needed soon
import './dynamic.css';

interface Props
  extends Pick<React.HTMLProps<HTMLButtonElement>, 'onClick' | 'disabled'> {
  icon: SVGComponent;
  label: string;
  iconSize?: number;
  active: boolean;
}

const StackedIconButton: React.FC<Props> = ({
  icon,
  iconSize = 20,
  label,
  onClick,
  disabled,
  active,
}) => {
  // todo use actual hash of the color?
  // https://tailwindcss.com/docs/just-in-time-mode#known-limitations
  const color = active ? 'green-40' : 'white';

  return (
    <button
      className={classNames(
        'relative flex flex-col items-center p-2 hover:bg-green-40',
        {
          //'bg-dangerBg hover:bg-dangerBg focus:bg-dangerBg': showDangerBg,
          //'hover:bg-black focus:bg-black': !disabled,
          //'opacity-60 cursor-default pointer-events-none': disabled,
        }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon svg={icon} size={iconSize} color={color} />
      <span className={`block text-${color}`}>{label}</span>
    </button>
  );
};

export default StackedIconButton;

