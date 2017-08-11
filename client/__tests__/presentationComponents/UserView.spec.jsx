import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import UserView from '../../components/presentation/UserView';
import '../../mockObjects/localStorage';

describe('The UserView component:', () => {
  const props = {
    userName: 'jackson',
    userId: 2,
    userEmail: 'jackson@gmail.com',
    updateStatus: 'updating',
    changeInputValue: jest.fn(),
    createdAt: 'sun june 3, 2013',
    roleType: 'Learning',
    editUserDetail: jest.fn(() => Promise.resolve()),
  };
  const enzymeWrapper = mount(<UserView {...props} />);
  test('should render the userview component correctly', () => {
    const component = renderer.create(<UserView {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should fire changeInputValue when userEmail input text changes',
  () => {
    enzymeWrapper.find('#userEmail').props().onChange();
    expect(props.changeInputValue.mock.calls.length).toBe(1);
  });

  test('should fire editUserDetail when submitting the changes',
  () => {
    const event = {
      preventDefault: () => 'hello',
    };
    enzymeWrapper.find('#submitedit').props().onClick(event);
    expect(props.editUserDetail.mock.calls.length).toBe(1);
  });

  test('should unhide the submit button when the edit button is clicked',
  () => {
    const event = {
      preventDefault: () => 'hello',
    };
    enzymeWrapper.find('#editbtn').props().onClick(event);
    expect(enzymeWrapper.find('#editbtn').hasClass('hide')).toBe(false);
  });
});
