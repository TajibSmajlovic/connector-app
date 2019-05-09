import React from "react";
import { Grid, Button, Icon } from "semantic-ui-react";

import Aux from "../../../hoc/Auxiliary/Auxiliary";

const socialMedia = props => (
  <Aux>
    <Grid textAlign="center">
      <Grid.Column style={{ maxWidth: 400 }}>
        <Button.Group>
          <Button color="google plus">
            <Icon name="google" size="big" fitted />
          </Button>
          <Button color="facebook" onClick={props.facebook}>
            <Icon name="facebook" size="big" fitted />
          </Button>
          <Button color="instagram">
            <Icon name="instagram" size="big" fitted />
          </Button>
          <Button color="grey">
            <Icon name="github" size="big" fitted />
          </Button>
        </Button.Group>
      </Grid.Column>
    </Grid>
    <p>{props.children}</p>
  </Aux>
);

export default socialMedia;
