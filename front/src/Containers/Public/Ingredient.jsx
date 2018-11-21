import React from 'react';
import '../../Assets/Styles/Ingredient.css';
// import carrotCakeImage from '../../Assets/CarrotCake.jpg';

export default class Ingredient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // const imageClass = `${this.props.ingredient.type}image`;
    const description = `${this.props.ingredient.description}
Allergènes: ${this.props.ingredient.allergènes}`;
    const divStyle = {
      // backgroundImage: `url(${carrotCakeImage})`,
      backgroundImage: `url(${this.props.ingredient.img})`,
    };

    return (
      <div className="ingredient" draggable="true" id={"ingredient"+this.props.ingredient.id}>
        <div className={this.props.ingredient.type} style={divStyle} title={description} />
        <p className="ingredientName">{this.props.ingredient.name}</p>
      </div>
    );
  }
}
