import { connect } from "react-redux";
import { getUser } from "../../redux";
import React from "react";

function mapStateToProps(state) {
  return {
    user: getUser()
  };
}

class UserInfo extends React.Component {

  render() {
    return (
      <div>
        <h3>The user is:</h3>
        this.props.user
      </div>
    );
  }
}


export default connect(mapStateToProps)(UserInfo);
