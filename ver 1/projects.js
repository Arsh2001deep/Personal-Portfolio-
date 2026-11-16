// ✏️ EDIT ME: this is the only file you touch to update your projects.
// Each "universe" is a category with its own comic-art style (set in css/styles.css).
export const universes = [
  { id: 'all',   name: 'All Universes' },
  { id: 'code',  name: 'Earth-Code' },
  { id: 'ai',    name: 'Earth-AI' },
  { id: 'space', name: 'Earth-Aero' },
  { id: 'side',  name: 'Earth-Side Quest' },
];

export const projects = [
  { universe: 'code',  title: 'Project Name One',   issue: '#001', size: 'wide', desc: 'One line on what it does and why it matters.', tags: ['JavaScript', 'API'],     link: '#' },
  { universe: 'ai',    title: 'Project Name Two',   issue: '#002', size: 'tall', desc: 'What problem it solves and how.',              tags: ['Python', 'ML'],          link: '#' },
  { universe: 'space', title: 'Project Name Three', issue: '#003', size: '',     desc: 'Aerospace or simulation work goes here.',      tags: ['CAD', 'Simulation'],     link: '#' },
  { universe: 'code',  title: 'Project Name Four',  issue: '#004', size: '',     desc: 'Automation that saves real time.',             tags: ['Automation', 'Node'],    link: '#' },
  { universe: 'side',  title: 'Project Name Five',  issue: '#005', size: 'wide', desc: 'The experiment you built just because.',       tags: ['Creative', 'Design'],    link: '#' },
];
