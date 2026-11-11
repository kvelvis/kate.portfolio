import figma from '../assets/img/figma2.png'
function FigmaProject(){
    return (
<div className="figma mt-100px cw">
<div className="title">
    <p className="decoTitle">FIGMA PROJECT</p>
        <h1 className="secTitle m-0">Tano</h1>
</div>
<p className="mx-5 mt-5">**타노(Tano)**는 한국어 단어 학습을 쉽고 꾸준하게 만들어주는 어휘학습 앱이에요.<br/>
알림과 위젯을 통해 매일 자연스럽게 단어를 접하고, 기억력을 높일 수 있도록 도와줍니다.<br/>
요일 시간 단어 빈도 등 세부 설정이 가능해 나에게 맞는 학습 루틴을 만들 수 있어요. </p>
<div className="row d-flex">
    <div className="col col-6">
        <img src={figma} alt="" />
    </div>
    <div className="figma-text col col-6">
        <div className="text-start">요즘 한국에는 다양한 스킨케어 제품들이 넘쳐나고 있어요.<br/>
비타민, 레티놀, AHA, BHA, 나이아신아마이드 등 성분도 너무 다양하죠.<br/>
그래서 어떤 순서로 써야 하는지, 함께 써도 되는지 헷갈릴 때가 많아요.<br/>

**믹스메이트(MixMate)**는 내가 사용하는 제품들을 등록하면<br/>
<ul>
    <li>✔ 어떤 제품끼리 잘 맞는지</li>
    <li>✔ 어떤 조합은 피해야 하는지</li>
    <li>✔ 아침/저녁 언제 쓰는 게 좋은지 등을 한눈에 보여줘요.</li>
</ul>


또한, 사용자들이 직접 공유한 스킨케어 꿀조합과 후기도 확인할 수 있어요.
브랜드가 달라도 안전하고 효과적인 루틴을 만들 수 있게 도와줍니다.
피부 타입, 목적, 상황에 따라 나에게 맞는 추천도 받을 수 있고, 한국어도 완벽 지원!

믹스메이트로 똑똑하고 안전한 스킨케어 시작해보세요.</div>
    </div>
</div>
</div>
    )
}
export default FigmaProject