import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ReadDocument from '../../components/presentation/ReadDocument';

describe('The ReadDocument component:', () => {
  const event = {
    preventDefault: () => 'hello',
  };
  const props = {
    documentTitle: 'jackson goes to school',
    body: 'I have a friend whose name is jackson',
    author: 'jackson',
    modifiedDate: 'june 20, 2010',
    history: { push: jest.fn() },
    changeTitleValue: jest.fn(),
    editDocument: jest.fn(() => Promise.resolve()),
    documentId: 1,
    docStatus: 'successful',
    userId: 5,
    roleType: 'Learning',
    ownerId: 5,
  };
  const enzymeWrapper = shallow(<ReadDocument {...props} />);
  test('should render the ReadDocument component correctly', () => {
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should fire changeTitleValue when #title input text changes',
    () => {
      enzymeWrapper.find('#readdocument #title').props().onChange();
      expect(props.changeTitleValue.mock.calls.length).toBe(1);
    });

  test('should display form elements to edit the documents',
    () => {
      enzymeWrapper.find('#editbtn').props().onClick(event);
      expect(enzymeWrapper.find('#docbody').hasClass('hide')).toBe(false);
      expect(enzymeWrapper.find('#docbodyedit').hasClass('hide')).toBe(true);
      expect(enzymeWrapper.find('#submitbtn').hasClass('hide')).toBe(true);
    });

  test('should call processEdit editDocument',
    () => {
      enzymeWrapper.find('#submitbtn').props().onClick(event);
      expect(props.editDocument.mock.calls.length).toBe(2);
    });
});
