import React from "react";

export const HierarchyComponent = props => {
  const { hierarchy, clickEvent } = props;
  const name = hierarchy.name;
  const levels = hierarchy.levels.slice(hierarchy.allMemberName ? 1 : 0);
  if (levels.length === 1) {
    return (
      <li onClick={() => clickEvent(levels[0])} key={0}>
        <a tabIndex="-1">{levels[0].name}</a>
      </li>
    );
  }
  return (
    <li className="dropdown-submenu">
      <a tabIndex="-1">{name}</a>
      <ul className="dropdown-menu">
        {levels.map((level, levelIdx) => {
          return (
            <li onClick={() => clickEvent(level)} key={levelIdx}>
              <a tabIndex="-1">{level.name}</a>
            </li>
          );
        })}
      </ul>
    </li>
  );
};
