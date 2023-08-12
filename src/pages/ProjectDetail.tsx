import ChecklistItem from '../components/ChecklistItem';
import Sidebar from '../components/Sidebar';

const ProjectDetail = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="pt-8 grow ml-[300px] mt-[72px]">
        <div className="w-[85%]  mx-auto flex flex-col gap-6 ">
          <h2 className="text-4xl font-bold">Kemdikbud Pen Test</h2>
          <div className="flex gap-6 w-fit items-center px-8 py-6 border mx-auto border-[#D7D7D7] rounded-2xl">
            <div className="flex flex-col gap-3">
              <span className="font-bold text-[32px]">50%</span>
              <p>25/50</p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-[24px]">Vulnerability Summary</h3>
              <table>
                <tbody>
                  <tr>
                    <td>High - 3</td>
                    <td>Low - 1</td>
                  </tr>
                  <tr>
                    <td>Medium - 2</td>
                    <td>Informational - 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="block w-fit">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
            dolor sed viverra ipsum nunc aliquet. Lacus laoreet non curabitur
            gravida arcu. Vivamus arcu felis bibendum ut. Adipiscing enim eu
            turpis egestas pretium aenean pharetra magna. Pharetra et ultrices
            neque ornare aenean euismod elementum nisi. A arcu cursus vitae
            congue mauris rhoncus aenean. Sed euismod nisi porta lorem mollis
            aliquam ut. Non odio euismod lacinia at quis risus sed vulputate
            odio. Sagittis eu volutpat odio facilisis mauris sit. Et
            malesuadafames ac turpis egestas maecenas. Congue quisque egestas
            diam in arcu cursus euismod quis. Urna nec tincidunt praesent semper
            feugiat. Augue interdum velit euismod in. Urna duis convallis
            convallis tellus id. Faucibus interdum posuere lorem ipsum dolor sit
            amet. Pellentesque dignissim enim sit amet venenatis urna.
          </p>
          <button className="py-2 px-3 gap-4 rounded-xl border border-[#D7D7D7] w-fit">
            <span className="text-blue-500 text-lg font-bold">+</span> Add
            checklist tag
          </button>
          <h4 className="text-2xl">Checklist Tag</h4>
          <ChecklistItem />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
