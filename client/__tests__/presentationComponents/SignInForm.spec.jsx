import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import SigninForm from '../../components/presentation/SigninForm';

describe('The signinform component:', () => {
  const history = { push: url => url };
  const props = {
    signInUser: jest.fn(() => Promise.resolve()),
    allDocuments: jest.fn(() => Promise.resolve()),
    submitButton: 'submit',
    roleType: 'Admin',
    history,
  };
  const enzymeWrapper = mount(<SigninForm {...props} />);
  test('should render the signinform correctly', () => {
    const res = {
      status: 'successful',
    };
    const signInUser = jest.fn(() => Promise.resolve(res));
    const allDocuments = jest.fn(() => Promise.resolve());
    const submitButton = 'submit';
    const roleType = 'Admin';
    const component = renderer.create(
      <SigninForm
        history={history}
        signInUser={signInUser}
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
    enzymeWrapper.find('button#signinbtn').props().onClick(event);
    expect(props.signInUser.mock.calls.length).toBe(1);
  });
});
