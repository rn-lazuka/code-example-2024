import { screen } from '@testing-library/dom';
import { getTestStoreAndDispatch, render } from '@unit-tests/_utils';
import { StackBlock } from '@components/StackBlock/StackBlock';
import { UserPermissions } from '@enums';
import { cardStackBlockFixture } from '@unit-tests/fixtures';

describe('StackBlock', () => {
  it('renders StackBlock correctly', () => {
    const permission = UserPermissions.PatientAdd;
    const { store } = getTestStoreAndDispatch({
      user: {
        user: {
          permissions: [permission],
        },
      },
    });
    const title = 'Test Title';
    const cards = [cardStackBlockFixture({ permission }), cardStackBlockFixture({ permission })];

    render(<StackBlock title={title} cards={cards} />, {
      store,
    } as any);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByTestId('StackBlockTitle')).toBeInTheDocument();
    expect(screen.getByText(cards[0].title)).toBeInTheDocument();
    expect(screen.getByText(cards[1].title)).toBeInTheDocument();
  });

  it('should render only cards with permissions', () => {
    const permission = UserPermissions.PatientAdd;
    const { store } = getTestStoreAndDispatch({
      user: {
        user: {
          permissions: [permission],
        },
      },
    });
    const title = 'Test Title';
    const cards = [cardStackBlockFixture({ permission }), cardStackBlockFixture({})];

    render(<StackBlock title={title} cards={cards} />, {
      store,
    } as any);

    expect(screen.getByText(cards[0].title)).toBeInTheDocument();
    expect(screen.queryByText(cards[1].title)).not.toBeInTheDocument();
  });

  it('should render only cards with permissions and when user has them', () => {
    const permission = UserPermissions.PatientAdd;
    const { store } = getTestStoreAndDispatch({
      user: {
        user: {
          permissions: [permission],
        },
      },
    });
    const title = 'Test Title';
    const cards = [
      cardStackBlockFixture({ permission }),
      cardStackBlockFixture({ permission: UserPermissions.ClinicalScheduleSuitModify }),
    ];

    render(<StackBlock title={title} cards={cards} />, {
      store,
    } as any);

    expect(screen.getByText(cards[0].title)).toBeInTheDocument();
    expect(screen.queryByText(cards[1].title)).not.toBeInTheDocument();
  });
});
