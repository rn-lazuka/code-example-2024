import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChangeStatusButton } from '@components//pages/PatientProfile/PatientStatusBlock/components/ChangeStatusButton';

describe('ChangeStatusButton', () => {
  it('renders ChangeStatusButton component', () => {
    render(<ChangeStatusButton onClick={() => {}} />);
    const buttonElement = screen.getByText('patientStatusBlock.changeStatus');
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls onClick prop when button is clicked', () => {
    const onClickMock = jest.fn();
    render(<ChangeStatusButton onClick={onClickMock} />);
    const buttonElement = screen.getByText('patientStatusBlock.changeStatus');
    fireEvent.click(buttonElement);
    expect(onClickMock).toHaveBeenCalled();
  });
});
