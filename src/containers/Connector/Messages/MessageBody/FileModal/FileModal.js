import React, { Component } from "react";
import mime from "mime-types"; // Looks at file extension
import { Modal, Input, Button, Icon } from "semantic-ui-react";

class FileModal extends Component {
  state = {
    file: null,
    authorized: ["image/jpeg", "image/png", "pdf/pdf"]
  };

  // Add media file to the state
  addFile = event => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };

  // If there is a file which satisfy extensions included, method uploadFile() which is executed via props will occur as well as closeModal() and clearFile().
  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;

    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        this.clearFile();
      }
    }
  };

  // Checks to see if filename extension (jpeg, png...) is authorized.
  isAuthorized = filename =>
    this.state.authorized.includes(mime.lookup(filename));

  // Clear file state.
  clearFile = () => this.setState({ file: null });

  render() {
    const { modal, closeModal } = this.props;

    return (
      <Modal basic open={modal} style={{ height: "50%" }} onClose={closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input
            onChange={this.addFile}
            fluid
            label="File types: jpg, png"
            name="file"
            type="file"
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.sendFile} color="green" inverted>
            <Icon name="checkmark" /> Send
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
