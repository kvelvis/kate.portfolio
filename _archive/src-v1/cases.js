import celineMp4 from "../assets/video/celine.mp4";
import celineWebm from "../assets/video/celine.webm";
import celinePoster from "../assets/video/celine-poster.webp";
import weekndMp4 from "../assets/video/weeknd.mp4";
import weekndWebm from "../assets/video/weeknd.webm";
import weekndPoster from "../assets/video/weeknd-poster.webp";
import fashionMp4 from "../assets/video/fashion.mp4";
import fashionWebm from "../assets/video/fashion.webm";
import fashionPoster from "../assets/video/fashion-poster.webp";
import tamburinsMp4 from "../assets/video/tamburins.mp4";
import tamburinsWebm from "../assets/video/tamburins.webm";
import tamburinsPoster from "../assets/video/tamburins-poster.webp";
import sanrioMp4 from "../assets/video/sanrio.mp4";
import sanrioWebm from "../assets/video/sanrio.webm";
import sanrioPoster from "../assets/video/sanrio-poster.webp";
import catMp4 from "../assets/video/cat.mp4";
import catWebm from "../assets/video/cat.webm";
import catPoster from "../assets/video/cat-poster.webp";
import fairyMp4 from "../assets/video/fairy.mp4";
import fairyWebm from "../assets/video/fairy.webm";
import fairyPoster from "../assets/video/fairy-poster.webp";

const video = (mp4, webm, poster) => ({ mp4, webm, poster });

export const featuredCases = [
  { title: "Gatto", type: "Cafe website redesign", href: "/cases/cat cafe/renew/index.html", caseStudy: "gatto", cover: video(catMp4, catWebm, catPoster) },
  { title: "Celine", type: "Brand renewal", href: "/cases/celine/celine.html", caseStudy: "celine", cover: video(celineMp4, celineWebm, celinePoster) },
  { title: "Cube Hospital", type: "Medical", href: "/cases/cubehospital/index.html" },
  { title: "Fairy Tales", type: "Illustrated stories", href: "/cases/fairy/index.html", cover: video(fairyMp4, fairyWebm, fairyPoster) },
];

export const moreCases = [
  { title: "The Weeknd", type: "Artist landing", href: "/cases/weeknd/weeknd.html", cover: video(weekndMp4, weekndWebm, weekndPoster) },
  { title: "THOMe", type: "Beauty", href: "/cases/thome/index.html" },
  { title: "Blue House", type: "Swiper study", href: "/cases/bluehouse/main.html" },
  { title: "Mugobox", type: "Swiper study", href: "/cases/mugobox/mugo.html" },
];
