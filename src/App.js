import './App.css';
import GraphVis from './components/GraphVis';
import ProjectThumb from './components/ProjectThumb';
import { useState } from 'react';


function App() {

  const [graphVisOn, setGraphVis] = useState(false);

  return (
    <div >
      <h1 className={"h1-1"} onClick={() => setGraphVis(false)}>
        Burak Nur Erdem
      </h1>
      <div className={"grid-container-1"}>
        <div className={"grid-child"}>
          <h2 className={"h3-1"} onClick={() => setGraphVis(false)}>
            Current Work
          </h2>
        </div>
        <div className={"grid-child"}>
          <h2 className={"h3-1"}>
            About Me
          </h2>
        </div>
      </div>
      <div>
        {graphVisOn && <GraphVis />}
      </div>
      <div className={'grid-container-2'}>
        <div className={"grid-child"}>
          <ProjectThumb text="Graph Visualizer" thumb={require('./assets/thumb1.png')} onClick={setGraphVis}/>
        </div>
      </div>
    </div>
    
  );
}

export default App;
