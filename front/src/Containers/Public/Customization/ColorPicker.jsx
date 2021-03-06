import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CirclePicker } from 'react-color';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import FontPicker from './FontPicker';
import { changeBgColor, changeFontColor } from '../../../Actions/customization_actions';
import '../../../Assets/Styles/Customization.css';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = { color: 'font' };
  }

  changeColorPalette = (palette) => {
    this.setState({ color: palette });
  }

  render() {
    const buttonStyle = { backgroundColor: 'rgb(129, 38, 38)' }
    const { changeBackgroundColor, changeFontColour } = this.props;
    const { color } = this.state;
    return (
      <div>
        <Row>
          <Col className="buttonGroup">
            <ButtonGroup>
              <FontPicker />
              <Button
                onClick={() => this.changeColorPalette('font')}
                style={color === 'font' ? buttonStyle : {}}
              >
                Couleur de l’écriture
              </Button>
              <Button
                onClick={() => this.changeColorPalette('background')}
                style={color === 'background' ? buttonStyle : {}}
              >
                Couleur de fond
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          {
            (color === 'font')
              ? <CirclePicker className="palette"
              colors={["#000000", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"]}
              name="fontColor" onChange={changeFontColour} />
              : <CirclePicker className="palette" name="backgroundColor" onChange={changeBackgroundColor} />
          }
        </Row>
      </div>
    );
  }
}


ColorPicker.propTypes = {
  changeBackgroundColor: PropTypes.func.isRequired,
  changeFontColour: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  changeBackgroundColor: color => dispatch(changeBgColor(color)),
  changeFontColour: color => dispatch(changeFontColor(color)),
});

export default connect(null, mapDispatchToProps)(ColorPicker);
