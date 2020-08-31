import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import XMLParser from "react-xml-parser";
import ContactsXml from "./XML_Data";

export default class Contacts extends React.Component {
  constructor() {
    super();

    var xml = new XMLParser().parseFromString(ContactsXml);
    this.state = {
      showadd: false,
      showedit: false,
      contacts: [],
      newcontacts: [],
      newcontact: { firstname: "", lastname: "", phonenum: "" },
      editcontact: { firstname: "", lastname: "", phonenum: "" },
      selected: {},
    };
  }

  importcontacts = () => {
    const xml = new XMLParser().parseFromString(ContactsXml);
    let contacts = [...this.state.contacts];
    contacts = xml.getElementsByTagName("contact");
    this.setState({ contacts });
  };

  handleShowadd = () => {
    this.setState({ showadd: true });
  };
  handleShowedit = () => {
    this.setState({ showedit: true });
  };

  handleClose = () => {
    this.setState({
      showadd: false,
      showedit: false,
      newcontact: { firstname: "", lastname: "", phonenum: "" },
    });
  };

  addContact = () => {
    let newcontacts = [...this.state.newcontacts];
    newcontacts.push(this.state.newcontact);
    this.setState({ newcontacts }, () => {
      this.handleClose();
    });
  };

  handlenewcontact = (e) => {
    e.preventDefault();
    let newcontact = { ...this.state.newcontact };
    if (e.target.name === "fn") newcontact.firstname = e.target.value;
    else if (e.target.name === "ln") newcontact.lastname = e.target.value;
    else if (e.target.name === "pn") newcontact.phonenum = e.target.value;
    this.setState({ newcontact });
  };

  handleeditcontact = (e) => {
    e.preventDefault();
    let editcontact = { ...this.state.editcontact };
    if (e.target.name === "fn") editcontact.firstname = e.target.value;
    else if (e.target.name === "ln") editcontact.lastname = e.target.value;
    else if (e.target.name === "pn") editcontact.phonenum = e.target.value;
    this.setState({ editcontact });
  };

  edit = () => {
    let n = this.state.newcontacts.indexOf(this.state.selected);
    if (n === -1) {
      let k = this.state.contacts.indexOf(this.state.selected);
      let contacts = [...this.state.contacts];
      contacts[k].children[0].value = this.state.editcontact.firstname;
      contacts[k].children[1].value = this.state.editcontact.lastname;
      contacts[k].children[2].value = this.state.editcontact.phonenum;
      this.setState({ contacts }, () => {
        this.handleClose();
      });
    } else {
      let newcontacts = [...this.state.newcontacts];
      newcontacts[n] = this.state.editcontact;
      this.setState({ newcontacts }, () => {
        this.handleClose();
      });
    }
  };

  deletecontact = (e, contact) => {
    e.preventDefault();
    if (e.target.name === "notimported") {
      let n = this.state.newcontacts.indexOf(contact);
      let newcontacts = [...this.state.newcontacts];
      newcontacts.splice(n, 1);
      this.setState({ newcontacts });
    } else if (e.target.name === "imported") {
      let n = this.state.contacts.indexOf(contact);
      let contacts = [...this.state.contacts];
      contacts.splice(n, 1);
      this.setState({ contacts });
    }
  };
  editcontact = (e, contact) => {
    e.preventDefault();
    if (e.target.name === "notimported") {
      let n = this.state.newcontacts.indexOf(contact);
      let newcontacts = [...this.state.newcontacts];
      let editcontact = { ...this.state.editcontact };
      editcontact = newcontacts[n];
      this.setState({ editcontact, selected: contact });
    } else if (e.target.name === "imported") {
      let n = this.state.contacts.indexOf(contact);
      let contacts = [...this.state.contacts];
      let editcontact = { ...this.state.editcontact };
      editcontact.firstname = contacts[n].children[0].value;
      editcontact.lastname = contacts[n].children[1].value;
      editcontact.phonenum = contacts[n].children[2].value;
      this.setState({ editcontact, selected: contact });
    }
    this.handleShowedit();
    console.log(this.state.editcontact);
  };

  render() {
    return (
      <>
        <Container className="box">
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <h1>Contacts</h1>
              <Button
                className="btn"
                variant="info"
                onClick={this.importcontacts}
              >
                Import all contacts
              </Button>
              <br />
              <Button
                className="btn"
                variant="success"
                onClick={this.handleShowadd}
              >
                Add a new contact
              </Button>
              <div className="contactcontainer">
                {this.state.newcontacts.map((contact) => (
                  <div className="contactbox">
                    <p>
                      {contact.firstname}
                    </p>
                    <p>{contact.lastname}</p>
                    <p>{contact.phonenum}</p>
                    <Button
                      variant="outline-info"
                      name="notimported"
                      onClick={(e) => this.editcontact(e, contact)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      name="notimported"
                      onClick={(e) => this.deletecontact(e, contact)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                {this.state.contacts.map((contact) => (
                  <div className="contactbox">
                    {contact.children.map((detail) => (
                      <p>{detail.value}</p>
                    ))}
                    <Button
                      variant="outline-info"
                      name="imported"
                      onClick={(e) => this.editcontact(e, contact)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      name="imported"
                      onClick={(e) => this.deletecontact(e, contact)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
        <Modal show={this.state.showadd} onHide={this.handleClose} className="model">
          <Modal.Header closeButton>
            <Modal.Title>Enter Contact Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fn"
                  value={this.state.newcontact.firstname}
                  placeholder="Enter first name"
                  onChange={this.handlenewcontact}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="ln"
                  value={this.state.newcontact.lastname}
                  placeholder="Enter last name"
                  onChange={this.handlenewcontact}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="number"
                  name="pn"
                  value={this.state.newcontact.phonenum}
                  placeholder="Enter phone number"
                  onChange={this.handlenewcontact}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.addContact}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showedit} onHide={this.handleClose} className="model">
          <Modal.Header closeButton>
            <Modal.Title>Edit Contact Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fn"
                  value={this.state.editcontact.firstname}
                  placeholder="Enter first name"
                  onChange={this.handleeditcontact}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="ln"
                  value={this.state.editcontact.lastname}
                  placeholder="Enter last name"
                  onChange={this.handleeditcontact}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="number"
                  name="pn"
                  value={this.state.editcontact.phonenum}
                  placeholder="Enter phone number"
                  onChange={this.handleeditcontact}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.edit}>
              Edit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
