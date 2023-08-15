import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";

function App() {
  const baseUrl = `http://localhost:81/crudfull/`;
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalRemove, setModalRemove] = useState(false);
  const [frameworkSel, setFrameWorkSel] = useState({
    id: '',
    nombre: '',
    lanzamiento: '',
    desarrollador: '',
  }) ;

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFrameWorkSel((prevState)=> ({
      ...prevState,
      [name]: value
    })
    )
    console.log(frameworkSel)
  }
  const openandCloseModal=() => {
    setModal(!modal)
  }
  const openandCloseModalEdit=() => {
    setModalEdit(!modalEdit)
  }

  const modalRemoveState= () => {
    setModalRemove(!modalRemove)
  }

  const peticionesGet = async () => {
    await axios.get(baseUrl).then((res) => {
      setData(res.data);
    });
  };

  const postMethod = async () => {
    let f = new FormData();
    f.append("nombre",frameworkSel.nombre);
    f.append("lanzamiento",frameworkSel.lanzamiento);
    f.append("desarrollador",frameworkSel.desarrollador);
    f.append("METHOD","POST");
    await axios.post(baseUrl, f)
    .then(res => {
      setData(data.concat(res.data))
      openandCloseModal();
    }).catch((err) => {
      console.log(err)
    })
  }

  const putMethod=async()=>{
    var f = new FormData();
    f.append("nombre", frameworkSel.nombre);
    f.append("lanzamiento", frameworkSel.lanzamiento);
    f.append("desarrollador", frameworkSel.desarrollador);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: frameworkSel.id}})
    .then(res=>{
      var dataNueva= data;
      dataNueva.map(framework=>{
        if(framework.id===frameworkSel.id){
          framework.nombre=frameworkSel.nombre;
          framework.lanzamiento=frameworkSel.lanzamiento;
          framework.desarrollador=frameworkSel.desarrollador;
        }
      });
      setData(dataNueva);
      openandCloseModalEdit();
    }).catch(error=>{
      console.log(error);
    })
  }
  const selectedframework=(framework, caso) => {
    setFrameWorkSel(framework);
    (caso==="Editar")?
      openandCloseModalEdit():
      modalRemoveState()
    
  }
  
  const deleteMethod =async () => {
    var f = new FormData();
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: frameworkSel.id}})
    .then(res=>{
      setData(data.filter(framework=> framework.id!==frameworkSel.id));
      modalRemoveState();
    }).catch(error=>{
      console.log(error);
    })
  }

  useEffect(() => {
    peticionesGet();
  }, []);

  return (
    <div style={{textAlign: 'center'}}>
      <button className="btn btn-primary"
      onClick={() => openandCloseModal()}>Insertar</button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Lanzamiento</th>
            <th>Desarrollador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((framework) => (
            <tr key={framework.id}>
              <td>{framework.id}</td>
              <td>{framework.nombre}</td>
              <td>{framework.lanzamiento}</td>
              <td>{framework.desarrollador}</td>
              <td>
                <button className="btn btn-primary"
                onClick={() => selectedframework(framework, "Editar")}>Editar</button>
                <button className="btn btn-danger" 
                onClick={() => selectedframework(framework, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modal}>
        <ModalHeader>Modal title</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" className="form-control" name="nombre"  onChange={handleChange}/>
            <label>Lanzamiento</label>
            <input type="text" className="form-control" name="lanzamiento" onChange={handleChange}/>
            <label>Desarrollador</label>
            <input type="text" className="form-control" name="desarrollador" onChange={handleChange}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary"
          onClick={() => postMethod()}>Insertar</button>
          <button className="btn btn-danger"
          onClick={() => openandCloseModal() }>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit}>
        <ModalHeader>Modal title</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" 
            className="form-control" 
            name="nombre"  
            onChange={handleChange}
            value={frameworkSel && frameworkSel.nombre}/>
            <label>Lanzamiento</label>
            <input type="text" 
            className="form-control" 
            name="lanzamiento" 
            onChange={handleChange}
            value={frameworkSel && frameworkSel.lanzamiento}/>
            <label>Desarrollador</label>
            <input 
            type="text" 
            className="form-control" 
            name="desarrollador" 
            onChange={handleChange}
            value={frameworkSel && frameworkSel.desarrollador}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary"
          onClick={() => putMethod()}>Editar</button>
          <button className="btn btn-danger"
          onClick={() => openandCloseModalEdit() }>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalRemove}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el Framework {frameworkSel && frameworkSel.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>deleteMethod()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>modalRemoveState()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
