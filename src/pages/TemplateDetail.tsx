import Sidebar from '../components/Sidebar';

const TemplateDetail = () => {
  return (
    <div className="flex">
      <Sidebar active="templates" />
      <div className="pt-8 grow"></div>
    </div>
  );
};

export default TemplateDetail;
