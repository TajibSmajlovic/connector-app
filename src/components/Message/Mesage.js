import React from "react";
import moment from "moment/moment";
import { Comment, Image, Icon } from "semantic-ui-react";

import styles from "./Message.module.css";

// Checks to see if user id is same as message user id
const isOwnMessage = (message, user) => {
  if (message.user.id === user.uid) {
    return styles.OwnMessage;
  } else {
    return "";
  }
};
const isImage = message => {
  return message.hasOwnProperty("media") && !message.hasOwnProperty("content");
};

const isLocation = message => {
  return (
    message.hasOwnProperty("location") && !message.hasOwnProperty("content")
  );
};

// When message was created
const timeCreated = timestamp => moment(timestamp).fromNow();

const message = ({ message, user }) => (
  <Comment>
    <Comment.Avatar src={message.user.avatar} />
    <Comment.Content className={isOwnMessage(message, user)}>
      <Comment.Author as="a">{message.user.name}</Comment.Author>
      <Comment.Metadata>{timeCreated(message.timestamp)}</Comment.Metadata>
      {isImage(message) ? (
        <Image src={message.media} className={styles.Image} />
      ) : isLocation(message) ? (
        <Comment.Text>
          {message.location.includes("Unable") ? (
            message.location
          ) : (
            <a target="_blank" href={message.location}>
              <Icon name="location arrow" />
              Location
            </a>
          )}
        </Comment.Text>
      ) : (
        <Comment.Text>{message.content}</Comment.Text>
      )}
    </Comment.Content>
  </Comment>
);

export default message;
