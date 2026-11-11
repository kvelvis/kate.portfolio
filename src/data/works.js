import car from "../assets/img/car.png";
import bannerKilian from "../assets/img/banner-kilian.png";
import cdMockup from "../assets/img/CD-Mockup-Homework.png";
import cocktailBanner from "../assets/img/cocktail-banner.png";
import cosmos from "../assets/img/cosmos.png";
import flowers from "../assets/img/Flowers-Work-Internet-15.png";
import blending from "../assets/img/illustartor-Blending.png";
import nightCity from "../assets/img/nightcity.png";
import outRun from "../assets/img/Outrun.png";
import titlelist from "../assets/img/titlelist.png";
import travisScott from "../assets/img/Travis-Scott.png";
import snow from "../assets/img/3dsnow.png";
import royalCanin from "../assets/img/Royal-Canin-banner.png";
import city from "../assets/img/city.png";
import know from "../assets/img/know.png";
import day from "../assets/img/day.png";
import apk from "../assets/img/apk.png";
import cat from "../assets/img/cat.png";
import woman from "../assets/img/woman.png";
import character from "../assets/img/character.png";
import mouse from "../assets/img/mouse.png";

// tool: Photoshop | Illustrator | AI
export const works = [
  { src: car, title: "Car", tool: "Photoshop" },
  { src: bannerKilian, title: "Kilian Banner", tool: "Photoshop" },
  { src: cosmos, title: "Cosmos", tool: "Photoshop" },
  { src: royalCanin, title: "Royal Canin", tool: "Photoshop" },
  { src: travisScott, title: "Travis Scott", tool: "Photoshop" },
  { src: know, title: "Know", tool: "Illustrator" },
  { src: titlelist, title: "Titleist", tool: "Photoshop" },
  { src: outRun, title: "Outrun", tool: "Photoshop" },
  { src: woman, title: "Woman", tool: "Photoshop" },
  { src: character, title: "Character", tool: "AI" },
  { src: cat, title: "Cat", tool: "Photoshop" },
  { src: mouse, title: "Mouse", tool: "Illustrator" },
  { src: day, title: "Day", tool: "Photoshop" },
  { src: city, title: "City", tool: "AI" },
  { src: apk, title: "APK", tool: "AI" },
  { src: snow, title: "3D Snow", tool: "Illustrator" },
  { src: flowers, title: "Flowers", tool: "Illustrator" },
  { src: cdMockup, title: "CD Mockup", tool: "Photoshop" },
  { src: cocktailBanner, title: "Cocktail", tool: "Photoshop" },
  { src: blending, title: "Blending", tool: "Illustrator" },
  { src: nightCity, title: "Night City", tool: "Illustrator" },
];

export const workTools = ["All", ...new Set(works.map((w) => w.tool))];
