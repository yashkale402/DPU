import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 400 150"
      {...props}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
        .maroon { fill: #800000; }
        .gold { fill: #D4AF37; }
        .main-text { font-family: 'Times New Roman', serif; font-size: 60px; font-weight: bold; fill: #800000; }
        .sub-text { font-family: 'Times New Roman', serif; font-size: 16px; font-weight: bold; fill: #800000; }
      `}</style>
      
      {/* <!-- Left Swoosh and Stars --> */}
      <g transform="translate(40, 40)">
        <path d="M0,15 Q30,-15 60,10" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
        <path d="M0,20 Q35,-5 70,20" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
        <polygon points="55,-8 57,-2 63,-2 58,2 60,8 55,4 50,8 52,2 47,-2 53,-2" className="maroon" />
      </g>
      
      {/* <!-- Right Swoosh and Stars --> */}
      <g transform="translate(230, 40)">
        <path d="M0,15 Q30,-15 60,10" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
        <path d="M0,20 Q35,-5 70,20" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
        <polygon points="55,-8 57,-2 63,-2 58,2 60,8 55,4 50,8 52,2 47,-2 53,-2" className="maroon" />
      </g>
      
      {/* <!-- Main Text --> */}
      <text x="50%" y="90" textAnchor="middle" className="main-text">DYP DPU</text>
      
      {/* <!-- Bottom Line and Text --> */}
      <line x1="20" y1="115" x2="380" y2="115" stroke="#D4AF37" strokeWidth="2" />
      <circle cx="200" cy="115" r="3" className="maroon" />
      <text x="50%" y="135" textAnchor="middle" className="sub-text">Dr. D. Y. Patil Unitech Society</text>
    </svg>
  ),
};
