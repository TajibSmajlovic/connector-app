import React, { Component } from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

class MessagesHeader extends Component {
  render() {
    const {
      roomName,
      numUniqueUsers,
      handleSearchChange,
      searchLoading,
      privateMessage,
      starred,
      isRoomStarred
    } = this.props;

    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {!privateMessage ? (
              <Icon
                name={isRoomStarred ? "star" : "star outline"}
                color={isRoomStarred ? "yellow" : "black"}
                onClick={starred}
              />
            ) : (
              ""
            )}{" "}
            <span style={{ textDecoration: "underline" }}>{roomName}</span>
          </span>
          {!privateMessage ? (
            <Header.Subheader>{numUniqueUsers}</Header.Subheader>
          ) : (
            ""
          )}
        </Header>

        {/* Channel Search Input */}
        <Header floated="right">
          <Input
            loading={searchLoading}
            onChange={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
