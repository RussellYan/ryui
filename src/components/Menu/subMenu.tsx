import React, { useContext, useState, Fragment } from 'react';
import classNames from 'classnames';
import { MenuContext } from './menu';
import { MenuItemProps } from './menuItem';

export interface SubMenuProps {
  index?: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const SubMenu: React.FC<SubMenuProps> = ({
  index,
  title,
  className,
  style,
  children,
  disabled = false,
}) => {
  const { defaultOpenMenus = [], mode, index: CIndex } = useContext(MenuContext);
  const isVertical = mode === 'vertical';
  const isOpened = index && isVertical ? defaultOpenMenus.includes(index) : false;
  const [menuOpen, setOpen] = useState<boolean>(isOpened)
  const classes = classNames('ry-menu-item', 'ry-submenu-container', {
    'is-active': CIndex === index
  });
  console.log('mark: ====> ', index, defaultOpenMenus);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(!menuOpen);
  }
  let timer: any;
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer);
    e.preventDefault();
    timer = setTimeout(() => {
      setOpen(toggle);
    }, 0);
  }
  const clickEvents = isVertical ? { onClick: handleClick } : {};
  const hoverEvents = !isVertical ? {
    onMouseEnter: (e: React.MouseEvent) => { handleMouse(e, true) },
    onMouseLeave: (e: React.MouseEvent) => { handleMouse(e, false) },
  }: {};
  const renderChildren = () => {
    const subMenuClasses = classNames('ry-submenu', {'ry-menu-opened': menuOpen});
    const childrenComp = React.Children.map(children, (child, i) => {
      const childElement = child as React.FunctionComponentElement<MenuItemProps>;
      if (childElement.type.displayName === 'MenuItem') {
        return React.cloneElement(childElement, { index: `${index}-${i}`});
      } else {
        console.error('warning: menu has a child which is not a MenuItem')
      }
    })
    return (
      <ul className={subMenuClasses}>
        {childrenComp}
      </ul>
    )
  }
  return (
    <li key={index} className={classes} {...hoverEvents}>
      <div className="ry-submenu-tittle" {...clickEvents}>
        {title}
      </div>
      {renderChildren()}
    </li>
  )
}

SubMenu.displayName = 'SubMenu';
export default SubMenu;