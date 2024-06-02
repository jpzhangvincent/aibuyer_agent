import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/appSlice";
import { YOUTUBE_SEARCH_API } from "../utils/constants";
import { cacheResults } from "../utils/searchSlice";
import homeImage from '../images/home.png';

const Head = () => {
  return (
    <div className="grid grid-flow-col p-3 m-1 shadow-lg">
      <div className="flex col-span-5">
      <a href="/">
        <img
          alt="menu"
          className="h-8 cursor-pointer"
          src={homeImage} />
      </a>
      </div>
      <div className="col-span-1">
        <img
          alt="user"
          className="h-8"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR81iX4Mo49Z3oCPSx-GtgiMAkdDop2uVmVvw&usqp=CAU"
        />
      </div>
    </div>
  );
};

export default Head;
