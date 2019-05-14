import React, { Component } from "react";
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List
} from "semantic-ui-react";

class InfoPanel extends Component {
  state = {
    activeIndex: 0
  };

  setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  // Using Object.entries on prop value of userPosts with sorting and mapping every posts that is on global state, return list with correct data.
  displayTopPosters = posts =>
    Object.entries(posts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{this.format(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5);

  format = num => {
    if (num > 1 || num === 0) {
      return `${num} posts`;
    } else {
      return `${num} post`;
    }
  };

  render() {
    const { activeIndex } = this.state;
    const { privateMessage, currentRoom, userPosts } = this.props;

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
            Most Active Users
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <List>{userPosts && this.displayTopPosters(userPosts)}</List>
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

export default InfoPanel;
