import car from "./img/car.png";
import bannerKilian from "./img/banner-kilian.png";
import cdMockup from "./img/CD-Mockup-Homework.png";
import cocktailBanner from "./img/cocktail-banner.png";
import cosmos from "./img/cosmos.png";
import flowers from "./img/Flowers-Work-Internet-15.png";
import blending from "./img/illustartor-Blending.png";
import nightCity from "./img/nightcity.png";
import outRun from "./img/Outrun.png";
import titlelist from "./img/titlelist.png";
import travisScott from "./img/Travis-Scott.png";
import snow from "./img/3dsnow.png";
import royalCanin from "./img/Royal-Canin-banner.png";
import city from "./img/city.png";
import know from "./img/know.png";
import day from "./img/day.png";
import apk from "./img/apk.png";
import cat from "./img/cat.png";
import woman from "./img/woman.png";
import character from "./img/character.png";
import mouse from "./img/mouse.png";

// tool: Photoshop | Illustrator | AI
// title / context: TODO: Kate — real title and one-line context (what, for whom, goal)
export const works = [
  { src: car, title: "Car", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: bannerKilian, title: "Kilian Banner", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: cosmos, title: "Cosmos", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: royalCanin, title: "Royal Canin", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: travisScott, title: "Travis Scott", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: know, title: "Know", context: "", tool: "Illustrator" }, // TODO: Kate — real title + context
  { src: titlelist, title: "Titleist", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: outRun, title: "Outrun", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: woman, title: "Woman", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: character, title: "Character", context: "", tool: "AI" }, // TODO: Kate — real title + context
  { src: cat, title: "Cat", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: mouse, title: "Mouse", context: "", tool: "Illustrator" }, // TODO: Kate — real title + context
  { src: day, title: "Day", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: city, title: "City", context: "", tool: "AI" }, // TODO: Kate — real title + context
  { src: apk, title: "APK", context: "", tool: "AI" }, // TODO: Kate — real title + context
  { src: snow, title: "3D Snow", context: "", tool: "Illustrator" }, // TODO: Kate — real title + context
  { src: flowers, title: "Flowers", context: "", tool: "Illustrator" }, // TODO: Kate — real title + context
  { src: cdMockup, title: "CD Mockup", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: cocktailBanner, title: "Cocktail", context: "", tool: "Photoshop" }, // TODO: Kate — real title + context
  { src: blending, title: "Blending", context: "", tool: "Illustrator" }, // TODO: Kate — real title + context
  { src: nightCity, title: "Night City", context: "", tool: "Illustrator" }, // TODO: Kate — real title + context
];

export const workTools = ["All", ...new Set(works.map((w) => w.tool))];
