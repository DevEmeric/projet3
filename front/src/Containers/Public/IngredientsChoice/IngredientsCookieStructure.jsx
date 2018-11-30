import React from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import IngredientsDisplay from './IngredientsDisplay';

const IngredientsCookieStructure = (props) => {
  return (
    <Row style={{ height: '70vh', overflowY: 'scroll' }}>
      <Col sm="12">
        <h1 style={{ textAlign: 'center' }}>{props.bases[0].type}</h1>
      </Col>
      <Col sm="12" style={{ display: 'flex', flexDirection: 'row'}}>
        <IngredientsDisplay elementToDisplay={props.bases} />
      </Col>
    </Row>
  );
}

const mapStateToProps = (state) => {
  return ({
    bases: state.cookiesBases,
  });
};

export default connect(mapStateToProps)(IngredientsCookieStructure);