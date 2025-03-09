import DrawingCanvas from "./Components/DrawingCanvas";
import ToolBar from "./Components/ToolBar";

function App() {
  return (
    <>
      <div style={{ position: "relative" }}>
        <DrawingCanvas />
        <ToolBar />
      </div>
    </>
  );
}

export default App;
