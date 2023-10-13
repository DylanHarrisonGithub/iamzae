import React from "react";

const NoPage: React.FC<any> = (props: any) => {
  return (
    <div className="pt-16">PAGE MISSING
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
                <feColorMatrix
                    type="matrix"
                    values="
                        0 0 0 0   0.2
                        0 0.5 0 0   0
                        0.5 0 0 0   0
                        0 0 0 0.5 0
                    "
                />
                <feBlend mode="normal" in2="effect1_dropShadow" />
            </filter>
            <g filter="url(#neon-glow)">
                <circle className="neon-circle" cx="50" cy="50" r="20" />
                <circle className="neon-circle" cx="70" cy="50" r="15" />
                <circle className="neon-circle" cx="90" cy="50" r="10" />
                <circle className="neon-circle" cx="110" cy="50" r="5" />
            </g>
          </svg>

    </div>
  )
}

export default NoPage;