import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Row, Col, FormGroup, Label, Input, FormFeedback,
} from 'reactstrap';
import Progressbar from '../Progressbar';
import {
  saveCustomer, getIngredientsID, saveCake, populateCakeIngrJT,
  saveCustomWishes, saveOrder, populateClientOrderJT,
} from './final_order_functions';
import updateUserInfo from '../../../Actions/orderActions/updateUserInfo';
import '../../../Assets/Styles/UserInfo.css';

class UserInfo extends Component {
  constructor(props) {
    super(props);
    const { customer, giftcard, comment } = this.props;
    this.mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.birthdateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    this.state = {
      user: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        birthday: customer.birthdate,
        email: customer.email,
        phone: customer.telephone,
      },
      comment,
      giftcard,
      inputAttempt: false,
      dobNotValid: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    const { updateUser } = this.props;
    updateUser(this.state);
  }

  updateState = (evt) => {
    evt.persist();
    this.setState(prevState => ({
      prevState, [evt.target.id]: evt.target.value,
    }));
  }

  setUserState = (evt) => {
    evt.persist();
    const { user } = this.state;
    if (!user.birthdate) this.setState({ dobNotValid: false });
    this.setState(prevState => ({
      prevState,
      user: {
        ...prevState.user,
        [evt.target.id]: evt.target.value,
      },
    }));
  }

  validEmail = (mailState) => {
    if (mailState === '') return false;
    return !this.mailRegex.test(mailState);
  }

  sendConfirmationEmails = () => {
    console.log("confirmation mails")
    const { user } = this.state;
    const mail = {
      client: {
        email: user.email,
        title: 'Confirmation de commande Giluna',
        content: `Bonjour ${user.firstname} ${user.lastname}, votre commande a bien été prise en compte.
                Nous reviendrons vers vous rapidement pour vous confirmer sa validation.`,
      },
      giluna: {
        email: 'sguinot86@gmail.com',
        title: 'Nouvelle commande',
        content: 'Bonjour. Une nouvelle commande vient d’être réalisée sur le site. Allez voir sur votre espace admin pour y trouver la commande.',
      },
    };
    axios.post('/api/send/mail', mail).then(response => console.log(response.data));
  }

  invalidBirthdate = (DOBstate) => {
    if (DOBstate === '') return false;
    if (!this.birthdateRegex.test(DOBstate) && DOBstate.length > 9) return true;
  }

  enterForm = (e) => {
    if (e.key === 'Enter') {
      this.handleClick(e);
    }
    return <Link disabled to={`${process.env.PUBLIC_URL}/mycake/orderConfirmation`} />;
  }

  sendOrder = async (order, customer, cake, customWishes) => {
    const { comment, giftcard } = this.state;
    const { history } = this.props;
    console.log("sendOrder")

    // Création du nouveau user et récupération de son id
    const customerID = await saveCustomer(customer);

    // Récupération de l'ensemble des ID des ingrédients du cake, sous forme d'array
    const ingredientsIDList = await getIngredientsID(cake);

    // Création du nouveau custom wishes et récupération de son id
    const customWishesID = await saveCustomWishes(customWishes);

    // Création du gâteau et récupération de son id
    const cakeID = await saveCake(cake, customWishesID);

    // Remplissage de la table de jonction gâteau / ingrédient
    populateCakeIngrJT(cakeID, ingredientsIDList);

    // Sauvegarde de la commande et récupération de son id
    const orderID = await saveOrder(customerID, cakeID, order, comment, giftcard);

    // Remplissage de la table de jonction client / order
    populateClientOrderJT(customerID, orderID);

    if (orderID > 0) {
      this.sendConfirmationEmails();
      history.push(`${process.env.PUBLIC_URL}/mycake/orderConfirmation`);
      history.push({
        pathname: `${process.env.PUBLIC_URL}/mycake/orderConfirmation`,
        state: { orderID },
      });
    }
  }

  handleClick = () => {
    const { order, cake, customWishes } = this.props;
    const { user } = this.state;
    console.log("handleclick", "user.birthday", user.birthday, "regex", !this.birthdateRegex.test(user.birthday))
    if (!user.firstName || !user.lastName || !user.email || !user.phone || user.phone.length < 8) {
      this.setState({ inputAttempt: true });
    } else {
      if (user.birthday.length > 0 && !this.birthdateRegex.test(user.birthday)) {
        this.setState({ dobNotValid: true });
      }
      else this.sendOrder(order, user, cake, customWishes);
    }
  };

  setWarning = (event) => {
    const { inputAttempt } = this.state;
    const warning = { borderColor: '#dc3545' };
    if (!this.state[event.target.name] && inputAttempt) return warning;
    return null;
  }

  render() {
    const {
      user, comment, giftcard, inputAttempt, dobNotValid,
    } = this.state;
    const warning = { border: '3px solid', borderColor: '#dc3545' };
    return (
      <Container>
        <Row className="text-center">
          <Progressbar />
        </Row>
        <Row className="justify-content-around" style={{ paddingTop: '5vh' }}>
          <Col xs="12" className="alert">
            {
              inputAttempt ? (
                <div>
                  Veuillez renseigner les champs obligatoires * avant d’envoyer la commande
                </div>
              ) : <div />
            }
          </Col>
          <Col sm="12" md="4">
            <FormGroup>
              <Label for="firstName">
                <span className="text-danger">* </span>
                Prénom
              </Label>
              <Input
                autoFocus
                type="text"
                name="firstName"
                id="firstName"
                placeholder="votre prénom"
                value={user.firstName}
                style={inputAttempt && !user.firstName ? warning : {}}
                onChange={e => this.setUserState(e)}
                onKeyPress={this.enterForm}
              />
            </FormGroup>
          </Col>
          <Col sm="12" md="4">
            <FormGroup>
              <Label for="lastName">
                <span className="text-danger">* </span>
                Nom
              </Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="votre nom de famille"
                value={user.lastName}
                style={inputAttempt && !user.lastName ? warning : {}}
                onChange={e => this.setUserState(e)}
                onKeyPress={this.enterForm}
              />
            </FormGroup>
          </Col>
          <Col sm="12" md="4">
            <FormGroup>
              <Label for="birthday">
                Date de naissance
              </Label>
              <Input
                invalid={(user.birthday && this.invalidBirthdate(user.birthday)) || dobNotValid}
                type="text"
                name="birthday"
                id="birthday"
                placeholder="date de naissance – ex: 30/09/1982"
                value={user.birthday}
                onChange={e => this.setUserState(e)}
                onKeyPress={this.enterForm}
              />
              <FormFeedback>date de naissance non valide (format requis: JJ/MM/AAAA)</FormFeedback>
              {!this.birthdateRegex.test(user.birthday) && user.birthday.length <= 9 ? (
                <div className="invalidDOB">
                  <p>Format: JJ/MM/AAAA</p>
                </div>
              ) : <div />
              }
            </FormGroup>
          </Col>
        </Row>
        <Row className="justify-content-around">
          <Col sm="12" md="6">
            <FormGroup>
              <Label for="email">
                <span className="text-danger">* </span>
                E-mail
              </Label>
              <Input
                invalid={this.validEmail(user.email)}
                type="email"
                name="email"
                id="email"
                placeholder="votre adresse mail"
                value={user.email}
                style={inputAttempt && !this.mailRegex.test(user.email) ? warning : {}}
                onChange={e => this.setUserState(e)}
                onKeyPress={this.enterForm}
              />
              <FormFeedback>adresse mail non valide</FormFeedback>
            </FormGroup>
          </Col>
          <Col sm="12" md="6">
            <FormGroup>
              <Label for="phone">
                <span className="text-danger">* </span>
                Téléphone
              </Label>
              <Input type="text" name="phone" id="phone" placeholder="votre numéro de téléphone" value={user.phone} style={inputAttempt && user.phone.length < 10 ? warning : {}} onChange={e => this.setUserState(e)} onKeyPress={this.enterForm} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm="12" md="6">
            <FormGroup>
              <Label>
                Commentaire à Giluna
              </Label>
              <Input type="textarea" id="comment" value={comment} onChange={e => this.updateState(e)} onKeyPress={this.enterForm} />
            </FormGroup>
          </Col>
          <Col sm="12" md="6">
            <FormGroup>
              <Label>
                Ajoutez une carte à votre Commande
              </Label>
              <Input type="textarea" id="giftcard" value={giftcard} onChange={e => this.updateState(e)} onKeyPress={this.enterForm} />
            </FormGroup>
          </Col>
        </Row>
        <Row className="back-btn-userinfo">
          <button
            type="button"
            onClick={e => this.handleClick(e)}
            className="btn-confirmation"
          >
            Envoyer la commande
          </button>
        </Row>
      </Container>
    );
  }
}
UserInfo.propTypes = {
  cake: PropTypes.shape({}).isRequired,
  order: PropTypes.shape({}).isRequired,
  updateUser: PropTypes.func.isRequired,
  customer: PropTypes.shape({}).isRequired,
  comment: PropTypes.string.isRequired,
  giftcard: PropTypes.string.isRequired,
  customWishes: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  cake: state.cakeCharacteristics,
  order: state.orderCharacteristics,
  customWishes: state.customizationCustomer,
  customer: state.customerInfo,
  customization: state.customizationCustomer,
  comment: state.cakeCharacteristics.comment,
});

const mapDispatchToProps = dispatch => ({
  updateUser: data => dispatch(updateUserInfo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);