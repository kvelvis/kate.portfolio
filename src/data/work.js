// Projects on the sphere and in the project list.
// `image` is the still, `gif` the animated preview (decoded by webgl/gif.js).
// Text: a string or { ko, en }.

import catPoster from "../assets/video/cat-poster.webp";
import fairyPoster from "../assets/video/fairy-poster.webp";
import celine27Img from "../assets/work/celine.jpg";
import hanmiImg from "../assets/work/hanmi.jpg";
import siyazuImg from "../assets/work/siyazu.jpg";
import celineGif from "../assets/work/celine.gif";
import catGif from "../assets/work/cat.gif";
import fairyGif from "../assets/work/fairytail.gif";
import siyazuGif from "../assets/work/siyazu.gif";
import feevGif from "../assets/work/feev.gif";
import danoGif from "../assets/work/danoapp.gif";
import cubeGif from "../assets/work/cubehos.gif";

// files in public/ (the site may live in a sub-folder, e.g. GitHub Pages)
const pub = (path) => import.meta.env.BASE_URL + path;

export const work = [
  {
    id: "celine27",
    title: "Celine 2027",
    category: { ko: "캠페인 웹사이트", en: "Campaign website" },
    year: "2026",
    image: celine27Img,
    gif: celineGif,
    href: "/cases/celine/renew/index.html",
    caseStudy: "celine27",
    desc: {
      ko: "컬렉션 캠페인 웹사이트 “The Art of Being Elsewhere”",
      en: "A collection campaign website: “The Art of Being Elsewhere”",
    },
  },
  {
    id: "gatto",
    title: "묘한 커피",
    category: { ko: "브랜딩 · 웹사이트", en: "Branding · Website" },
    year: "2026",
    image: catPoster,
    gif: catGif,
    href: "/cases/cat cafe/renew/index.html",
    caseStudy: "gatto",
    desc: {
      ko: "고양이 입양 카페 브랜딩 & 웹사이트 컨셉.",
      en: "Branding and a website concept for a cat-adoption café.",
    },
  },
  {
    id: "dano",
    title: "Dano 단어",
    category: { ko: "앱 · Weavy, Kling", en: "App · Weavy, Kling" },
    year: "2026",
    gif: danoGif,
    href: "",
    caseStudy: "dano",
    desc: {
      ko: "알림으로 배우는 한국어 단어 앱 · 개인 프로젝트.",
      en: "A Korean vocabulary app you learn from your notifications · personal project.",
    },
  },
  {
    id: "feev",
    title: "FEEV",
    category: { ko: "리디자인 · 캠페인", en: "Redesign · Campaign" },
    year: "2026",
    image: pub("cases/feev/img/web/main-girl-1376.webp"),
    gif: feevGif,
    href: "/cases/feev/index.html",
    caseStudy: "feev",
    desc: {
      ko: "K-뷰티 브랜드 FEEV 웹사이트 리디자인. 버블 글로스 출시 캠페인 “POP that Bubble!”",
      en: "A website redesign for K-beauty brand FEEV: the bubble gloss launch campaign “POP that Bubble!”",
    },
  },
  {
    id: "hanmi",
    title: "Hanmi Semiconductor",
    category: { ko: "리디자인 · 기업 사이트", en: "Redesign · Corporate" },
    year: "2026",
    image: hanmiImg,
    href: "/cases/hanmi/index.html",
    caseStudy: "hanmi",
    desc: {
      ko: "B2B 반도체 장비 기업 사이트 리디자인. 주요 페이지 15개와 A/S 엔지니어 캐릭터.",
      en: "A redesign of a B2B semiconductor equipment maker’s site: 15 key pages and an A/S engineer character.",
    },
  },
  {
    id: "fairy",
    title: "별빛 동화",
    category: { ko: "인터랙티브 · 스토리텔링", en: "Interactive · Storytelling" },
    year: "2026",
    image: fairyPoster,
    gif: fairyGif,
    href: "/cases/fairy/index.html",
    caseStudy: "fairy",
    desc: {
      ko: "GSAP 스크롤 스토리텔링 웹사이트. 그림으로 읽는 네 편의 이야기.",
      en: "A GSAP scroll-storytelling site: four stories told in pictures.",
    },
  },
  {
    id: "cube",
    title: "Cube Clinic",
    category: { ko: "메디컬", en: "Medical" },
    year: "2026",
    gif: cubeGif,
    image: pub("cases/cubehospital/img/photos/welcome-bg-1600.jpg"),
    href: "/cases/cubehospital/index.html",
    caseStudy: "cube",
    desc: {
      ko: "가상의 성형외과 웹사이트. 첫 화면에서 바로 상담 예약까지 이어지도록 설계.",
      en: "A website for a fictional plastic surgery clinic, built so visitors can book a consultation from the first screen.",
    },
  },
  {
    id: "siyazu",
    title: "Siyazu",
    category: { ko: "리디자인 · 커머스", en: "Redesign · Commerce" },
    year: "2026",
    image: siyazuImg,
    gif: siyazuGif,
    href: "/cases/siyazu/index.html",
    caseStudy: "siyazu",
    desc: {
      ko: "미니멀 여성복 브랜드 · 에디토리얼 커머스 웹사이트 리디자인.",
      en: "A website redesign for a minimal womenswear label, built as editorial commerce.",
    },
  },
];
