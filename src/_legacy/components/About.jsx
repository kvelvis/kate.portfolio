import React from "react";
import Avatar from "../assets/img/img.png";
import Circle from "../assets/img/circle2.png";
function About() {
  const skills = [
    { name: "HTML", level: 95 },
    { name: "CSS/SCSS", level: 95 },
    { name: "JQUERY", level: 80 },
    { name: "JAVASCRIPT", level: 85 },
    { name: "PHOTOSHOP", level: 75 },
    { name: "ILLUSTRATOR", level: 90 },
    { name: "FIGMA", level: 75 },
    { name: "GIT", level: 90 },
    { name: "BLENDER", level: 90 },
  ];

  const education = [
    { year: "2012-2014", desc: "러시아 외교관 고등학교" },
    { year: "2014-2016", desc: "부산대학교 언어교육관" },
    { year: "2016-2020", desc: "부산대학교 경영학 졸업" },
    { year: "2023.05-11", desc: "이젠컴퓨터아카데미" },
  ];

  return (
    <div className="about-wrap mt-100px mx-3">
       <div className="d-flex align-items-end">
         <h2 className="title afronaut-font text-center text-lg-start">about</h2>
         <h5 className="mb-3 ms-3 d-block">&#123;background&#125;</h5>
       </div>
        <p className="intro cw m-5 mx-auto">"안녕하세요. 저는 러시아에서 왔고 한국에 13년차 <br/>  부산대학교 경영학과 졸업하고 국비지원 전문교육 프론트엔드 개발자 6개월치 <br/> 수료한 웹디자이너 케이트라고 합니다."</p> 
      <div className="row sect-wrap mt-5">
        
        {/* Skills */}
        <div className="col col-12 col-lg-6">
          <h4 className="section-title anton text-center text-lg-start">
            SKILLS
          </h4>
          <div className="skills">
            {skills.map((skill, index) => (
              <div className="skill-bar" key={index}>
                <div className="skill-name">{skill.name}</div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <div className="skill-percent">{skill.level}%</div>
              </div>
            ))}
          </div>
        </div>
        {/* Education */}
        <div className="col col-12 col-lg-6">
          <div className="d-flex">
            <div className="edu-list ms-5">
              <h4 className="section-title anton text-center text-lg-start">
                EDUCATION
              </h4>
              <div className="timeline d-flex flex-column align-items-center align-items-lg-start ">
                {education.map((item, index) => (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-year text-start">{item.year}</div>
                    <div className="timeline-dot-line">
                      <div className="timeline-dot" />
                      {index !== education.length - 1 && (
                        <div className="timeline-line" />
                      )}
                    </div>
                    <div className="timeline-text">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <ul className="lang text-center text-lg-start ps-0 ps-lg-5">
              <li>
                {" "}
                <h4 className="section-title anton text-center text-lg-start">
                  LANGUAGE
                </h4>
              </li>
              <li>
                <span>2022.04</span>한국어 6급 TOPIK
              </li>
              <li>
                <span>2022.12</span>영어 875점 TOEIC
              </li>
              <li>
                <span>1996.9</span>러시아어 원어민
              </li>
            </ul>
          </div>
          <ul className="license text-center text-lg-start ps-0 ps-lg-5 mt-5 ">
            <li>
              <h4 className="section-title anton text-center text-lg-start">
                LICENSE
              </h4>
            </li>
            <li>
              <span className="text-start">2020.07</span>
              컴퓨터그래픽디자인응융사
            </li>
            <li>
              <span>2020.07</span>웹디자인기능사
            </li>
            <li>
              <span>2020.07</span>2종보통
            </li>
            <li>
              <span>2020.07</span>meta front end developer{" "}
            </li>
            <li>
              <span>2020.07</span>Google UI/UX designer{" "}
            </li>
          </ul>
         
        </div>
      </div>
     
      {/* <div className="col sect4">
        <div className="avatar-wrap mt-5 text-start">
          <img src={Avatar} alt="" className="avatar" />
          <img src={Circle} alt=""
          className="circle" />
        
        </div>
        <p className="mt-0">"안녕하세요. 저는 러시아에서 왔고 한국에 12년차 부산대학교 경영학과 졸업하고 국비지원 전문교육 프론트엔드 개발자 6개월치 수료한 웹디자이너 케이트라고 합니다."</p>
      </div> */}
    </div>
  );
}

export default About;
