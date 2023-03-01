import React, { FC } from "react";

interface P {
  header: string;
  search: boolean;
}

// React Start from here
const Header: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // return

  return (
    <>
      <h3 className="main-header">
        <div className="main-header-right">{props.header}</div>
        <div className="main-header-left">
        </div>
      </h3>
    </>
  );
};

export default Header;
