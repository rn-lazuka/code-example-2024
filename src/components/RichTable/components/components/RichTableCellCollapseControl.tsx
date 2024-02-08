import CollapseButton from '@components/CollapseButton/CollapseButton';

interface RichTableCellCollapseControlProps {
  isCollapsed: boolean;
  onClick: () => void;
}

const RichTableCellCollapseControl = ({ isCollapsed, onClick }: RichTableCellCollapseControlProps) => {
  return <CollapseButton isCollapsed={isCollapsed} onClick={onClick} />;
};

export default RichTableCellCollapseControl;
