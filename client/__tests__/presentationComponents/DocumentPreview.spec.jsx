import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { DocumentPreview,
    getDocument } from '../../components/presentation/DocumentPreview';
import '../../mockObjects/localStorage';

describe('The DocumentPreview component:', () => {
  const event = {
    preventDefault: () => 'hello',
  };
  const props = {
    userDocuments: [{
      title: 'jackson goes to school',
      body: 'jackson goes to church',
      id: 1,
      userId: 2,
    }],
    readDocument: jest.fn(() => Promise.resolve()),
    read: 1,
    deleteId: 1,
    history: { push: jest.fn() },
    deleteDocument: jest.fn(() => Promise.resolve()),
    paginateDocument: jest.fn(() => Promise.resolve()),
    documentAccess: 'Admin',
    currentPage: 1,
    documentsCount: 1,
    roleType: 'Learning',
    userId: 1,
  };
  test('should render the DocumentPreview component correctly', () => {
    const enzymeWrapper = shallow(<DocumentPreview {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should fire readDocument when #1 button is clicked',
    () => {
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      enzymeWrapper.find('button[name="read-doc"]').props().onClick(event);
      expect(props.readDocument.mock.calls.length).toBe(1);
    });

  test('should set #1 button text to opening when document id = read',
    () => {
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      expect(enzymeWrapper.find('button[name="read-doc"]')
      .text()).toBe('Opening ');
    });

  test('should set #1 button text to Read when document id !== read',
    () => {
      props.read = 2;
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      expect(enzymeWrapper.find('button[name="read-doc"]')
      .text()).toBe('Read ');
    });

  test(`should set delete button text to deleting
    when deleteid === document id`,
    () => {
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      expect(enzymeWrapper.find('button[name="delete-doc"]')
      .text()).toBe('Deleting ');
    });

  test(`should set delete button text to delete
    when deleteid !== document id`,
    () => {
      props.deleteId = 5;
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      expect(enzymeWrapper.find('button[name="delete-doc"]')
      .text()).toBe('Delete ');
    });

  test('should fire readDocument when button[name="read-doc"] is clicked',
    () => {
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      enzymeWrapper.find('button[name="read-doc"]').props().onClick(event);
      expect(props.readDocument.mock.calls.length).toBe(2);
    });

  test('should fire deleteDocument when button[name="delete-doc"] is clicked',
    () => {
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      enzymeWrapper.find('button[name="delete-doc"]').props().onClick(event);
      expect(props.deleteDocument.mock.calls.length).toBe(0);
    });

  test('should fire paginateDocument is fired when getDocument() runs',
    () => {
      getDocument(1, props.paginateDocument, 'Learning', 'Learning', 1);
      expect(props.paginateDocument.mock.calls.length).toBe(1);
    });
});