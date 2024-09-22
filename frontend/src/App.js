import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';


function App() {

const url='http://localhost:3000/tasks';
  // Add
  const addTask = async (taskData) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: taskData.name,
        task: taskData.task,
        priority: taskData.priority,
        avatar: taskData.avatar,  // Avatar-Link wird hier mitgesendet
      }),
    });
    const data = await response.json();
    setFormData({ name: '', task: '', priority: 'Low' });

    fetchData();
    return data;
  };
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data);  // `data` enthält nun auch die Avatars

    };

    fetchTasks();
  }, []);


  // Remove
  const handleRemoveTask = (indexToRemove) => {
    const newTasks = tasks.filter((_, index) => index !== indexToRemove);
    setTasks(newTasks);
  };

  // edit: Index of task
  const [editingIndex, setEditingIndex] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  // Edit: data to Model
  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setFormData({
      name: taskToEdit.name,
      task: taskToEdit.task,
      priority: taskToEdit.priority,
    });
    setEditingIndex(index); // Speichere den Index der Aufgabe, die bearbeitet wird
    setShow(true); // Öffne das Modal
  };

  const handleSaveChanges = () => {
    const updatedTask = {
      name: formData.name,
      task: formData.task,
      priority: formData.priority,
      avatar: tasks[editingIndex].avatar, // Behalte den Avatar der Aufgabe bei
    };

    // Aktualisiere die Aufgabenliste mit der bearbeiteten Aufgabe
    const updatedTasks = tasks.map((task, index) =>
        index === editingIndex ? updatedTask : task
    );

    setTasks(updatedTasks);
    setFormData({ name: '', task: '', priority: 'Low' });
    setShow(false); // Schließe das Modal nach dem Speichern




  };

///////////////////////////////////////////////////////////////////////////////////////////

  const [tasks, setTasks] = useState([]);

// load list
   const fetchData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setTasks(data);  // Speichere die Daten im State
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
    }
  };

  // useEffect wird ausgeführt, wenn die Komponente geladen wird
  useEffect(() => {
    fetchData();
  }, []); // Das leere Array [] sorgt dafür, dass useEffect nur beim ersten Rendern ausgeführt wird[]);



  const [formData, setFormData] = useState({
    name: '',
    task: '',
    priority: 'Low',
  });

  // Elemente erstellen für die Tabelle
  const elements = tasks.map((task, index) => (
      <tr className="fw-normal" key={index}>
        <th>
          <img
              src={task.avatar}
              alt={`avatar ${index + 1}`}
              style={{ width: '45px', height: 'auto' }}
          />
          <span className="ms-2">{task.name}</span>
        </th>
        <td className="align-middle">{task.task}</td>
        <td className="align-middle">
          <h6 className="mb-0">
          <span className={`badge bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'}`}>
            {task.priority} priority
          </span>
          </h6>
        </td>
        <td className="align-middle">
          <a data-mdb-tooltip-init title="Edit">
            <i className="fas fa-edit fa-lg text-success me-3" style={{  cursor: 'pointer' }} onClick={() => handleEditTask(index)}></i>
          </a>
          <a data-mdb-tooltip-init title="Remove">
            <i className="fas fa-trash-alt fa-lg text-warning" style={{  cursor: 'pointer' }} onClick={() => handleRemoveTask(index)}></i>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Editing Task</Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <Form style={{ width: '400px', margin: '0 auto', marginBottom: '50px' }}>
                  <Form.Group className="mb-3" controlId="formBasicData-edit">
                    <Form.Control
                        style={{marginBottom:'10px'}}
                        type="text"
                        placeholder="Team Member"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <Form.Control
                        type="text"
                        placeholder="Task"
                        value={formData.task}
                        onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPriority">
                    <Dropdown onSelect={(e) => setFormData({ ...formData, priority: e })}>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {formData.priority} Priority
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item eventKey="High">High priority</Dropdown.Item>
                        <Dropdown.Item eventKey="Medium">Medium priority</Dropdown.Item>
                        <Dropdown.Item eventKey="Low">Low priority</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>

                </Form>

              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </a>
        </td>
      </tr>
  ));


  return (
      <section className="vh-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-12 col-xl-10">
              <div className="card mask-custom">
                <div className="card-body p-4 text-white">
                  {/* Formular */}
                  <Form style={{ width: '500px', margin: '0 auto', marginBottom: '50px' }}>
                    <Form.Group className="mb-3" controlId="formBasicData">
                      <Form.Label>Team Member</Form.Label>
                      <Form.Control
                          type="text"
                          placeholder="Team Member"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />

                      <Form.Label>Task</Form.Label>
                      <Form.Control
                          type="text"
                          placeholder="Task"
                          value={formData.task}
                          onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPriority">
                      <Dropdown onSelect={(e) => setFormData({ ...formData, priority: e })}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          {formData.priority} Priority
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item eventKey="High">High priority</Dropdown.Item>
                          <Dropdown.Item eventKey="Medium">Medium priority</Dropdown.Item>
                          <Dropdown.Item eventKey="Low">Low priority</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>

                    <Button variant="primary" onClick={() => addTask({ name: formData.name, task:formData.task, priority: formData.priority, avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp' })}>
                      Add
                    </Button>
                  </Form>

                  {/* Tabelle */}
                  <table className="table text-white mb-0">
                    <thead>
                    <tr>

                      <th scope="col">Team Member</th>
                      <th scope="col">Task</th>
                      <th scope="col">Priority</th>
                      <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>{elements}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
export default App;
