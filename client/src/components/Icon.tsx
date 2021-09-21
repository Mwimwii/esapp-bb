import React from 'react';
import classNames from 'classnames';
import { SVGComponent } from './types';

interface Props {
  /** The fill color of the icon. Uses Tailwind colors (e.g.: 'green-500') */
  color?: string;
  /**
   * Text a screenreader will read aloud when it gets to the icon
   */
  label?: string;
  /** The width and height of the icon */
  size?: number;
  /** The SVG we're rendering */
  svg: SVGComponent;
}

const Icon: React.FC<Props> = ({
  svg: Svg,
  size = 20,
  color,
  label,
}) => (
  <Svg
    preserveAspectRatio="xMinYMin meet"
    viewBox={'0 0 20 20'}
    width={size}
    className={classNames('fill-current', { [`text-${color}`]: color })}
    aria-label={label}
  />
);

export default Icon;
