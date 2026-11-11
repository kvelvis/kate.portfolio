function TypoColors() {
    const colors = ["#0000FF", "#FFFFFF", "#000000", "#E2DACF"]; // blue, white, black, beige
  
    return (
      <div className="container">
        <h2 className="title afronaut-font text-start mt-5">Portfolio info</h2>
  
        {/* Typography */}
        <div className="row">
          <div className="col-12">
            <h1 className="secTitle mt-4">Typography</h1>
  
            <div className="title-wrap d-flex flex-wrap justify-content-center gap-5 mt-4">
              <h3 className="anton m-0">Anton</h3>
              <h3 className="reginy-font m-0">Reginy</h3>
              <h3 className="afronaut-font m-0">Afronaut</h3>
              <h3 className="m-0">Noto Sans</h3>
            </div>
          </div>
        </div>
  
        {/* Colors */}
        <div className="row">
          <div className="col-12">
            <h1 className="secTitle mt-5">Colors</h1>
  
            <div className="row justify-content-center gap-3 mt-4">
              {colors.map((c) => (
                <div key={c} className="col-5 col-sm-3 col-md-2">
                  <div
                    className="p-3 rounded-3 text-center"
                    style={{
                      background: c,
                      border: c.toLowerCase() === "#f5f5dc" ? "1px solid #ddd" : "none",
                      color: c.toLowerCase() === "#000000" ? "#fff" : "#111",
                    }}
                  >
                    <span className="small">{c}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Tech stack */}
        <div className="row m-5 align-items-center justify-content-center">


</div>
</div>
    );
  }
  
  export default TypoColors;
  