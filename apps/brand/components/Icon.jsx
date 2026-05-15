// Single-stroke line icons sized to flow inline with text or sit in chips.
// All icons share viewBox 24×24 and inherit color via stroke="currentColor".
export function Icon({ name }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "border":
      return (<svg {...props}><path d="M3 12h18" strokeDasharray="2 3" /><path d="M6 6l-2 6 2 6" /><path d="M18 6l2 6-2 6" /></svg>);
    case "permit":
      return (<svg {...props}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M9 11h6M9 15h4" /></svg>);
    case "truck":
      return (<svg {...props}><rect x="2" y="7" width="11" height="9" rx="1" /><path d="M13 10h4l3 3v3h-7" /><circle cx="6" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>);
    case "recycle":
      return (<svg {...props}><path d="M7 6l3-3h4l3 3" /><path d="M21 12l-3 5h-5" /><path d="M3 12l3-5h5" /><path d="M9 17l-2 2 2 2" /><path d="M14 22l4-3-4-3" /></svg>);
    case "north":
      return (<svg {...props}><circle cx="12" cy="12" r="9" /><path d="M9 16l3-10 3 10-3-3z" /></svg>);
    case "phone":
      return (<svg {...props}><path d="M5 3h3l2 5-3 2c1 3 3 5 6 6l2-3 5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>);
    case "doc":
      return (<svg {...props}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></svg>);
    case "chevron":
      return (<svg {...props}><path d="M9 6l6 6-6 6" /></svg>);
    default:
      return null;
  }
}
