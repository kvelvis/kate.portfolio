import React, { useRef, useEffect, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import car from "./assets/img/car.png";
import bannerKilian from "./assets/img/banner-kilian.png";
import CDMockupHomework from "./assets/img/CD-Mockup-Homework.png";
import cocktailBanner from "./assets/img/cocktail-banner.png";
import cosmos from "./assets/img/cosmos.png";
import flowersWorkInternet from "./assets/img/flowers-Work-Internet-15.png";
import illustratorBlening from "./assets/img/illustartor-Blending.png";
import nightCity from "./assets/img/nightCity.png";
import outRun from "./assets/img/outRun.png";
import titlelist from "./assets/img/titlelist.png";
import travisScott from "./assets/img/Travis-Scott.png";
import snow from "./assets/img/3dsnow.png";
import royalCaninBanner from "./assets/img/Royal-Canin-Banner.png";
import city from "./assets/img/city.png";
import know from "./assets/img/know.png";
import day from "./assets/img/day.png";
import apk from "./assets/img/apk.png";
import cat from "./assets/img/cat.png";
import woman from "./assets/img/woman.png";
import character from "./assets/img/character.png";
import mouse from "./assets/img/mouse.png";

const slidesData = [
  { imgSrc: car, desc: "Photoshop" },
  { imgSrc: bannerKilian, desc: "Photoshop" },
  { imgSrc: cosmos, desc: "Photoshop" },
  { imgSrc: royalCaninBanner, desc: "Photoshop" },
  { imgSrc: travisScott, desc: "Photoshop" },
  { imgSrc: know, desc: "Illustrator" },
  { imgSrc: titlelist, desc: "Photoshop" },
  { imgSrc: outRun, desc: "Photoshop" },
  { imgSrc: woman, desc: "Photoshop" },
  { imgSrc: character, desc: "AI" },
  { imgSrc: cat, desc: "Photoshop" },
  { imgSrc: mouse, desc: "Illustrator" },
  { imgSrc: day, desc: "Photoshop" },
  { imgSrc: city, desc: "AI" },
  { imgSrc: apk, desc: "AI" },
  { imgSrc: snow, desc: "Illustrator" },
  { imgSrc: flowersWorkInternet, desc: "Illustrator" },
  { imgSrc: CDMockupHomework, desc: "Photoshop" },
  { imgSrc: cocktailBanner, desc: "Photoshop" },
  { imgSrc: illustratorBlening, desc: "Illustrator" },
  { imgSrc: nightCity, desc: "Illustrator" },
];

function Slider() {
  const swiperRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const SLIDE_HEIGHT = 350;
  const INACTIVE_WIDTH = 100;
  const MAX_ACTIVE_WIDTH = 600;

  const categories = useMemo(() => {
    const catSet = new Set();
    slidesData.forEach((slide) => {
      if (slide.desc) catSet.add(slide.desc);
    });
    return ["All", ...Array.from(catSet)];
  }, []);

  const filteredSlides = useMemo(() => {
    if (selectedCategory === "All") return slidesData;
    return slidesData.filter(
      (slide) =>
        slide.desc &&
        slide.desc.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory]);

  function adjustSlideWidths(swiper) {
    if (!swiper || !swiper.slides) return;

    swiper.slides.forEach((slideEl, domIndex) => {
      const img = slideEl.querySelector("img");
      if (!img || !img.naturalWidth || !img.naturalHeight) return;

      const ratio = img.naturalWidth / img.naturalHeight;
      const isActive = swiper.activeIndex === domIndex;

      let widthPx = isActive ? SLIDE_HEIGHT * ratio : INACTIVE_WIDTH;
      if (isActive && MAX_ACTIVE_WIDTH && widthPx > MAX_ACTIVE_WIDTH) {
        widthPx = MAX_ACTIVE_WIDTH;
      }
      slideEl.style.width = `${widthPx}px`;
      slideEl.style.height = `${SLIDE_HEIGHT}px`;
    });

    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateSlidesClasses();
    swiper.updateProgress();
  }

  function onSwiperInit(swiper) {
    swiperRef.current = swiper;

    swiper.on("imagesReady", () => adjustSlideWidths(swiper));
    swiper.on("slideChange", () => setTimeout(() => adjustSlideWidths(swiper), 0));

    swiper.on("click", () => {
      const clicked = swiper.clickedIndex;
      if (typeof clicked === "number" && clicked >= 0) {
        swiper.slideTo(clicked);
        setTimeout(() => adjustSlideWidths(swiper), 0);
      }
    });

    setTimeout(() => adjustSlideWidths(swiper), 200);

    const handleResize = () => adjustSlideWidths(swiper);
    window.addEventListener("resize", handleResize);
    swiper.__handleResize = handleResize;
  }

  useEffect(() => {
    return () => {
      const swiper = swiperRef.current;
      if (swiper && swiper.__handleResize) {
        window.removeEventListener("resize", swiper.__handleResize);
      }
    };
  }, []);

  return (
    <div className="slide my-4">
      <ul className="d-flex justify-content-center gap-3 graphic">
        {categories.map((cat) => (
          <li
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              if (swiperRef.current) {
                setTimeout(() => {
                  swiperRef.current.slideTo(0);
                }, 50);
              }
            }}
            style={{
              cursor: "pointer",
              fontWeight: selectedCategory === cat ? "bold" : "normal",
              textDecoration: selectedCategory === cat ? "underline" : "none",
            }}
          >
            {cat}
          </li>
        ))}
      </ul>

      <div className="container graphic-swiper">
        <Swiper
          key={selectedCategory}
          modules={[Pagination]}
          grabCursor={true}
          initialSlide={0}
          centeredSlides={true}
          slidesPerView="auto"
          spaceBetween={20}
          loop={false}
          pagination={{ clickable: true }}
          slideToClickedSlide={true}
          onSwiper={onSwiperInit}
          breakpoints={{
            320: { spaceBetween: 10 },
            650: { spaceBetween: 20 },
            1000: { spaceBetween: 15 },
          }}
        >
          {filteredSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img
                src={slide.imgSrc}
                className="slideImg"
                alt={`slide-${index}`}
                onLoad={() => {
                  if (swiperRef.current) adjustSlideWidths(swiperRef.current);
                }}
                onClick={() => {
                  if (swiperRef.current) {
                    swiperRef.current.slideTo(index);
                    setTimeout(() => adjustSlideWidths(swiperRef.current), 0);
                  }
                }}
                style={{ cursor: "pointer" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Slider;
