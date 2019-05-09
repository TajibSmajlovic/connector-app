import React, { Component } from "react";
import { Segment, Accordion, Header, Icon, Image } from "semantic-ui-react";

class MetaPanel extends Component {
  state = {
    activeIndex: 0
  };

  setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;
    const { privateMessage, currentRoom } = this.props;

    if (privateMessage || !currentRoom) {
      return null;
    }

    return (
      <Segment>
        <Header as="h3" attached="top">
          About # {currentRoom.name}
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            Room Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {currentRoom.details}
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            posters
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>
          <Accordion.Content
            style={{ textAlign: "center" }}
            active={activeIndex === 2}
          >
            <Image
              style={{ margin: "auto" }}
              src={currentRoom.createdBy.avatar}
            />

            {currentRoom.createdBy.name}
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}

export default MetaPanel;
