import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import SignupForm from '../../components/presentation/SignupForm';

describe('The signupform component:', () => {
  const history = { push: url => url };
  const props = {
    signUserUp: jest.fn(() => Promise.resolve()),
    allDocuments: jest.fn(() => Promise.resolve()),
    submitButton: 'submit',
    roleType: 'Admin',
    history,
  };
  const enzymeWrapper = mount(<SignupForm {...props} />);
  test('should render the signup form correctly', () => {
    const signUserUp = jest.fn(() => Promise.resolve());
    const allDocuments = jest.fn(() => Promise.resolve());
    const submitButton = 'submit';
    const roleType = 'Admin';
    const component = renderer.create(
      <SignupForm
        history={history}
        signUserUp={signUserUp}
        submitButton={submitButton}
        roleType={roleType}
        allDocuments={allDocuments}
      />
  );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should change submit button when it is clicked', () => {
    const event = {
      preventDefault: () => 'hello',
    };
    enzymeWrapper.find('button#signupbtn').props().onClick(event);
    expect(enzymeWrapper.find('button#signupbtn').text()).toBe('submit');
  });
});
