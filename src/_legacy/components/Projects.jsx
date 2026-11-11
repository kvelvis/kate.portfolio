import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Button from './utility/Button.jsx'
import  CaseBox  from './utility/CaseBox.jsx';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from "react-router-dom";
import celineGif from "../assets/gif/celine.gif";
import weekndGif from "../assets/gif/weeknd.gif";
import fashionGif from "../assets/gif/fashion.gif";
import tamburinsGif from "../assets/gif/tamburins.gif";
import catGif from '../assets/gif/cat.gif';
import sanrioGif from '../assets/gif/sanrio.gif';

import know from '../assets/img/know.png';



function Projects() {
  return (
    <div className="mt-100px cw">
      <p className="decoTitle">CASES</p>
      <h1 className="secTitle m-0">PORTFOLIO</h1>

    <div className="row">
    <CaseBox
        href="/cases/celine/celine.html"
        title="10by10 Project"
        imgSrc={celineGif}
        className="highlight col col-4"
      />
       <CaseBox
        href="/cases/10by10/10by10.html"
        title="10by10 Project"
        imgSrc={weekndGif}
        className="highlight  col col-4"
      />
       <CaseBox
        href="/cases/10by10/10by10.html"
        title="10by10 Project"
        imgSrc={fashionGif}
        className="highlight  col col-4"
      />
         <CaseBox
        href="/cases/10by10/10by10.html"
        title="10by10 Project"
        imgSrc={tamburinsGif}
        className="highlight  col col-4"
      />

              <CaseBox
        href="/cases/10by10/10by10.html"
        title="10by10 Project"
        imgSrc={sanrioGif}
        className="highlight  col col-4"
      />
              <CaseBox
        href="/cases/10by10/10by10.html"
        title="10by10 Project"
        imgSrc={catGif}
        className="highlight  col col-4"
      />

    </div>
    <Button title="See more cases" 
     href="../CasesDetails" />

    </div>
  );
}

export default Projects;
