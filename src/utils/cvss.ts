const colorRatings = {
  '': 'bg-[#000000]',
  None: 'bg-[#53aa33]',
  Low: 'bg-[#ffcb0d]',
  Medium: 'bg-[#f9a009]',
  High: 'bg-[#df3d03]',
  Critical: 'bg-[#cc0500]',
};

const severityRatings = [
  {
    name: 'None',
    bottom: 0.0,
    top: 0.0,
  },
  {
    name: 'Low',
    bottom: 0.1,
    top: 3.9,
  },
  {
    name: 'Medium',
    bottom: 4.0,
    top: 6.9,
  },
  {
    name: 'High',
    bottom: 7.0,
    top: 8.9,
  },
  {
    name: 'Critical',
    bottom: 9.0,
    top: 10.0,
  },
];


export { colorRatings, severityRatings}