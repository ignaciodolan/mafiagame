import styled from 'styled-components';

const Header = styled.header`
  position: relative;
  margin: 0 3rem;
  @media (max-width: 576px) {
    margin: 0 1rem;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Form = styled.form`
  padding-top: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Button = styled.button`
  height: 1.75rem;
  background-color: var(--semiwhite-color);
  border-radius: 0.25rem;
  border-width: 2px;
  box-shadow: 3px 3px 0 #002f3c;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 0.875rem;
`;
const JoinGame = styled(Button)`
  margin-top: -10px;
`;

const CreateGame = styled(Button)`
  height: 4rem;
  width: 12rem;
  font-size: 1.25rem;
`;
const ShuffleButton = styled(Button)`
  height: 4rem;
  width: 12rem;
  font-size: 1.25rem;
`;

const LeftImage = styled.img`
  position: absolute;
  width: 250px;
  top: -50px;
  left: -50px;
  z-index: 10;
  @media (max-width: 576px) {
    display: none;
  }
`;
const RightImage = styled.img`
  position: absolute;
  bottom: -50px;
  right: -50px;
  z-index: 10;
  @media (max-width: 576px) {
    display: none;
  }
`;
const ArrowRight = styled.img`
  width: 100px;
  top: 30px;
  right: 0;
  z-index: 10;
  position: absolute;
  top: -15px;
  left: 220px;
`;
const FloatingTitle = styled.span`
  position: absolute;
  bottom: 0px;
  margin-bottom: -1rem;
  font-size: 3em;
  color: var(--secondary-color);

  @media (max-width: 576px) {
    font-size: 1em;
    line-height: 0.8;
    margin: 0;
  }
`;
const FloatingTitleLeft = styled(FloatingTitle)`
  left: 0px;
`;
const FloatingTitleRight = styled(FloatingTitle)`
  right: 0px;
`;
const Paragraph = styled.p`
  margin: 1em;
  font-size: 2em;
  transform: rotate(-5deg);
  color: var(--default-color);
`;
const Main = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 4rem 3rem;
  align-items: center;
  background-color: var(--secondary-color);
  color: var(--default-color);
  height: 100%;

  @media (max-width: 576px) {
    margin: 3rem 1rem;
    overflow: hidden;
  }
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: ${({ column }) => (column ? 'column' : 'row')};
`;
const Input = styled.input`
  font-size: 1.25rem;
  background-color: var(--default-color);
  color: var(--secondary-color);
  border: none;
  width: 9em;
  padding: 1.25rem;
  border-radius: 0.25rem;
  ::placeholder {
    text-align: center;
    color: var(--secondary-color);
    opacity: 1; /* Firefox */
  }
`;

const UnorderedList = styled.ul`
  list-style: none;
`;
export {
  Header,
  Section,
  Form,
  Button,
  JoinGame,
  CreateGame,
  ShuffleButton,
  Main,
  Container,
  UnorderedList,
  Input,
  RightImage,
  LeftImage,
  ArrowRight,
  FloatingTitleRight,
  FloatingTitleLeft,
  Paragraph,
};
