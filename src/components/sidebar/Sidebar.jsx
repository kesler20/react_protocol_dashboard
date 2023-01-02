import React from "react";
import { links, googleLinks } from "../../data/links";
import Divider from "../divider/Divider";

const SidebarIcon = (props) => {
  return (
    <div className="sidebar-icon group">
      {props.icon}{" "}
      <span className="sidebar-tooltip scale-0 group-hover:scale-100">
        {props.tooltip}
      </span>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="fixed tpp-0 left-0 h-screen w-16 flex flex-col bg-gray-50 text-white shadow-lg pt-24">
      {links.map((link, index) => {
        return <SidebarIcon key={index} icon={link.icon} tooltip={link.name} />;
      })}
      <Divider />
      {googleLinks.map((link, index) => {
        return <SidebarIcon key={index} icon={link.icon} tooltip={link.name} />;
      })}
    </div>
  );
};

export default Sidebar;
