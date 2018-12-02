import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import IngredientsCakeStrucure from './IngredientsChoice/IngredientsCakeStructure';
import IngredientsButtons from './IngredientsChoice/IngredientsButtons';
import Progressbar from './Progressbar';
import Price from './Price';
import CakeInProgress from './CakeInProgress';


const Composition = (props) => {
  const { price, index, cake } = props;
  return (
    <div>
      <Row>
        <Progressbar />
      </Row>
      <Row>
        <Col sm="8">
          <IngredientsCakeStrucure />
          <IngredientsButtons index={index} />
        </Col>
        <Col sm="4">
          <CakeInProgress />
          <Price amount={price} />
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return (
    {
      cake: state.cakeCharacteristics,
      price: state.price,
      index: state.pageIndex,
    }
  );
};

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
)(Composition);
