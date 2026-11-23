// Projects on the sphere and in the project list.
// `image` is the still, `gif` the animated preview (decoded by webgl/gif.js).
// Text: a string or { ko, en }.

import catPoster from "../assets/video/cat-poster.webp";
import hanmiImg from "../assets/work/hanmi.jpg";
import siyazuImg from "../assets/work/siyazu.jpg";
import catGif from "../assets/work/cat.gif";
import siyazuGif from "../assets/work/siyazu.gif";
import feevGif from "../assets/work/feev.gif";
import danoGif from "../assets/work/danoapp.gif";
import cubeGif from "../assets/work/cubehos.gif";

// files in public/ (the site may live in a sub-folder, e.g. GitHub Pages)
const pub = (path) => import.meta.env.BASE_URL + path;

// `hidden: true` keeps a project in the file but off the site
const all = [
  {
    id: "siyazu",
    title: { ko: "시야주", en: "Siyazu", ru: "Siyazu" },
    category: { ko: "리디자인 · 커머스", en: "Redesign · Commerce", ru: "Редизайн · e-commerce" },
    year: "2026",
    image: siyazuImg,
    gif: siyazuGif,
    href: "/cases/siyazu/index.html",
    caseStudy: "siyazu",
    // marked on the sphere caption, the project panel and the list
    flag: "Full purchase flow", // same English label in every language
  },
  {
    id: "gatto",
    title: { ko: "묘한 커피", en: "Myohan Coffee", ru: "Myohan Coffee" },
    category: { ko: "브랜딩 · 웹사이트", en: "Branding · Website", ru: "Брендинг · сайт" },
    year: "2026",
    image: catPoster,
    gif: catGif,
    href: "/cases/cat cafe/renew/index.html",
    caseStudy: "gatto",
    desc: {
      ko: "고양이 입양 카페 브랜딩 & 웹사이트 컨셉.",
      en: "Branding and a website concept for a cat-adoption café.",
      ru: "Брендинг и концепт сайта для кафе, где можно взять кота из приюта.",
    },
  },
  {
    id: "dano",
    title: { ko: "단어", en: "Dano", ru: "Dano" },
    category: { ko: "앱 · Weavy, Kling", en: "App · Weavy, Kling", ru: "Приложение · Weavy, Kling" },
    year: "2026",
    gif: danoGif,
    // wide screens: an iPhone with the live Figma prototype replaces the image (outer w / h of the phone)
    phone: 421 / 880,
    href: "",
    caseStudy: "dano",
    desc: {
      ko: "알림으로 배우는 한국어 단어 앱 · 개인 프로젝트.",
      en: "A Korean vocabulary app you learn from your notifications · personal project.",
      ru: "Приложение для изучения корейских слов по уведомлениям · личный проект.",
    },
  },
  {
    id: "feev",
    title: "FEEV",
    category: { ko: "리디자인 · 캠페인", en: "Redesign · Campaign", ru: "Редизайн · кампания" },
    year: "2026",
    image: pub("cases/feev/img/web/main-girl-1376.webp"),
    gif: feevGif,
    href: "/cases/feev/index.html",
    caseStudy: "feev",
  },
  {
    id: "hanmi",
    title: { ko: "한미반도체", en: "Hanmi Semiconductor", ru: "Hanmi Semiconductor" },
    category: { ko: "리디자인 · 기업 사이트", en: "Redesign · Corporate", ru: "Редизайн · корпоративный сайт" },
    year: "2026",
    image: hanmiImg,
    href: "/cases/hanmi/index.html",
    caseStudy: "hanmi",
    desc: {
      ko: "B2B 반도체 장비 기업 사이트 리디자인. 주요 페이지 15개와 A/S 엔지니어 캐릭터.",
      en: "A redesign of a B2B semiconductor equipment maker’s site: 15 key pages and an A/S engineer character.",
      ru: "Редизайн сайта B2B-производителя оборудования для полупроводников: 15 ключевых страниц и персонаж — инженер сервисной службы.",
    },
  },
  {
    id: "cube",
     title: { ko: "큐브성형외과의원", en: "Cube Clinic", ru: "Cube Clinic" },
    category: { ko: "메디컬", en: "Medical", ru: "Медицина" },
    year: "2026",
    gif: cubeGif,
    image: pub("cases/cubehospital/img/photos/welcome-bg-1600.jpg"),
    href: "/cases/cubehospital/index.html",
    caseStudy: "cube",
    desc: {
      ko: "가상의 성형외과 웹사이트. 첫 화면에서 바로 상담 예약까지 이어지도록 설계.",
      en: "A website for a fictional plastic surgery clinic, built so visitors can book a consultation from the first screen.",
      ru: "Сайт вымышленной клиники пластической хирургии.",
    },
  },
];

export const work = all.filter((w) => !w.hidden);
