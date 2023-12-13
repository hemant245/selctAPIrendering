import data from "../config/branch.json";
// import Tabs from "../components/TabComponent/Tabs";
import DynamicForm from "../Component/DynamicForm";
function SamplePage() {
  const tabs = data?.map((form, index) => {
    return {
      label: form.title,
      content: (
        <DynamicForm config={form?.fields} key={index} redirection={true} />
      ), // dynamic component ---> form component--- >  with the field
    };
  });
  return (
    <div>
      <DynamicForm config={data[0]?.fields} redirection={true} />

      {/* <DynamicForm config={data[0]?.fields} /> */}
    </div>
  );
}

export default SamplePage;
