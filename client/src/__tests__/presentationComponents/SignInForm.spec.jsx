import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import SigninForm from '../../components/presentation/SigninForm';

describe('The signinform component:', () => {
  const history = { push: url => url };
  const response = 'successful';
  const props = {
    signInUser: jest.fn(() => Promise.resolve(response)),
    allDocuments: jest.fn(() => Promise.resolve()),
    submitButton: 'submit',
    roleType: 'Admin',
    history,
  };
  const enzymeWrapper = mount(<SigninForm {...props} />);
  test('should render the signinform correctly', () => {
    const component = renderer.create(
      <SigninForm {...props} />
  );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test(`should submit the form by firing signInUser when
  it is valid and the submit button is clicked`, () => {
    const event = {
      preventDefault: () => 'hello',
    };
    enzymeWrapper.find('button#signin').props().onClick(event);
    expect(props.signInUser.mock.calls.length).toBe(1);
  });
});
