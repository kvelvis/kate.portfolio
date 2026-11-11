import { Fragment } from "react";

/** Chelyabinsk ——→ Busan ——→ Seoul (линии «прорисовываются» через CSS-анимацию) */
export default function CityRoute({ cities }) {
  return (
    <ol className="city-route" aria-label="Route">
      {cities.map((c, i) => (
        <Fragment key={c}>
          <li className="city-route__city">
            <span className="t-mono t-muted">0{i + 1}</span>
            {c}
          </li>
          {i < cities.length - 1 && <li className="city-route__line" aria-hidden="true" />}
        </Fragment>
      ))}
    </ol>
  );
}
