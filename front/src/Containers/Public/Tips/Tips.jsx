import React from 'react';
import { connect } from 'react-redux';
import TipsCake from './TipsCake';
import TipsCheesecake from './TipsCheesecake';
import TipsCookie from './TipsCookie';
import TipsMacaron from './TipsMacaron';

const Tips = (props) => {
  const renderTips = (cakeType) => {
    switch (cakeType) {
      case 'cake': return <TipsCake />;
      case 'cheesecake': return <TipsCheesecake />;
      case 'cookie': return <TipsCookie />;
      case 'macaron': return <TipsMacaron />;
      default: return <p> Choisissez votre type de pâtisserie </p>;
    }
  };

  return (
    <div className="bg-light p-2">
      <h5>Tips:</h5>
      {renderTips(props.cake.type)}
    </div>
  );
};

const mapStateToProps = state => ({
  cake: state.cakeCharacteristics,
});

export default connect(mapStateToProps, null)(Tips);